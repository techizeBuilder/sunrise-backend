import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import GalleryGrid from "@/components/gallery-grid";
import { GalleryImage } from "@shared/schema";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const { data: galleryImages, isLoading } = useQuery({
    queryKey: ["/api/gallery"],
  });

  return (
    <div className="min-h-screen pt-20">
      <section className="section-padding bg-muted/30">
        <div className="container-max">
          <div className="text-center mb-16">
            <h1 className="text-5xl text-heading mb-4">Gallery</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Take a visual journey through our bakery and see the artistry behind every creation
            </p>
          </div>
          
          <GalleryGrid 
            images={galleryImages || []} 
            isLoading={isLoading}
            onImageClick={setSelectedImage}
          />
        </div>
      </section>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {selectedImage && (
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.altText}
              className="w-full h-full object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
