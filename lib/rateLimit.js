// lib/rateLimit.js
const rateLimitMap = new Map();

export async function rateLimit(req, options = {}) {
    const {
        maxRequests = 10,
        windowMs = 15 * 60 * 1000, // 15 minutes default
        message = 'Too many requests',
        skipSuccessfulRequests = false,
        skipFailedRequests = false
    } = options;

    // Get client identifier (IP address or user ID)
    const clientId = getClientIdentifier(req);

    if (!clientId) {
        return { success: true }; // Allow if we can't identify client
    }

    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    cleanupOldEntries(windowStart);

    // Get or create client record
    if (!rateLimitMap.has(clientId)) {
        rateLimitMap.set(clientId, []);
    }

    const requests = rateLimitMap.get(clientId);

    // Remove requests outside the current window
    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    rateLimitMap.set(clientId, validRequests);

    // Check if limit exceeded
    if (validRequests.length >= maxRequests) {
        const oldestRequest = Math.min(...validRequests);
        const resetTime = oldestRequest + windowMs;
        const retryAfter = Math.ceil((resetTime - now) / 1000);

        return {
            success: false,
            error: message,
            retryAfter,
            limit: maxRequests,
            remaining: 0,
            resetTime: new Date(resetTime).toISOString()
        };
    }

    // Add current request
    validRequests.push(now);
    rateLimitMap.set(clientId, validRequests);

    return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests - validRequests.length,
        resetTime: new Date(now + windowMs).toISOString()
    };
}

function getClientIdentifier(req) {
    // Try to get IP address from various headers
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const remoteAddr = req.headers.get('remote-addr');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    return realIp || remoteAddr || 'unknown';
}

function cleanupOldEntries(windowStart) {
    for (const [clientId, requests] of rateLimitMap.entries()) {
        const validRequests = requests.filter(timestamp => timestamp > windowStart);

        if (validRequests.length === 0) {
            rateLimitMap.delete(clientId);
        } else {
            rateLimitMap.set(clientId, validRequests);
        }
    }
}