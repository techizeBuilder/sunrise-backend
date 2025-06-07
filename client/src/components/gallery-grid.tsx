import { GalleryImage } from "@shared/schema";
import { Search } from "lucide-react";

interface GalleryGridProps {
  images: GalleryImage[];
  isLoading: boolean;
  onImageClick: (image: GalleryImage) => void;
}

export default function GalleryGrid({ images, isLoading, onImageClick }: GalleryGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="gallery-item animate-pulse">
            <div className="w-full h-64 bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          No images in the gallery yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <div 
          key={image.id} 
          className="gallery-item cursor-pointer"
          onClick={() => onImageClick(image)}
        >
          <img
            src={image.imageUrl}
            alt={image.altText}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-dark-brown/0 hover:bg-dark-brown/50 transition-all duration-300 flex items-center justify-center">
            <Search className="text-white text-2xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      ))}
    </div>
  );
}
