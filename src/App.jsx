import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layout/mainLayout";
import AlbumPage from "./pages/AlbumPage";
import HomeLayout from "./layout/HomeLayout";
import ArtistPage from "./pages/ArtistPage";
import PlaylistPage from "./pages/PlaylistPage";
import All from "./components/All";
import Artist from "./components/Artist";
import Songs from "./components/Songs";
import Album from "./components/Album";
import Playlist from "./components/Playlist";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="/search" element={<HomeLayout />}>
              <Route index element={<All />} />
              <Route path="songs" element={<Songs />} />
              <Route path="artists" element={<Artist />} />
              <Route path="albums" element={<Album />} />
              <Route path="playlists" element={<Playlist />} />
            </Route>
            <Route path="/artist/:artistId" element={<ArtistPage />} />
            <Route path="/album/:albumId" element={<AlbumPage />} />
            <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
