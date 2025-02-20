import DepositForm from '@/components/DepositForm';
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Logo from "@assets/logo.png";

export default function DappTest() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex shrink-0 items-center justify-center mx-auto w-24 h-24 rounded-full bg-indigo-600 mb-10 border border-indigo-500 shadow-lg shadow-indigo-500/50">
          <img alt="Yideng Coin" src={Logo} className="h-24 w-auto absolute z-10" />
          <div className="absolute w-96 h-96 translate-z-0 bg-indigo-500 rounded-full blur-[120px] opacity-30 animate-pulse duration-[3s]"></div>
          <div className="absolute w-36 h-36 translate-z-0 bg-indigo-600 rounded-full blur-[80px] opacity-80"></div>
        </div>
        <DepositForm />
      </div>
    </div>
  );
}
