'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function RegeneratedImagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const count = parseInt(searchParams.get('count')) || 1;
  const prompt = searchParams.get('prompt');

  const [images, setImages] = useState([]);

  useEffect(() => {
    // Simulate regenerated images (replace with API data later)
    const simulated = Array.from({ length: count }).map((_, i) => ({
      id: `regen-${i + 1}`,
      url: `/ai_generated/regenerated${i + 1}.jpg`,
    }));
    setImages(simulated);
  }, [count]);

  const goTo3DPrototype = () => {
    router.push('/3d-prototype');
  };

  return (
    <div className="min-h-screen px-10 py-8 bg-white">
      <h1 className="text-3xl font-bold text-[#233B6E] mb-6">
        Regenerated Images
      </h1>

      <p className="mb-6 text-gray-600">Prompt: <span className="font-semibold">{prompt}</span></p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {images.map((img) => (
          <div key={img.id} className="relative border rounded-lg overflow-hidden">
            <Image
              src={img.url}
              alt={img.id}
              width={300}
              height={300}
              className="object-cover w-full h-64"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={goTo3DPrototype}
          className="bg-[#41A4FF] text-white px-6 py-3 rounded-full hover:bg-[#2b92e0]"
        >
          3D Prototype
        </button>
      </div>
    </div>
  );
}
