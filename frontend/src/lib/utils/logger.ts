type LogPayload = unknown;

export const logger = {
  info: (message: string, payload?: LogPayload) => {
    console.info(`[EcoTwin] ${message}`, payload);
  },
  warn: (message: string, payload?: LogPayload) => {
    console.warn(`[EcoTwin] ${message}`, payload);
  },
  error: (message: string, payload?: LogPayload) => {
    console.error(`[EcoTwin] ${message}`, payload);
  }
};
