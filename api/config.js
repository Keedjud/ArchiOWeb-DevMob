// Central configuration, read from environment variables.

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be set in production');
}

export const port = Number(process.env.PORT) || 3000;
export const databaseUrl =
  process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/bomb';
export { jwtSecret };

export default { port, databaseUrl, jwtSecret };
