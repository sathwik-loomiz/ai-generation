'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function GenerateResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt') || '';
  const name = searchParams.get('name') || '';

  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  
  useEffect(() => {
    // Replace this with real API data when ready
    const generated = Array.from({ length: 6 }).map((_, i) => ({
      id: `img-${i + 1}`,
      url: `/ai_generated/placeholder${(i % 3) + 1}.jpg`, // using repeated dummy images
    }));
    setImages(generated);
  }, []);

  const toggleImageSelect = (id) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((imgId) => imgId !== id) : [...prev, id]
    );
  };

  const downloadImage = (url) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-image.jpg';
    a.click();
  };

  const handleRegenerate = () => {
    if (selectedImages.length === 0) {
      alert('Please select at least one image to regenerate.');
      return;
    }

    const selectedURLs = images
      .filter((img) => selectedImages.includes(img.id))
      .map((img) => encodeURIComponent(img.url));

    const query = selectedURLs.join(',');
    router.push(`/Regenrate?images=${query}`);
  };

  const handle3DPrototype = () => {
    router.push('/3d-prototype');
  };

  return (
    <div className="min-h-screen px-6 md:px-12 py-8 bg-white">


      <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <button onClick={() => router.back()} className="w-6 h-6 relative cursor-pointer">
                  <Image src="/ArrowBack.svg" alt="Back" fill />
                </button>
                <h2 className="text-[24px] md:text-[32px] font-semibold text-gray-800">
                 Generated Designs {name && `for ${name}`}
                </h2>
              </div>
      
              <button onClick={() => router.push('/')} className="w-6 h-6 relative cursor-pointer">
                <Image src="/CrossIcon.svg" alt="Close" fill />
              </button>
            </div>
      

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {images.map((img) => (
          <div
            key={img.id}
            onClick={() => toggleImageSelect(img.id)}
            className={`relative rounded-lg border-2 overflow-hidden cursor-pointer transition-all group ${
              selectedImages.includes(img.id)
                ? 'border-[#233B6E] shadow-lg'
                : 'border-gray-200 hover:shadow-md'
            }`}
          >
            <Image
              src={img.url}
              alt={img.id}
              width={400}
              height={400}
              className="object-cover w-full h-64"
            />

            {/* Download button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadImage(img.url);
              }}
              className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 rotate-270"
              title="Download"
            >
              <Image src="/ArrowBack.svg" alt="Download" width={20} height={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col md:flex-row justify-end gap-4">
        <button
          onClick={handleRegenerate}
          disabled={selectedImages.length === 0}
          className={`px-6 py-3 rounded-full font-medium transition ${
            selectedImages.length > 0
              ? 'bg-[#233B6E] text-white hover:bg-[#1a2951]'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          Regenerate
        </button>

        <button
          onClick={handle3DPrototype}
          className="px-6 py-3 rounded-full font-medium bg-[#41A4FF] text-white hover:bg-[#2b92e0] transition"
        >
          3D Prototype
        </button>
      </div>
    </div>
  );
}
