import Header from '@components/common/Header';
import { memo } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="mx-auto px-4">
        <Outlet />
      </main>
      <Toaster />
    </>
  );
};
// MainLayout.whyDidYouRender = true;
export default memo(MainLayout);
