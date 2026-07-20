import { Router, Response } from 'express';
import { randomUUID } from 'node:crypto';
import multer from 'multer';
import { AccessToken } from 'livekit-server-sdk';
import { RoomAgentDispatch, RoomConfiguration } from '@livekit/protocol';
import { supabaseAdmin } from '@irshaad/database';
import { extractText } from '../services/tika.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { buildCoachInstructions } from '@irshaad/utils';

const router = Router();

// Multer in-memory storage, 5MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const ALLOWED_MIME_TYPES = new Set([
  'text/plain',
  'text/markdown',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const ALLOWED_EXTENSIONS = new Set(['.txt', '.md', '.pdf', '.docx']);

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;
const AGENT_NAME = process.env.LIVEKIT_AGENT_NAME || 'interview-coach';

// POST /session/create
// Creates a new interview session and returns a LiveKit access token
router.post(
  '/create',
  requireAuth,
  upload.single('resume'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const jobDescription = req.body.jobDescription;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!jobDescription || typeof jobDescription !== 'string') {
        return res.status(400).json({ error: 'jobDescription is required' });
      }

      let resumeText = '';

      if (req.file) {
        // Validate mime type
        if (!ALLOWED_MIME_TYPES.has(req.file.mimetype)) {
          return res.status(400).json({ error: 'Invalid file type' });
        }
        // Extract text using local parsers (pdf-parse, mammoth)
        try {
          resumeText = await extractText(req.file.buffer, req.file.originalname);
        } catch (tikaError) {
          console.error('[api-server] Tika extraction failed:', tikaError);
          return res.status(500).json({ error: 'Failed to extract text from resume' });
        }
      } else if (req.body.resumeText) {
        resumeText = req.body.resumeText;
      }

      if (!resumeText) {
        return res.status(400).json({ error: 'Resume (file upload or raw text) is required' });
      }

      const sessionId = randomUUID();
      const roomName = `interview-${sessionId}`;
      const participantIdentity = `candidate-${sessionId}`;

      // Store in Supabase using admin client (to bypass RLS check for server role insertion)
      const { error: dbError } = await supabaseAdmin.from('sessions').insert({
        id: sessionId,
        user_id: user.id,
        job_description: jobDescription,
        resume_text: resumeText,
        status: 'created',
      });

      if (dbError) {
        console.error('[api-server] DB error inserting session:', dbError);
        return res.status(500).json({ error: 'Failed to create session in database' });
      }

      if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
        console.error('[api-server] LiveKit credentials not configured');
        return res.status(500).json({ error: 'LiveKit configuration error' });
      }

      // Generate Access Token
      const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
        identity: participantIdentity,
        ttl: '30m',
      });

      at.addGrant({
        room: roomName,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
      });

      // Embed agent dispatch configuration
      const instructions = buildCoachInstructions(jobDescription, resumeText);
      at.roomConfig = new RoomConfiguration({
        agents: [
          new RoomAgentDispatch({
            agentName: AGENT_NAME,
            metadata: JSON.stringify({ sessionId, instructions }),
          }),
        ],
      });

      const token = await at.toJwt();

      return res.status(201).json({
        sessionId,
        token,
        roomName,
        serverUrl: LIVEKIT_URL || '',
      });
    } catch (err) {
      console.error('[api-server] Unexpected error creating session:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /session/history
// Returns user's past sessions and feedback
router.get(
  '/history',
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user!;
      
      const { data, error } = await supabaseAdmin
        .from('sessions')
        .select(`
          id,
          job_description,
          status,
          created_at,
          interview_summaries (
            transcript,
            feedback
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[api-server] DB error fetching history:', error);
        return res.status(500).json({ error: 'Failed to fetch interview history' });
      }

      return res.json(data);
    } catch (err) {
      console.error('[api-server] Unexpected error fetching history:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /session/:id/feedback
// Returns the feedback for a specific session
router.get(
  '/:id/feedback',
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      const sessionId = req.params.id;

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // First check if the session exists and belongs to the user
      const { data: session, error: fetchError } = await supabaseAdmin
        .from('sessions')
        .select('user_id')
        .eq('id', sessionId)
        .single();

      if (fetchError || !session) {
        console.error('[api-server] Error checking session ownership:', fetchError);
        return res.status(404).json({ error: 'Session not found' });
      }

      if (session.user_id !== user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const { data, error } = await supabaseAdmin
        .from('interview_summaries')
        .select('transcript, feedback')
        .eq('session_id', sessionId)
        .single();

      if (error) {
        return res.status(404).json({ error: 'Feedback not found' });
      }

      return res.json(data);
    } catch (err) {
      console.error('[api-server] Unexpected error fetching feedback:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /session/:id
// Deletes a session and its associated feedback (handled by cascading delete)
router.delete(
  '/:id',
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      const sessionId = req.params.id;

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // First check if the session exists and belongs to the user
      const { data: session, error: fetchError } = await supabaseAdmin
        .from('sessions')
        .select('user_id')
        .eq('id', sessionId)
        .single();

      if (fetchError || !session) {
        console.error('[api-server] Error checking session ownership:', fetchError);
        return res.status(404).json({ error: 'Session not found' });
      }

      if (session.user_id !== user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const { error: deleteError } = await supabaseAdmin
        .from('sessions')
        .delete()
        .eq('id', sessionId);

      if (deleteError) {
        console.error('[api-server] DB error deleting session:', deleteError);
        return res.status(500).json({ error: 'Failed to delete session' });
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('[api-server] Unexpected error deleting session:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;

