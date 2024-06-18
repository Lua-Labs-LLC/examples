export const getCurrentUnixTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};
