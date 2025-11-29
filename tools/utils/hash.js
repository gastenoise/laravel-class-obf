import crypto from 'crypto';

const BASE62_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function toBase62(buffer) {
    let value = BigInt('0x' + buffer.toString('hex'));
    let output = '';

    if (value === 0n) return '0';

    while (value > 0) {
        const remainder = Number(value % 62n);
        output = BASE62_ALPHABET[remainder] + output;
        value /= 62n;
    }

    return output;
}

export function obfFor(name, secret, tokenLen) {
    if (!secret || secret.length === 0) {
        throw new Error('CLASS_OBF_SECRET is required');
    }

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(name, 'utf8');
    const digest = hmac.digest();

    const base62 = toBase62(digest);
    const token = base62.slice(0, tokenLen);

    return 'c' + token;
}
