import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const SidebarLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
