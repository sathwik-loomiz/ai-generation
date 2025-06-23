'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function RegeneratedImagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const count = parseInt(searchParams.get('count')) || 1;
  const prompt = searchParams.get('prompt') || '';

  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    // Simulated regenerated images based on count
    const simulated = Array.from({ length: count }).map((_, i) => ({
      id: `regen-${i + 1}`,
      url: `/ProductTypeSkirt.svg`, // Replace with dynamic URLs if available
              // url: `/ai_generated/placeholder${(i % 3) + 1}.jpg`,

    }));
    setImages(simulated);
  }, [count]);

  const toggleImageSelect = (id) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((imgId) => imgId !== id) : [...prev, id]
    );
  };

  const downloadImage = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'regenerated-image.png'; // Adjust extension if needed
    link.click();
  };

  const goTo3DPrototype = () => {
    router.push('/3d-prototype');
  };

  return (
    <div className="min-h-screen px-6 md:px-12 py-10 bg-white mt-[65px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-6 h-6 relative cursor-pointer">
            <Image src="/ArrowBack.svg" alt="Back" fill />
          </button>
          <h1 className="text-[24px] md:text-[32px] font-semibold text-[#233B6E]">
            Regenerated Images
          </h1>
        </div>
        <button onClick={() => router.push('/')} className="w-6 h-6 relative cursor-pointer">
          <Image src="/CrossIcon.svg" alt="Close" fill />
        </button>
      </div>

      

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {images.map((img) => (
          <div
            key={img.id}
            onClick={() => toggleImageSelect(img.id)}
            className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
              selectedImages.includes(img.id)
                ? 'border-[#233B6E] shadow-md'
                : 'border-gray-200 hover:shadow-sm'
            }`}
          >
            <Image
              src={img.url}
              alt={img.id}
              width={400}
              height={400}
              className="object-contain w-full h-64"
            />

            {/* Download Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadImage(img.url);
              }}
              title="Download"
              className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 rotate-270"
            >
              <Image src="/ArrowBack.svg" alt="Download" width={20} height={20} />
            </button>
          </div>
        ))}
      </div>

      {/* 3D Prototype Button */}
      <div className="flex justify-end">
        <button
          onClick={goTo3DPrototype}
          className="bg-[#233B6E] text-white px-8 py-3 rounded-full cursor-pointer font-medium transition"
        >
          3D Prototype
        </button>
      </div>
    </div>
  );
}
