const getMimeType = (filepath = '') => {
    if (!filepath) return null;
    const ext = filepath.split('.').pop().toLowerCase();
    
    const mimeTypes = {
      // Images
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      // Audio
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      // Video
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'mov': 'video/quicktime',
    };
  
    return mimeTypes[ext] || 'application/octet-stream';
  };
  
  export const getMediaUrl = (mediaItem) => {
    if (!mediaItem?.id) return { url: '', mimeType: null };
    
    return {
      url: `/api/media/${mediaItem.id}/serve`,
      mimeType: getMimeType(mediaItem.file_path)
    };
  };