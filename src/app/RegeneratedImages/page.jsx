'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function RegeneratedImagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const generationId = searchParams.get('generationId');
  const name = searchParams.get('name') || '';

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generationData, setGenerationData] = useState(null);

  useEffect(() => {
    if (generationId) {
      fetchRegeneratedResults();
    } else {
      // Fallback to placeholder data if no generation ID
      const simulated = Array.from({ length: 3 }).map((_, i) => ({
        id: `regen-${i + 1}`,
        url: `/ai_generated/regenerated${i + 1}.jpg`,
      }));
      setImages(simulated);
      setLoading(false);
    }
  }, [generationId]);

  const fetchRegeneratedResults = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/generations/${generationId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch regenerated results');
      }

      setGenerationData(data);
      
      if (data.generatedImages && data.generatedImages.length > 0) {
        const formattedImages = data.generatedImages.map((img, index) => ({
          id: `regen-${index + 1}`,
          url: img.cloudinaryUrl,
          prompt: img.prompt
        }));
        setImages(formattedImages);
      } else {
        setError('No regenerated images found');
      }
    } catch (error) {
      console.error('Error fetching regenerated results:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const goTo3DPrototype = () => {
    router.push('/3d-prototype');
  };

  const downloadImage = (url) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'regenerated-image.jpg';
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen px-10 py-8 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#233B6E] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading regenerated images...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen px-10 py-8 bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-[#233B6E] text-white px-6 py-3 rounded-full hover:bg-[#1a2951]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-10 py-8 bg-white">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="w-6 h-6 relative cursor-pointer">
          <Image src="/ArrowBack.svg" alt="Back" fill />
        </button>
        <h1 className="text-3xl font-bold text-[#233B6E]">
          Regenerated Images
        </h1>
      </div>

      {generationData && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Regeneration Details:</h3>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Prompt:</strong> {generationData.prompt}
          </p>
          {generationData.processingTime && (
            <p className="text-sm text-gray-600">
              <strong>Processing Time:</strong> {Math.round(generationData.processingTime / 1000)}s
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {images.map((img) => (
          <div key={img.id} className="relative border rounded-lg overflow-hidden group">
            <Image
              src={img.url}
              alt={img.id}
              width={300}
              height={300}
              className="object-cover w-full h-64"
            />
            
            {/* Download button */}
            <button
              onClick={() => downloadImage(img.url)}
              className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition"
              title="Download"
            >
              <Image src="/ArrowBack.svg" alt="Download" width={20} height={20} />
            </button>
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
