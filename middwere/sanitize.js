const cleanXSS = (str) => {
    if (typeof str !== 'string') return '';
    return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .trim();
};

const pickSafeFields = (body) => {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return { error: 'Body harus object JSON.' };
    }
    const title = cleanXSS(body.title);
    const description = cleanXSS(body.description || '');
    if ('$gt' in body || '$where' in body || 'title' in body && typeof body.title !== 'string') {
        return { error: 'Format input tidak valid.' };
    }
    if (typeof body.title !== 'string') {
        return { error: 'title wajib string.' };
    }
    if (body.description !== undefined && typeof body.description !== 'string') {
        return { error: 'description harus string.' };
    }
    return { title, description };
};

module.exports = { cleanXSS, pickSafeFields };