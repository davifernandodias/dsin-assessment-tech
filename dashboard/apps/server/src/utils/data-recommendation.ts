export const isMoreThanTwoDaysAway = (scheduledAt: Date): boolean => {
  const now = new Date();
  const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
  return scheduledAt.getTime() - now.getTime() > twoDaysInMs;
};