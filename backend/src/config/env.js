import 'dotenv/config';

const isPlaceholder = (v) => !v || v.startsWith('<<<');

const required = [
  'MONGODB_URI',
  'IMAGEKIT_PRIVATE_KEY',
  'IMAGEKIT_PUBLIC_KEY',
  'IMAGEKIT_URL_ENDPOINT',
];
const missing = required.filter((k) => isPlaceholder(process.env[k]));
if (missing.length) {
  console.error(
    `\n✖ Missing values in .env: ${missing.join(', ')}\n  Open .env and fill them in, then restart.\n`
  );
  process.exit(1);
}

const nodeEnv = process.env.NODE_ENV || 'development';
const list = (v = '') =>
  v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

export const env = {
  nodeEnv,
  isProd: nodeEnv === 'production',
  port: Number(process.env.PORT) || 5000,
  clientOrigins: list(process.env.CLIENT_ORIGIN || 'http://localhost:5173'),
  mongoUri: process.env.MONGODB_URI,
  imagekit: {
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    folder: process.env.IMAGEKIT_FOLDER || '/civicconnect/complaints',
  },
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminEmails: list(process.env.ADMIN_EMAILS).map((email) => email.toLowerCase()),
};

if (env.isProd && env.jwtSecret.length < 32) {
  console.error('✖ JWT_SECRET must be at least 32 characters in production.');
  process.exit(1);
}
