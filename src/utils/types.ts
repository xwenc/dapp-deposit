export type DefiDepositContract = {
  contractName: string;
  abi: any;
  networks: {
    [networkId: string]: {
      address: string;
    };
  }
}
