type LogPayload = unknown;

export const logger = {
  info: (message: string, payload?: LogPayload) => {
    console.info(`[VFluxion] ${message}`, payload);
  },
  warn: (message: string, payload?: LogPayload) => {
    console.warn(`[VFluxion] ${message}`, payload);
  },
  error: (message: string, payload?: LogPayload) => {
    console.error(`[VFluxion] ${message}`, payload);
  }
};
