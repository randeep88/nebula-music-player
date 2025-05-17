import SearchIcon from "@mui/icons-material/Search";
import { usePlayerStore } from "../store/usePlayerStore";

const Header = () => {
  const { searchQuery, setSearchQuery } = usePlayerStore();

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="relative">
        <SearchIcon className="text-neutral-400 absolute z-10 top-3 left-4" />
        <input
          type="text"
          placeholder="What do you want to play?"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery || ""}
          className="rounded-full font-semibold p-3 ps-12 px-5 w-96 bg-neutral-800 placeholder-neutral-400 text-white focus:outline-none"
        />
      </div>
    </div>
  );
};

export default Header;
