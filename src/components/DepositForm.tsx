import { useState, useCallback } from "react";
import useContract from "@hooks/useContract";
import { toast } from "react-hot-toast";

const options = [
  { name: "ETH", key: "eth" },
  { name: "YIDENG COIN", key: "ydc" },
];

const symbol = {
  eth: "ETH",
  ydc: "YDC",
};

export default function DepositForm() {
  const [selectedToken, setSelectedToken] =
    useState<keyof typeof symbol>("eth");
  const [amount, setAmount] = useState(0);
  const {
    ethBalance,
    erc20Balance,
    erc20Deposit,
    erc20Withdraw,
    ethDeposit,
    ethWithdraw,
    loading,
    message,
  } = useContract();
  const currentSymbol = symbol[selectedToken];
  const onsubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        if (selectedToken === "eth") {
          if (amount > 0) {
            if (
              (e.nativeEvent as SubmitEvent).submitter?.innerText === "Deposit"
            ) {
              await ethDeposit(amount);
            } else {
              await ethWithdraw(amount);
            }
          } else {
            toast.error("Invalid amount");
          }
        } else {
          if (amount > 0) {
            if (
              (e.nativeEvent as SubmitEvent).submitter?.innerText === "Deposit"
            ) {
              await erc20Deposit(amount);
            } else {
              await erc20Withdraw(amount);
            }
          } else {
            toast.error("Invalid amount");
          }
        }
      } catch (err) {
        console.error(err);
        toast.error(`Failed to deposit/withdraw ${currentSymbol}`);
      } finally {
        setAmount(0);
      }
    },
    [
      selectedToken,
      amount,
      ethDeposit,
      ethWithdraw,
      erc20Deposit,
      erc20Withdraw,
    ]
  );

  return (
    <>
      <div className="mb-8">
        <div className="text-sm font-semibold text-white">Your Balance</div>
        <div className="mt-2 text-5xl font-semibold text-white">
          {currentSymbol === symbol.eth ? ethBalance : erc20Balance}{" "}
          {currentSymbol}
        </div>
      </div>
      <form className="space-y-6" onSubmit={onsubmit}>
        <fieldset>
          <legend className="text-lg font-semibold text-white">Token</legend>
          <div className="mt-6 space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
            {options.map((opt) => (
              <div key={opt.key} className="flex items-center">
                <input
                  defaultChecked={opt.key === "eth"}
                  id={opt.key}
                  name="notification-method"
                  type="radio"
                  className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-500 checked:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                  onChange={() => {
                    setSelectedToken(opt.key as keyof typeof symbol);
                    setAmount(0);
                  }}
                  disabled={loading}
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
            htmlFor="amount"
            className="block text-lg font-semibold text-white"
          >
            Amount
          </label>
          <div className="mt-2">
            <input
              id="amount"
              name="amount"
              type="number"
              required
              value={amount}
              min="0"
              step="0.01"
              placeholder="0.00"
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              onChange={(e) => setAmount(e.target.value as any)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between flex-col space-x-0 space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            disabled={loading}
          >
            Deposit
          </button>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            disabled={loading}
          >
            Withdraw
          </button>
        </div>
      </form>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/75   z-50">
          <div className="flex flex-col items-center">
            {/* 旋转加载动画 */}
            <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            <p className="mt-4 text-white text-lg font-semibold">
             {message}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
