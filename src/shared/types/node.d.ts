declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string
      NODE_ENV: 'development' | 'production'
      PORT: string
      MONGODB_URI: string
    }
  }
}