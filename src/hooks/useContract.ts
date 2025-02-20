import { useCallback, useMemo, useState, useEffect } from "react";
import contractConfig from "@abis/defiDepositContract.json";
import type { DefiDepositContract } from "@utils/types";
import {
  Contract,
  parseEther,
  formatEther,
  ContractTransactionResponse,
} from "ethers";
import useWallet from "./useWallet";
import toast from "react-hot-toast";

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

const useContract = () => {

  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState<any | null>(null);
  const config = contractConfig as DefiDepositContract;
  const { provider, account, fetchBalance } = useWallet();
  const contractAbi = useMemo(() => config.abi, [config.abi]);
  const contractAddress = useMemo(() => {
    if (NETWORK_ID) {
      return config.networks[NETWORK_ID]?.address;
    }
    return null;
  }, [config.networks, NETWORK_ID]);
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [erc20Balance, setErc20Balance] = useState<string | null>(null);

  const getEthBalance = useCallback(async () => {
    try {
      if (contract) {
        const balance = await contract.ethBalance();
        setEthBalance(formatEther(balance));
      }
    } catch (err) {
      console.error(err);
    }
  }, [contract, account]);

  const getERC20Balance = useCallback(async () => {
    try {
      if (contract) {
        const balance = await contract.erc20Balance();
        setErc20Balance(formatEther(balance));
      }
    } catch (err) {
      console.error(err);
    }
  }, [contract, account]);

  const updateBalance = useCallback(async () => {
    getEthBalance();
    getERC20Balance();
    fetchBalance();
  }, [getERC20Balance, getEthBalance, fetchBalance]);

  // console.log("contractAddress: ", contractAddress);
  // console.log("contractAbi: ", contractAbi);
  // console.log("provider: ", provider);
  // console.log("account: ", account);

  const ethDeposit = useCallback(
    async (amount: number) => {
      try {
        if (contract) {
          const _tx: ContractTransactionResponse = await contract.ethDeposit({
            value: parseEther(String(amount)),
          });
          setLoading(true);
          const tx = await _tx.getTransaction();
          if (tx) {
            await tx.wait();
            setLoading(false);
            toast.success("ETH deposited successfully");
            await getEthBalance();
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to deposit ETH");
      } finally {
        setLoading(false);
      }
    },
    [contract]
  );

  const erc20Deposit = useCallback(
    async (amount: number) => {
      try {
        if (contract) {
          setLoading(true);
          const _tx = await contract.erc20Deposit(parseEther(String(amount)));
          const tx = await _tx.getTransaction();
          if (tx) {
            await tx.wait();
            setLoading(false);
            toast.success("YIDENG coin deposited successfully");
            await getERC20Balance();
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to deposit YIDENG coin");
      } finally {
        setLoading(false);
      }
    },
    [contract]
  );

  const ethWithdraw = useCallback(
    async (amount: number) => {
      try {
        if (contract) {
          setLoading(true);
          const _tx = await contract.ethWithdraw(parseEther(String(amount)));
          const tx = await _tx.getTransaction();
          if (tx) {
            await tx.wait();
            setLoading(false);
            toast.success("ETH withdrawn successfully");
            await getEthBalance();
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to withdraw ETH");
      } finally {
        setLoading(false);
      }
    },
    [contract]
  );

  const erc20Withdraw = useCallback(
    async (amount: number) => {
      try {
        if (contract) {
          setLoading(true);
          const _tx = await contract.erc20Withdraw(parseEther(String(amount)));
          const tx = await _tx.getTransaction();
          if (tx) {
            await tx.wait();
            setLoading(false);
            toast.success("YIDENG coin withdrawn successfully");
            await getERC20Balance();
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to withdraw YIDENG coin");
      } finally {
        setLoading(false);
      }
    },
    [contract]
  );

  useEffect(() => {
    if (contractAddress && contractAbi && provider && account) {
      const signer = provider.getSigner(account);
      const contract = new Contract(
        contractAddress,
        contractAbi,
        signer as any
      );
      setContract(contract);
    }
  }, [contractAddress, contractAbi, provider, account]);

  useEffect(() => {
    updateBalance();
    const interval = setInterval(updateBalance, 5000);
    return () => clearInterval(interval);
  }, [updateBalance]);

  return {
    loading,
    contract,
    ethBalance,
    erc20Balance,
    ethDeposit,
    erc20Deposit,
    ethWithdraw,
    erc20Withdraw,
  };
};

export default useContract;
