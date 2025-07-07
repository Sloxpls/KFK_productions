import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchTracks = async () => {
  try {
    const response = await fetch("/api/tracks");
    if (!response.ok) {
      throw new Error(`Tracks API error: ${response.status}`);
    }
    const data = await response.json();
    
    return {
      tracks: data.tracks,
      metadata: data.metadata
    };
  } catch (error) {
    console.error("Error fetching tracks:", error);
    throw new Error("Error fetching tracks. Please try again later.");
  }
};

let currentBlobUrl = null;

const streamTrack = async (trackId) => {
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
  }

  try {
    const response = await fetch(`/api/tracks/${trackId}/stream`);
    if (!response.ok) {
      throw new Error("Failed to stream track");
    }
    currentBlobUrl = URL.createObjectURL(response.blob());
    return currentBlobUrl;
  } catch (error) {
    console.error("Error streaming track:", error);
    throw error;
  }
};

const uploadSong = async (formData) => {
  const response = await fetch("/api/upload-song", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to upload song");
  }
  return response.json();
};

const deleteTrack = async (trackId) => {
  try {
    const response = await fetch(`/api/tracks/${trackId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete track: ", response.status);
    }
  } catch (error) {
    console.error("Error deleting track:", error);
    throw error;
  }
};

const downloadTrack = async (trackId, fileName) => {
  try {
    const response = await fetch(`/api/tracks/${trackId}/download`);
    if (!response.ok) {
      throw new Error("Failed to download song");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download error:", error);
    throw error;
  }
};

const updateTrack = async (trackData) => {
  const response = await fetch(`/api/tracks/${trackData.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(trackData.trackDetails),
  });
  if (!response.ok) {
    throw new Error("Failed to update track data.");
  }

  const addPromises = trackData.selectedPlaylistsToAdd.map((playlistId) =>
    fetch(`/api/playlists/${playlistId}/tracks/${trackData.id}`, {
      method: "POST",
    }).then((res) => {
      if (!res.ok)
        throw new Error(`Failed to add track to playlist ${playlistId}`);
      return res.json();
    })
  );

  const removePromises = trackData.selectedPlaylistsToRemove.map((playlistId) =>
    fetch(`/api/playlists/${playlistId}/tracks/${trackData.id}`, {
      method: "DELETE",
    }).then((res) => {
      if (!res.ok)
        throw new Error(`Failed to remove track from playlist ${playlistId}`);
      return res.json();
    })
  );

  await Promise.all([...addPromises, ...removePromises]);
  return response.json();
};

export const useTracks = () => {
  const queryClient = useQueryClient();

  const { 
    data: tracksResponse = { tracks: [], metadata: {} }, 
    refetch: refreshTracks,
    isLoading,
    error 
  } = useQuery({
    queryKey: ["tracks"], 
    queryFn: fetchTracks,   
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  const { tracks = [], metadata = {} } = tracksResponse;

  const uploadSongMutation = useMutation({
    mutationFn: uploadSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      queryClient.invalidateQueries({ queryKey: ["tracks-unassigned"] });
      queryClient.invalidateQueries({ queryKey: ["playlists-with-tracks"] });
    },
  });

  const deleteTrackMutation = useMutation({
    mutationFn: deleteTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      queryClient.invalidateQueries({ queryKey: ["tracks-unassigned"] });
      queryClient.invalidateQueries({ queryKey: ["playlists-with-tracks"] });
    },
  });

  const updateTrackMutation = useMutation({
    mutationFn: updateTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlists-with-tracks"] });
      queryClient.invalidateQueries({ queryKey: ["tracks-unassigned"] });
    },
  });

  return {
    tracks,
    metadata,
    isLoading,
    error,
    refreshTracks,
    uploadSong: uploadSongMutation.mutate,
    isUploading: uploadSongMutation.isLoading,
    uploadError: uploadSongMutation.error,
    streamTrack,
    downloadTrack,
    deleteTrack: deleteTrackMutation.mutate,
    updateTrack: updateTrackMutation.mutate,
  };
};

export default useTracks;
