import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';


const useMedia = () => {
  const queryClient = useQueryClient();

  const authFetch = async (url, options = {}) => {
    const token = sessionStorage.getItem("token");
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch');
    }
    return response;
  };

  
  const serveMedia = useCallback(async (id) => {
    const response = await authFetch(`/api/media/${id}/serve`);
    if (!response.ok) throw new Error('Failed to fetch media item');

    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const mimeType = response.headers.get("Content-Type");

    return { url, mimeType };
  }, []);

  // QUERY: Fetch all media
  const {
    data: media = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['media'],
    queryFn: async () => {
      const response = await authFetch('/api/media');
      if (!response.ok) throw new Error('Failed to fetch media');
      return response.json();
    },
  });

  // MUTATION: Delete a media item
  const { mutate: deleteMedia } = useMutation({
    mutationFn: async (id) => {
      const response = await authFetch(`/api/media/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete media');
      return response.json();
    },
    onSuccess: () => {
      // Refresh the list
      queryClient.invalidateQueries(['media']);
    },
  });

  // MUTATION: Upload a new media item
  const { mutate: uploadMedia, isLoading: isUploading } = useMutation({
    mutationFn: async (formData) => {
      const response = await authFetch('/api/media', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to upload media');
      }
      return response.json();
    },
    onSuccess: () => {
      // After upload, refetch the media list
      queryClient.invalidateQueries(['media']);
    },
  });

  const downloadMedia = async (mediaId, fileName) => {
    try {
      const response = await authFetch(`/api/media/${mediaId}/download`);
      if (!response.ok) throw new Error("Failed to download media");
      
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
    media,
    loading,
    error,
    deleteMedia,
    uploadMedia,
    isUploading,
    downloadMedia,
    serveMedia,
  };
};

export default useMedia;
