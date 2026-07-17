import { Router, Response } from 'express';
import { randomUUID } from 'node:crypto';
import multer from 'multer';
import { AccessToken } from 'livekit-server-sdk';
import { RoomAgentDispatch, RoomConfiguration } from '@livekit/protocol';
import { supabaseAdmin } from '@irshaad/database';
import { extractText } from '../services/tika.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

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
        // Extract text using Apache Tika
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
      at.roomConfig = new RoomConfiguration({
        agents: [
          new RoomAgentDispatch({
            agentName: AGENT_NAME,
            metadata: JSON.stringify({ sessionId }),
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

export default router;
