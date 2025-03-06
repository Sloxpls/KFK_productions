import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchPlaylistNames = async () => {
  try {
    const response = await fetch("/api/playlists");
    if (!response.ok) {
      throw new Error(`Playlists API error: ${response.status}`);
    }
    const playlistsData = await response.json();
    return playlistsData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error(`Playlists API error: ${error.message}`);
  }
};

// used to populate the table and grid views
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

// get individual playlist, used for playlistinfo
const fetchPlaylist = async (playlistId) => {
  try {
    const response = await fetch(`/api/playlists/${playlistId}`);
    if (!response.ok) {
      throw new Error(`Playlist API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching playlist:", error);
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

const updatePlaylist = async (playlistId, formData) => {
  const response = await fetch(`/api/playlists/${playlistId}`, {
    method: "PUT",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to update playlist");
  }
  return response.json();
};

const usePlaylistDetails = (playlistId) => {
  return useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: () => playlistId ? fetchPlaylist(playlistId) : null,
    enabled: !!playlistId,
    refetchOnWindowFocus: false
  });
};

const usePlaylists = () => {
  const queryClient = useQueryClient();

  // Query for playlist names (used in UploadSong)
  const { 
    data: playlistData = [], 
    isLoading: isLoadingNames,
    error: namesError 
  } = useQuery({
    queryKey: ["playlist-names"],
    queryFn: fetchPlaylistNames,
    refetchOnWindowFocus: false,
  });

  const playlistNames = playlistData.map(playlist => playlist.name)

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

  const updatePlaylistMutation = useMutation({
    mutationFn: ({ playlistId, formData }) => {
      return updatePlaylist(playlistId, formData);
    },
    onSuccess: (data, variables) => {
      // Invalidate general playlist queries
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist-names"] });
      
      // Specifically invalidate the updated playlist
      queryClient.invalidateQueries({ queryKey: ["playlist", variables.playlistId] });
      
      // Immediately update the cache with new data
      queryClient.setQueryData(["playlist", variables.playlistId], data);
      
      // Force refetch all playlists to ensure consistency
      queryClient.refetchQueries({ queryKey: ["playlists"] });
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

    // For PlaylistInfo component
    usePlaylistDetails,
    updatePlaylist: updatePlaylistMutation.mutate,
    fetchPlaylist,
  };
};

export default usePlaylists;