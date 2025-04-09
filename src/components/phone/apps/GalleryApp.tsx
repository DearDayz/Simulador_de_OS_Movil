
import React, { useState, useEffect } from "react";
import { usePhone } from "@/context/PhoneContext";
import { Image, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const GalleryApp: React.FC = () => {
  const { photos, deletePhoto } = usePhone();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number | null>(null);
  
  // Add sample images if gallery is empty
  useEffect(() => {
    if (photos.length === 0) {
      // This will trigger the logic in PhoneContext that adds photos to the gallery
      const sampleImages = [
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect fill='%23FF9800' width='300' height='300'/%3E%3Ctext fill='white' font-family='Arial' font-size='24' x='50%25' y='50%25' text-anchor='middle'%3EPuesta de Sol%3C/text%3E%3C/svg%3E",
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect fill='%233F51B5' width='300' height='300'/%3E%3Ctext fill='white' font-family='Arial' font-size='24' x='50%25' y='50%25' text-anchor='middle'%3EVista al Mar%3C/text%3E%3C/svg%3E",
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect fill='%234CAF50' width='300' height='300'/%3E%3Ctext fill='white' font-family='Arial' font-size='24' x='50%25' y='50%25' text-anchor='middle'%3ESendero Forestal%3C/text%3E%3C/svg%3E"
      ];
      
      sampleImages.forEach(imageUrl => {
        const event = new CustomEvent('new-photo-captured', { 
          detail: { photoUrl: imageUrl } 
        });
        window.dispatchEvent(event);
      });
    }
  }, [photos.length]);
  
  const openPhoto = (index: number) => {
    setCurrentPhotoIndex(index);
  };
  
  const closePhoto = () => {
    setCurrentPhotoIndex(null);
  };
  
  const nextPhoto = () => {
    if (currentPhotoIndex !== null && photos.length > 0) {
      setCurrentPhotoIndex((currentPhotoIndex + 1) % photos.length);
    }
  };
  
  const prevPhoto = () => {
    if (currentPhotoIndex !== null && photos.length > 0) {
      setCurrentPhotoIndex((currentPhotoIndex - 1 + photos.length) % photos.length);
    }
  };
  
  const handleDeletePhoto = (index: number) => {
    deletePhoto(index);
    
    if (currentPhotoIndex !== null) {
      if (photos.length <= 1) {
        // No photos left after deletion
        closePhoto();
      } else if (index === currentPhotoIndex) {
        // If we're deleting the current photo, show the next one
        // or the previous one if we're deleting the last photo
        if (index === photos.length - 1) {
          setCurrentPhotoIndex(index - 1);
        }
      } else if (index < currentPhotoIndex) {
        // If we're deleting a photo before the current one,
        // adjust the current index
        setCurrentPhotoIndex(currentPhotoIndex - 1);
      }
    }
  };
  
  // Photo viewer mode
  if (currentPhotoIndex !== null && photos.length > 0) {
    return (
      <div className="h-full flex flex-col bg-black">
        <div className="p-4 flex justify-between">
          <Button 
            variant="ghost" 
            className="text-white" 
            onClick={closePhoto}
          >
            Volver
          </Button>
          
          <Button 
            variant="ghost" 
            className="text-red-500" 
            onClick={() => handleDeletePhoto(currentPhotoIndex)}
          >
            <Trash2 size={20} />
          </Button>
        </div>
        
        <div className="flex-1 flex items-center justify-center relative">
          <img 
            src={photos[currentPhotoIndex]} 
            alt={`Foto ${currentPhotoIndex + 1}`} 
            className="max-h-full max-w-full"
          />
          
          {photos.length > 1 && (
            <>
              <Button 
                variant="ghost" 
                className="absolute left-2 text-white rounded-full bg-black bg-opacity-50 h-10 w-10 p-0"
                onClick={prevPhoto}
              >
                <ChevronLeft size={24} />
              </Button>
              
              <Button 
                variant="ghost" 
                className="absolute right-2 text-white rounded-full bg-black bg-opacity-50 h-10 w-10 p-0"
                onClick={nextPhoto}
              >
                <ChevronRight size={24} />
              </Button>
            </>
          )}
        </div>
        
        <div className="p-4 flex justify-center items-center bg-black bg-opacity-75">
          <span className="text-white text-sm">
            {currentPhotoIndex + 1} / {photos.length}
          </span>
        </div>
      </div>
    );
  }
  
  // Gallery grid view
  return (
    <div className="h-full flex flex-col p-4 bg-white">
      <h2 className="text-2xl font-semibold text-center mb-4">Galería</h2>
      
      {photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 overflow-y-auto">
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className="aspect-square cursor-pointer rounded-lg overflow-hidden shadow-md"
              onClick={() => openPhoto(index)}
            >
              <img 
                src={photo} 
                alt={`Foto ${index + 1}`} 
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
          <Image size={48} className="mb-4 opacity-50" />
          <p>No hay fotos</p>
          <p className="text-sm mt-2">Abre la cámara para tomar algunas fotos</p>
        </div>
      )}
    </div>
  );
};

export default GalleryApp;
