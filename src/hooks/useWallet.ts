import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { hooks, metaMask } from "@connections/metaMask";
import { getAddChainParameters } from "@utils/chains";
import { useNavigate } from "react-router-dom";
import { formatBalance } from "@utils/format";

const { useAccounts, useIsActivating, useIsActive, useProvider } = hooks;

const REACT_APP_NETWORK_ID = Number(process.env.REACT_APP_NETWORK_ID);

const useWallet = () => {
 
  const [balance, setBalance] = useState<string | null>(null);
  const navigate = useNavigate();
  const [error, setError] = useState<Error | undefined>();
  const isActive = useIsActive();
  const isActivating = useIsActivating();
  const provider = useProvider();
  const account = useAccounts();
  const connect = useCallback(
    async (desiredChainId: number) => {
      try {
        await metaMask.activate(getAddChainParameters(desiredChainId));
        navigate("/dapp");
        toast.success("Connected to MetaMask");
        setError(undefined);
      } catch (err) {
        setError(err as Error);
      }
    },
    [metaMask, setError]
  );

  const disconnect = useCallback(async () => {
    if (metaMask?.deactivate) {
      await metaMask.deactivate();
    } else {
      await metaMask.resetState();
    }
    navigate("/");
  }, [metaMask]);

  const onConnect = useCallback(async () => {
    if (!REACT_APP_NETWORK_ID) {
      toast.error("Network ID is not set");
      return;
    }
    try {
      connect(REACT_APP_NETWORK_ID);
    } catch (err) {
      toast.error("Failed to connect to MetaMask");
    }
  }, [connect]);

  const onDisconnect = useCallback(async () => {
    try {
      await toast.promise(
        disconnect(),
        {
          loading: "Disconnecting from MetaMask...",
          success: "Disconnected from MetaMask",
          error: "Failed to disconnect from MetaMask",
        },
        {
          duration: 3000,
        }
      );
    } catch (err) {
      toast.error("Failed to disconnect from MetaMask");
    }
  }, []);

  const fetchBalance = useCallback(async () => {
    if (provider && account) {
      try {
        const balance = await provider.getBalance(account[0]);
        setBalance(balance.toString());
      } catch (error) {
        toast.error("Failed to fetch balance");
      }
    }
  }, [provider, account]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    onConnect,
    onDisconnect,
    isActive,
    isActivating,
    account: account ? account[0] : null,
    error,
    provider,
    balance: balance ? formatBalance(balance) : null,
    fetchBalance,
  };
};

export default useWallet;
