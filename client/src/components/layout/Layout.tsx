import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default Layout; 