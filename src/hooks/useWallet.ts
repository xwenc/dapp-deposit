import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { hooks, metaMask } from "@connections/metaMask";
import { getAddChainParameters } from "@utils/chains";
import { useNavigate } from "react-router-dom";

const { useAccounts, useIsActivating, useIsActive } = hooks;

const useWallet = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<Error | undefined>();
  const isActive = useIsActive();
  const isActivating = useIsActivating();
  const account = useAccounts();
  const connect = useCallback(
    async (desiredChainId: number) => {
      try {
        await metaMask.activate(getAddChainParameters(desiredChainId));
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
  }, [metaMask]);

  const onConnect = useCallback(async () => {
    try {
      await toast.promise(
        connect(11155111),
        {
          loading: "Connecting to MetaMask...",
          success: "Connected to MetaMask",
          error: "Failed to connect to MetaMask",
        },
        {
          duration: 3000,
        }
      );
      navigate("/dapp");
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
      navigate("/");
    } catch (err) {
      toast.error("Failed to disconnect from MetaMask");
    }
  }, []);
  return { onConnect, onDisconnect, isActive, isActivating, account, error };
};

export default useWallet;
