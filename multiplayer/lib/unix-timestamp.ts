export const getCurrentUnixTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

export const isCurrentTimeGreaterThan = (timestamp: number): boolean => {
  return getCurrentUnixTimestamp() > timestamp;
};
