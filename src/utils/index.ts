export const delayRequest = async (ms: number, info?: string) =>
  new Promise((resolve) => setTimeout(() => resolve(console.log(info)), ms));
