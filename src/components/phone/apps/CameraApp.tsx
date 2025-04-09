import React, { useState, useEffect, useRef } from "react";
import { Camera, SwitchCamera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePhone } from "@/context/PhoneContext";
import { toast } from "@/components/ui/use-toast";

const CameraApp: React.FC = () => {
  const { currentApp } = usePhone();
  const [photoEffect, setPhotoEffect] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Function to start the camera
  const startCamera = async () => {
    console.log("Attempting to start camera...");
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser");
      }

      // Stop any existing stream
      if (streamRef.current) {
        stopCamera();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      console.log("Camera stream obtained successfully:", stream.active);

      // Save stream reference
      streamRef.current = stream;

      // Connect stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // When video metadata is loaded, we can start playing
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => {
                console.log("Camera video playing");
                setCameraReady(true);
                setCameraActive(true);
              })
              .catch((err) => {
                console.error("Failed to play camera:", err);
                setCameraError("Failed to play camera feed");
              });
          }
        };
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError(
        err instanceof Error ? err.message : "Failed to access camera"
      );
      setCameraActive(false);
      setCameraReady(false);
    }
  };

  // Function to stop the camera
  const stopCamera = () => {
    console.log("Stopping camera...");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        console.log(`Stopping ${track.kind} track:`, track.label);
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
    setCameraReady(false);
  };

  // When the app opens or closes
  useEffect(() => {
    console.log("CameraApp effect, current app:", currentApp);

    if (currentApp === "camera") {
      console.log("Camera app active, starting camera");
      startCamera();
    } else {
      console.log("Camera app inactive, stopping camera");
      stopCamera();
    }

    // Clean up when component unmounts
    return () => {
      console.log("CameraApp unmounting, stopping camera");
      stopCamera();
    };
  }, [currentApp]);

  // Handle visibility changes (tab switching, minimizing)
  useEffect(() => {
    const handleVisibilityChange = () => {
      console.log("Visibility changed:", document.visibilityState);
      if (document.visibilityState === "hidden" && currentApp === "camera") {
        console.log("Page hidden, stopping camera");
        stopCamera();
      } else if (
        document.visibilityState === "visible" &&
        currentApp === "camera" &&
        !cameraActive
      ) {
        console.log("Page visible again, restarting camera");
        startCamera();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentApp, cameraActive]);

  // Take photo function
  const takePhoto = () => {
    if (!cameraReady || !videoRef.current || !streamRef.current) {
      toast({
        title: "Cámara no lista",
        description: "Espera a que la cámara esté activa para tomar una foto.",
        variant: "destructive",
      });
      return;
    }

    // Flash effect
    setPhotoEffect(true);
    setTimeout(() => setPhotoEffect(false), 300);

    try {
      // Create canvas to capture video frame
      const canvas = document.createElement("canvas");
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Draw the video frame to canvas (with mirroring for selfie camera)
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to data URL
      const photoUrl = canvas.toDataURL("image/jpeg");

      // Save photo to gallery
      const photoEvent = new CustomEvent("new-photo-captured", {
        detail: { photoUrl },
      });
      window.dispatchEvent(photoEvent);

      toast({
        title: "Foto capturada",
        description: "La foto se ha guardado en la galería",
      });

      console.log("Photo captured and saved to gallery");
    } catch (error) {
      console.error("Error capturing photo:", error);
      toast({
        title: "Error",
        description: "No se pudo capturar la foto",
        variant: "destructive",
      });
    }
  };

  // Dummy function for switching camera (UI only for now)
  const switchCamera = () => {
    toast({
      title: "Cambio de cámara",
      description: "No tengo otra cámara para cambiar :(",
    });
  };

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden">
      <div className="flex-1 relative flex items-center justify-center">
        {/* Camera viewfinder */}
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          style={{ transform: "scaleX(-1)" }} // Mirror effect for selfie mode
          playsInline
          muted
          autoPlay
        />

        {/* Camera states overlays */}
        {!cameraActive && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-10">
            <div className="text-white text-center">
              <div className="animate-pulse mb-4 text-3xl">●</div>
              <p>Iniciando cámara...</p>
            </div>
          </div>
        )}

        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-10 p-4">
            <div className="text-white text-center max-w-xs">
              <Camera className="mx-auto mb-4 text-red-500" size={48} />
              <h3 className="text-xl font-bold mb-2">Error de cámara</h3>
              <p className="mb-4">{cameraError}</p>
              <Button
                onClick={startCamera}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Reintentar
              </Button>
            </div>
          </div>
        )}

        {/* Photo capture flash effect */}
        {photoEffect && (
          <div className="absolute inset-0 bg-white animate-flash z-20"></div>
        )}
      </div>

      {/* Camera controls */}
      <div className="bg-black p-4 flex justify-between items-center">
        <div className="w-12"></div>

        <Button
          className="rounded-full h-16 w-16 bg-white hover:bg-gray-200 disabled:opacity-50"
          onClick={takePhoto}
          disabled={!cameraReady}
        >
          <div className="rounded-full border-2 border-black h-12 w-12"></div>
        </Button>

        <Button
          variant="ghost"
          className="rounded-full h-12 w-12 p-0 text-white hover:bg-white/10"
          onClick={switchCamera}
        >
          <SwitchCamera size={24} />
        </Button>
      </div>
    </div>
  );
};

export default CameraApp;
