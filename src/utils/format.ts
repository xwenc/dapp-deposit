export const formatBalance = (balance: string) => {
  return (parseFloat(balance) / 1e18).toFixed(4); // Convert wei to eth and format to 4 decimal places
};
