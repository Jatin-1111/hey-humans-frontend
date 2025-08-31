import jwt from 'jsonwebtoken';

export async function authenticate(req) {
    try {
        const authHeader = req.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { success: false, error: 'No token provided' };
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return { success: false, error: 'No token provided' };
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return {
            success: true,
            user: decoded
        };

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return { success: false, error: 'Token expired' };
        }

        if (error.name === 'JsonWebTokenError') {
            return { success: false, error: 'Invalid token' };
        }

        return { success: false, error: 'Authentication failed' };
    }
}

export async function requireAuth(req, allowedRoles = []) {
    const authResult = await authenticate(req);

    if (!authResult.success) {
        return authResult;
    }

    // Check role if specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(authResult.user.role)) {
        return { success: false, error: 'Insufficient permissions' };
    }

    return authResult;
}
