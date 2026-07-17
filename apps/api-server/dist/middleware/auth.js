import { supabase } from '@irshaad/database';
export async function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid authorization header' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token not found in auth header' });
        }
        // Validate the token against Supabase Auth
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
        // Attach user to request object
        req.user = user;
        next();
    }
    catch (error) {
        console.error('[auth middleware] Unexpected error:', error);
        return res.status(500).json({ error: 'Internal server error during authentication' });
    }
}
