declare global {
  namespace NodeJS {
    interface ProcessEnv {
      botToken: string;
      enviroment: 'dev' | 'prod' | 'debug';
    }
  }
}

export {};
