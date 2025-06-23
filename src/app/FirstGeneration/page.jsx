'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function GenerateResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const generationId = searchParams.get('generationId');
  const name = searchParams.get('name') || '';
  const countParam = parseInt(searchParams.get('count')) || 6;

  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generationData, setGenerationData] = useState(null);

  useEffect(() => {
    if (generationId) {
      fetchGenerationResults();
    } else {
      // Dummy fallback if no generation ID
      const fallbackImages = Array.from({ length: countParam }).map((_, i) => ({
        id: `img-${i + 1}`,
        url: `/ai_generated/placeholder${(i % 3) + 1}.jpg`,
      }));
      setImages(fallbackImages);
      setLoading(false);
    }
  }, [generationId]);

  const fetchGenerationResults = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/generations/${generationId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch results');

      setGenerationData(data);

      let selected = [];

      // Add original images
      if (data.generatedImages?.length) {
        selected = data.generatedImages.slice(0, countParam).map((img, i) => ({
          id: `original-${i + 1}`,
          url: img.cloudinaryUrl,
        }));
      }

      // Fill remaining with regenerations
      if (selected.length < countParam && data.regenerations?.length) {
        for (let regenIdx = 0; regenIdx < data.regenerations.length; regenIdx++) {
          const regen = data.regenerations[regenIdx];
          for (let i = 0; i < regen.generatedImages.length; i++) {
            if (selected.length >= countParam) break;
            selected.push({
              id: `regen-${regenIdx + 1}-${i + 1}`,
              url: regen.generatedImages[i].cloudinaryUrl,
            });
          }
          if (selected.length >= countParam) break;
        }
      }

      setImages(selected);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

    router.push(`/Regenrate?images=${query}&generationId=${generationId}&name=${name}`);
  };

  const handle3DPrototype = () => {
    router.push('/3d-prototype');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
        <p>{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-6 py-2 bg-[#233B6E] text-white rounded-full"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 md:px-12 py-8 bg-white mt-[65px]">
      {/* Header */}
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

      {/* Image Grid */}
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
              className="object-contain w-full h-64 "
            />
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

      {/* Action Buttons */}
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
