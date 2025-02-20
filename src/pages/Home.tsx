import useWallet from "@/hooks/useWallet";

export default function Home() {
  const { onConnect, isActive } = useWallet();
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
      <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-4xl animate-pulse">
        Experience the future of decentralized finance with our cutting-edge DApp.
      </h2>
      {!isActive ? (
        <div className="mt-10 flex items-center gap-x-6">
          <button
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={onConnect}
          >
            Connect
          </button>
        </div>
      ) : null}
    </div>
  );
}
