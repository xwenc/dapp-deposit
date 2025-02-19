import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocation, NavLink } from "react-router-dom";
import cx from "classnames";
import { hooks, metaMask } from "@connections/metaMask";
import Logo from "@assets/logo.png";

import { CHAINS, getAddChainParameters } from "@utils/chains";

const {
  useChainId,
  useAccounts,
  useIsActivating,
  useIsActive,
  useProvider,
  useENSNames,
} = hooks;

const Header = () => {
  const [error, setError] = useState<Error | undefined>();
  const location = useLocation();
  const navigation = [
    { name: "首页", href: "/", current: location.pathname === "/" },
    { name: "钱包", href: "/dapp", current: location.pathname === "/dapp" },
  ];
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
          duration: 5000,
        }
      );
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
          duration: 5000,
        }
      );
    } catch (err) {
      toast.error("Failed to disconnect from MetaMask");
    }
  }, []);

  // attempt to connect eagerly on mount
  // useEffect(() => {
  //   void metaMask.connectEagerly().catch(() => {
  //     console.debug("Failed to connect eagerly to metamask");
  //   });
  // }, []);

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img alt="Your Company" src={Logo} className="h-8 w-auto" />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={cx(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {!isActive ? (
              <button
                type="button"
                className="rounded-md px-3 py-2 text-sm font-medium border border-gray-400 text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={onConnect}
                disabled={isActivating}
              >
                Connect to Wallet
              </button>
            ) : (
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative rounded-full px-2.5 py-0.5 flex bg-gray-800 border border-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <span className="font-medium leading-8 text-gray-300 dark:text-gray-100">
                      {account?.[0].slice(0, 6)}...
                    </span>
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                      onClick={onDisconnect}
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={cx(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default Header;
