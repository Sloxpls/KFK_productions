import { useState } from 'react';

const useChunkedUpload = () => {
  const [currentChunk, setCurrentChunk] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [chunkMessage, setChunkMessage] = useState("");
  
  const getChunkMessages = () => {
    const envMessages = import.meta.env.VITE_CHUNK_MESSAGES;
    
    if (envMessages) {
      return envMessages.split(',').map(msg => msg.trim());
    }
    
    // Fallback message
    return [
      "Processing audio file...",
    ];
  };
  
  const uploadFile = async (file, trackData) => {
    setIsUploading(true);
    setCurrentChunk(0);
    
    const chunkSize = 1024 * 1024; // 1MB chunks
    const chunks = [];
    
    for (let start = 0; start < file.size; start += chunkSize) {
      chunks.push(file.slice(start, start + chunkSize));
    }
    
    setTotalChunks(chunks.length);
    const uploadId = `${Date.now()}-${Math.random()}`;
    const chunkMessages = getChunkMessages();
    
    try {
    for (let i = 0; i < chunks.length; i++) {
      setCurrentChunk(i+1);
      setChunkMessage(
        chunkMessages[Math.floor(Math.random()*chunkMessages.length)]
      );

      const formData = new FormData();
      formData.append('chunk', chunks[i]);
      formData.append('chunkIndex', i);
      formData.append('totalChunks', chunks.length);
      formData.append('uploadId', uploadId);
      formData.append('originalFilename', file.name);
      const isLastChunk = i === chunks.length - 1;

      if (isLastChunk) {
        for (const key in trackData) {
          formData.append(key, trackData[key]);
        }
      }

      const response = await fetch('/api/upload-chunk', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Chunk upload failed: ${err}`);
      }

      // if this was the last chunk, parse JSON and return
      if (i === chunks.length - 1) {
        const result = await response.json();
        setIsUploading(false);
        return result;
      }

    }
  } catch (error) {
    setIsUploading(false);
    throw error;
  }
};
  
  return { uploadFile, currentChunk, totalChunks, isUploading, chunkMessage };
};

export default useChunkedUpload;