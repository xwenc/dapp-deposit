import Header from "@components/common/Header";
import { memo } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </>
  );
};
// MainLayout.whyDidYouRender = true;
export default memo(MainLayout);
