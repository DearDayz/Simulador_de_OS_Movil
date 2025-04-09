
import { useState, useEffect, useRef } from 'react';
import { requestCameraAccess, stopCameraStream } from '../utils/cameraUtils';

interface UseCameraOptions {
  autoStart?: boolean;
}

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  isLoading: boolean;
  hasPermission: boolean;
  error: Error | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

const useCamera = ({ autoStart = false }: UseCameraOptions = {}): UseCameraReturn => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Cleanup function to stop camera when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stopCameraStream(stream);
      }
    };
  }, [stream]);
  
  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Stop any existing stream
      if (stream) {
        stopCameraStream(stream);
      }
      
      const newStream = await requestCameraAccess({
        onSuccess: (mediaStream) => {
          console.log("Cámara inicializada correctamente");
          setHasPermission(true);
        },
        onError: (err) => {
          console.error("Error en cámara:", err);
          setError(err);
          setHasPermission(false);
        }
      });
      
      // Attach stream to video element
      if (newStream && videoRef.current) {
        videoRef.current.srcObject = newStream;
        
        // Ensure video plays when metadata is loaded
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(err => {
            console.error("Error al reproducir video:", err);
            setError(new Error("Error al reproducir video"));
          });
        };
        
        setStream(newStream);
      }
    } catch (err) {
      console.error("Error al inicializar cámara:", err);
      setError(err instanceof Error ? err : new Error("Error desconocido"));
    } finally {
      setIsLoading(false);
    }
  };
  
  const stopCamera = () => {
    if (stream) {
      stopCameraStream(stream);
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };
  
  // Auto-start camera if requested
  useEffect(() => {
    if (autoStart) {
      startCamera();
    }
    
    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, [autoStart]);
  
  return {
    videoRef,
    stream,
    isLoading,
    hasPermission,
    error,
    startCamera,
    stopCamera
  };
};

export default useCamera;
