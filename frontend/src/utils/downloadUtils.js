export const downloadTrack = async (trackId, fileName) => {
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

  export const downloadMedia = async (mediaId, fileName) => {
    try {
      const response = await fetch(`/api/media/${mediaId}/download`);
      if (!response.ok) {
        throw new Error("Failed to download media");
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
  }