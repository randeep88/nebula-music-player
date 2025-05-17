import { useState } from "react";
import { Button } from "@mui/material";
import "../App.css";
import { Link, Outlet } from "react-router-dom";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";

const categories = ["all", "songs", "artists", "albums", "playlists"];

const HomeLayout = () => {
  const [active, setActive] = useState("all");
  return (
    <div className="w-full h-full select-none overflow-auto scrollbar-container">
      <div className="flex sticky bg-neutral-900 z-20 top-0 space-x-3 ps-5 py-3 overflow-x-auto">
        {categories.map((category) => (
          <Link
            to={`${category === "all" ? `/search` : category}`}
            key={category}
          >
            <Button
              key={category}
              onClick={() => setActive(category)}
              variant="text"
              sx={{
                borderRadius: "9999px",
                textTransform: "none",
                fontSize: "13px",
                minWidth: "unset",
                paddingX: 1.5,
                paddingY: 0.5,
                color: active === category ? "black" : "#f5f5f5",
                backgroundColor: active === category ? "white" : "#2a2a2a",
                borderColor: "transparent",
                "&:hover": {
                  backgroundColor: active === category ? "white" : "#3a3a3a",
                  borderColor: "transparent",
                },
              }}
            >
              {capitalizeFirstLetter(category)}
            </Button>
          </Link>
        ))}
      </div>
      <div className="bg-neutral-900 h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default HomeLayout;
