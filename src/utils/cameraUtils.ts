
// Utilities for camera management
interface CameraOptions {
  onSuccess?: (stream: MediaStream) => void;
  onError?: (error: Error) => void;
}

// Function to request camera access and return the stream
export const requestCameraAccess = async ({ onSuccess, onError }: CameraOptions = {}): Promise<MediaStream | null> => {
  console.log("Solicitando acceso a la cámara...");
  
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error("API de dispositivos multimedia no soportada");
    onError?.(new Error("API de dispositivos multimedia no soportada"));
    return null;
  }
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user"
      },
      audio: false
    });
    
    console.log("Acceso a la cámara concedido. Tracks:", stream.getTracks().length);
    onSuccess?.(stream);
    return stream;
  } catch (error) {
    console.error("Error al acceder a la cámara:", error);
    onError?.(error as Error);
    return null;
  }
};

// Function to stop all tracks in a stream
export const stopCameraStream = (stream: MediaStream | null): void => {
  if (!stream) return;
  
  console.log("Deteniendo stream de cámara");
  stream.getTracks().forEach(track => {
    console.log(`Deteniendo track ${track.kind}`);
    track.stop();
  });
};

// Function to take a photo from video element
export const capturePhotoFromVideo = (videoElement: HTMLVideoElement | null): string | null => {
  if (!videoElement || !videoElement.videoWidth) {
    console.error("Video no disponible para captura");
    return null;
  }
  
  // Create canvas to capture frame
  const canvas = document.createElement("canvas");
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("No se pudo obtener contexto 2D del canvas");
    return null;
  }
  
  // Draw the video frame to canvas
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
  // Convert to data URL
  return canvas.toDataURL("image/jpeg");
};

// Function to create a simulated photo when camera isn't available
export const createSimulatedPhoto = (): string => {
  const colors = ["#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  const currentTime = new Date().toLocaleTimeString();
  
  const svgContent = `
    <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="400" fill="${randomColor}" />
      <text x="150" y="200" font-family="Arial" font-size="20" fill="white" text-anchor="middle">Foto capturada a las ${currentTime}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svgContent)}`;
};

// Function to save photo to gallery
export const savePhotoToGallery = (photoUrl: string): void => {
  const photoEvent = new CustomEvent('new-photo-captured', {
    detail: { photoUrl }
  });
  window.dispatchEvent(photoEvent);
  console.log("Foto guardada en la galería");
};
