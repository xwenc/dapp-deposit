import { useCallback, useMemo, useState, useEffect } from "react";
import contractConfig from "@abis/defiDepositContract.json";
import tokenConfig from "@abis/yidengCoinToken.json";
import type { ContractType } from "@utils/types";
import { ethers, Contract, parseEther, formatEther } from "ethers";
import type { ContractTransactionResponse, EtherscanProvider } from "ethers";
import useWallet from "./useWallet";
import toast from "react-hot-toast";

const NETWORK_ID = process.env.REACT_APP_NETWORK_ID;

const useContract = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [contract, setContract] = useState<any | null>(null);
  const [tokenContract, setTokenContract] = useState<any | null>(null);
  const _contractConfig = contractConfig as ContractType;
  const _tokenConfig = tokenConfig as ContractType;
  const { account, fetchBalance } = useWallet();
  const contractAbi = useMemo(() => _contractConfig.abi, [_contractConfig.abi]);
  const contractAddress = useMemo(() => {
    if (NETWORK_ID) {
      return _contractConfig.networks[NETWORK_ID]?.address;
    }
    return "";
  }, [_contractConfig.networks, NETWORK_ID]);
  const tokenAbi = useMemo(() => _tokenConfig.abi, [_tokenConfig.abi]);
  const tokenAddress = useMemo(() => {
    if (NETWORK_ID) {
      return _tokenConfig.networks[NETWORK_ID]?.address;
    }
    return "";
  }, [tokenConfig.networks, NETWORK_ID]);
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [erc20Balance, setErc20Balance] = useState<string | null>(null);

  // initialize contract
  const initializeContract = useCallback(async () => {
    try {
      if (!window.ethereum) throw new Error("请安装 MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();

      // 初始化主合约
      const defiContract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
      setContract(defiContract);

      // 初始化 ERC20 代币合约
      const erc20Contract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      setTokenContract(erc20Contract);
    } catch (err: any) {
      console.error("合约初始化错误:", err);
    }
  }, [contractAddress, tokenAddress]);

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
          setLoading(true);
          setMessage("Sending transaction...");
          const _tx: ContractTransactionResponse = await contract.ethDeposit({
            value: parseEther(String(amount)),
          });
          const tx = await _tx.getTransaction();
          setMessage("Transaction sent, waiting for confirmation...");
          if (tx) {
            await tx.wait();
            setMessage("Transaction confirmed");
            setTimeout(() => {
              setLoading(false);
            }, 2000);
            await getEthBalance();
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to deposit ETH");
      } finally {
        setLoading(false);
        setMessage("");
      }
    },
    [contract]
  );

  // 检查并授权 ERC20
  const approveERC20 = useCallback(
    async (amount: string) => {
      if (!tokenContract || !contract) throw new Error("Contract not found");

      const allowance = await tokenContract.allowance(
        tokenAddress,
        contractAddress
      );
      const amountBigInt = parseEther(amount);

      if (allowance < amountBigInt) {
        const approveTx = await tokenContract.approve(
          contractAddress,
          amountBigInt
        );
        await approveTx.wait();
      }
    },
    [tokenContract, contract, tokenAddress, contractAddress]
  );

  const erc20Deposit = useCallback(
    async (amount: number) => {
      try {
        if (contract) {
          setLoading(true);
          setMessage("Waiting for approval...");
          await approveERC20(String(amount));
          setMessage("Sending transaction...");
          const _tx = await contract.erc20Deposit(parseEther(String(amount)));
          const tx = await _tx.getTransaction();
          setMessage("Transaction sent, waiting for confirmation...");
          if (tx) {
            await tx.wait();
            setMessage("Transaction confirmed");
            setTimeout(() => {
              setLoading(false);
            }, 2000);
            await getERC20Balance();
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to deposit YIDENG coin");
      } finally {
        setLoading(false);
        setMessage("");
      }
    },
    [contract]
  );

  const ethWithdraw = useCallback(
    async (amount: number) => {
      try {
        if (contract) {
          setLoading(true);
          setMessage("Sending transaction...");
          const _tx = await contract.ethWithdraw(parseEther(String(amount)));
          const tx = await _tx.getTransaction();
          setMessage("Transaction sent, waiting for confirmation...");
          if (tx) {
            await tx.wait();
            setMessage("Transaction confirmed");
            setTimeout(() => {
              setLoading(false);
            }, 2000);
            await getEthBalance();
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to withdraw ETH");
      } finally {
        setLoading(false);
        setMessage("");
      }
    },
    [contract]
  );

  const erc20Withdraw = useCallback(
    async (amount: number) => {
      try {
        if (contract) {
          setLoading(true);
          setMessage("Sending transaction...");
          const _tx = await contract.erc20Withdraw(parseEther(String(amount)));
          const tx = await _tx.getTransaction();
          setMessage("Transaction sent, waiting for confirmation...");
          if (tx) {
            await tx.wait();
            setMessage("Transaction confirmed");
            setTimeout(() => {
              setLoading(false);
            }, 2000);
            await getERC20Balance();
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to withdraw YIDENG coin");
      } finally {
        setLoading(false);
        setMessage("");
      }
    },
    [contract]
  );

  useEffect(() => {
    initializeContract();
  }, [initializeContract]);

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
    message,
  };
};

export default useContract;
