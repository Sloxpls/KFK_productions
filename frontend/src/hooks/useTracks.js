import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchTracks = async () => {
  try {
    const response = await fetch("/api/tracks");
    if (!response.ok) {
      throw new Error(`Tracks API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data. Please try again later.");
  }
};

const streamTrack = async (trackId) => {
  try {
    const response = await fetch(`/api/tracks/${trackId}/stream`);
    if (!response.ok) {
      throw new Error("Failed to stream track");
    }
    return response.blob();
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

export const useTracks = () => {
  const queryClient = useQueryClient();

  const { data: tracks = [], refetch: refreshTracks } = useQuery({
    queryKey: ["tracks"],
    queryFn: fetchTracks,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  const uploadSongMutation = useMutation({
    mutationFn: uploadSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
    },
  });

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

  return {
    tracks,
    refreshTracks,
    uploadSong: uploadSongMutation.mutate,
    isUploading: uploadSongMutation.isLoading,
    uploadError: uploadSongMutation.error,
    streamTrack,
    downloadTrack,
  };
};

export default useTracks;


