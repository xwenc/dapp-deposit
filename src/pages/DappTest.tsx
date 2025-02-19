// import MetaMaskCard from '@/components/connectorCards/MetaMaskCard';
// import { DepositForm } from '@/components/DepositForm';
import { Radio, RadioGroup } from "@headlessui/react";
import { useState } from "react";
import cx from "classnames";
import Logo from "@assets/logo.png";

const options = [
  { name: "ETH", key: "eth" },
  { name: "YIDENG COIN", key: "ydc" },
];

const symbol = {
  eth: "ETH",
  ydc: "YDC",
};

export default function DappTest() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex shrink-0 items-center justify-center mx-auto w-24 h-24 rounded-full bg-indigo-500 mb-10">
          <img alt="Yideng Coin" src={Logo} className="h-24 w-auto absolute z-10" />
          <div className="absolute w-36 h-36 translate-z-0 bg-indigo-400 rounded-full blur-[80px] opacity-100"></div>
        </div>
        <div className="mb-8">
          <div className="text-sm font-semibold text-white">Your Balance</div>
          <div className="mt-2 text-4xl font-semibold text-white">
            0.0000 ETH
          </div>
        </div>
        <form action="#" method="POST" className="space-y-6">
          <fieldset>
            <legend className="text-lg font-semibold text-white">
              Choose your token
            </legend>
            <div className="mt-6 space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
              {options.map((opt) => (
                <div key={opt.key} className="flex items-center">
                  <input
                    defaultChecked={opt.key === "eth"}
                    id={opt.key}
                    name="notification-method"
                    type="radio"
                    className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-500 checked:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                  />
                  <label
                    htmlFor={opt.key}
                    className="ml-3 block text-sm/6 font-medium text-white"
                  >
                    {opt.name}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-semibold text-white"
            >
              Amount
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="flex items-center justify-between flex-col space-x-0 space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Deposit
            </button>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            >
              Withdraw
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
