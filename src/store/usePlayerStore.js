import { create } from "zustand";

export const usePlayerStore = create((set, get) => ({
  currentSong: null,
  isPlaying: false,
  nextSongEnabled: false,
  prevSongEnabled: false,
  searchQuery: null,
  isLoading: false,
  isQueueOpen: false, // State for queue visibility

  songsQueue: [],
  setSongsQueue: (data) => set({ songsQueue: data }),

  songs: [],
  albums: [],
  albumDetails: [],
  setAlbumDetails: (data) => set({ albumDetails: data }),
  setAlbum: (data) => set({ album: data }),
  artists: [],
  playlists: [],
  single: [],
  setSingle: (data) => set({ single: data }),

  playlistDetails: [],
  artistDetails: [],
  artistSongs: [],
  artistAlbums: [],
  setArtistDetails: (data) => set({ artistDetails: data }),
  setPlaylistDetails: (data) => set({ playlistDetails: data }),
  setArtistSongs: (data) => set({ artistSongs: data }),
  setArtistAlbums: (data) => set({ artistAlbums: data }),

  setSongs: (data) => set({ songs: data }),
  setAlbums: (data) => set({ albums: data }),
  setArtists: (data) => set({ artists: data }),
  setPlaylists: (data) => set({ playlists: data }),

  setIsLoading: (option) => set({ isLoading: option }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCurrentSong: (song) => set({ currentSong: song }),
  setIsPlaying: (option) => set({ isPlaying: option }),
  setIsQueueOpen: (option) => set({ isQueueOpen: option }),
  toggleQueueOpen: () => set((state) => ({ isQueueOpen: !state.isQueueOpen })),

  nextSong: () => {
    const { songsQueue, currentSong } = get();
    if (!songsQueue || songsQueue.length === 0 || !currentSong) return;

    const currentIndex = songsQueue.findIndex(
      (song) => song.id === currentSong.id
    );
    const nextIndex = (currentIndex + 1) % songsQueue.length;
    const nextSong = songsQueue[nextIndex];
    set({
      currentSong: nextSong,
      nextSongEnabled: songsQueue.length > 1,
      prevSongEnabled: songsQueue.length > 1,
    });
  },

  prevSong: () => {
    const { songsQueue, currentSong } = get();
    if (!songsQueue || songsQueue.length === 0 || !currentSong) return;

    const currentIndex = songsQueue.findIndex(
      (song) => song.id === currentSong.id
    );
    const prevIndex =
      (currentIndex - 1 + songsQueue.length) % songsQueue.length;
    const prevSong = songsQueue[prevIndex];
    set({
      currentSong: prevSong,
      nextSongEnabled: songsQueue.length > 1,
      prevSongEnabled: songsQueue.length > 1,
    });
  },
}));
