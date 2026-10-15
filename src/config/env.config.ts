import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'sena_controllabs_secret_key_adso_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  cors: {
    origin: process.env.ALLOWED_ORIGIN || '*',
  },
};

export default config;
