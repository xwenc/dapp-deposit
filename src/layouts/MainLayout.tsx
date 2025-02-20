import { useEffect } from "react";
import Header from "@components/common/Header";
import { memo } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useCanvas from "@hooks/useCanvas";

const MainLayout = () => {
  const run = useCanvas();

  useEffect(() => {
    run();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  );
};
// MainLayout.whyDidYouRender = true;
export default memo(MainLayout);
