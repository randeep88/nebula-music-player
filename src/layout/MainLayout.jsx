import { Outlet, useNavigate } from "react-router-dom";
import Player from "../components/Player";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { usePlayerStore } from "../store/usePlayerStore";
import { useEffect } from "react";

const MainLayout = () => {
  const { searchQuery } = usePlayerStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery) {
      navigate("/search");
    }
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header */}
      <div className="h-16 w-full bg-gray-300">
        <Header />
      </div>

      {/* Main content (takes remaining height) */}
      <div className="flex-1 flex gap-2 w-full overflow-auto bg-black">
        <div className="w-[350px] text-neutral-200 overflow-hidden bg-neutral-900 rounded-lg">
          <Sidebar />
        </div>
        <div className="flex-1 flex rounded-lg overflow-hidden bg-neutral-900 w-2/3">
          <Outlet />
        </div>
      </div>

      {/* Player */}
      <div className="h-24 w-full bg-gray-800">
        <Player />
      </div>
    </div>
  );
};

export default MainLayout;
