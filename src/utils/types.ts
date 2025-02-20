export type ContractType = {
  contractName: string;
  abi: any;
  networks: {
    [networkId: string]: {
      address: string;
    };
  }
}
