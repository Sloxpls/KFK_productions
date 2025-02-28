import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchPlaylistNames = async () => {
  try {
    const response = await fetch("/api/playlists");
    if (!response.ok) {
      throw new Error(`Playlists API error: ${response.status}`);
    }
    const playlistsData = await response.json();
    return playlistsData.map(playlist => playlist.name);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error(`Playlists API error: ${error.message}`);
  }
};

const fetchPlaylists = async () => {
  try {
    const response = await fetch("/api/playlists-with-tracks");
    if (!response.ok) {
      throw new Error(`Playlists API error: ${response.status}`);
    }
    const data = await response.json();
    return data.map(playlist => ({
      ...playlist,
      tracks: playlist.tracks || [] // Ensure tracks is an array
    }));
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw error;
  }
};

const createPlaylist = async ({ name }) => {
  const response = await fetch("/api/playlists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error("Failed to create playlist");
  }
  return response.json();
};

const deletePlaylist = async (playlistId) => {
  const response = await fetch(`/api/playlists/${playlistId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete playlist");
  }
  return response.json();
};

const usePlaylists = () => {
  const queryClient = useQueryClient();

  // Query for playlist names (used in UploadSong)
  const { 
    data: playlistNames = [], 
    isLoading: isLoadingNames,
    error: namesError 
  } = useQuery({
    queryKey: ["playlist-names"],
    queryFn: fetchPlaylistNames,
    refetchOnWindowFocus: false,
  });

  // Query for full playlists with tracks (used in AlbumList)
  const { 
    data: playlists = [], 
    isLoading: isLoadingPlaylists,
    error: playlistsError,
    refetch: refreshPlaylists 
  } = useQuery({
    queryKey: ["playlists"],
    queryFn: fetchPlaylists,
    refetchOnWindowFocus: false,
  });

  

  // Mutation for creating new playlists
  const createPlaylistMutation = useMutation({
    mutationFn: createPlaylist,
    onSuccess: () => {
      // Invalidate both playlist queries to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist-names"] });
    },
  });

  // Mutation for deleting playlists
  const deletePlaylistMutation = useMutation({
    mutationFn: deletePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist-names"] });
    },
  });

  return {
    // For UploadSong component
    playlistNames,
    isLoading: isLoadingNames,
    error: namesError,
    createPlaylist: createPlaylistMutation.mutate,
    isCreating: createPlaylistMutation.isLoading,
    createError: createPlaylistMutation.error,

    // For AlbumList component
    playlists,
    isLoadingPlaylists,
    playlistsError,
    refreshPlaylists,
    deletePlaylist: deletePlaylistMutation.mutate,
  };
};

export default usePlaylists;