'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function RegeneratePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageParam = searchParams.get('images');
  const name = searchParams.get('name') || '';

  const [prompt, setPrompt] = useState('');
  const [count, setCount] = useState('1');
  const [imageUrls, setImageUrls] = useState([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (imageParam) {
      const decoded = imageParam.split(',').map(decodeURIComponent);
      setImageUrls(decoded);
    }
  }, [imageParam]);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError('Prompt is required');
      return;
    }

    setIsRegenerating(true);
    setError('');

    try {
      const response = await fetch('/api/regenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedImages: imageUrls,
          newPrompt: prompt,
          count: parseInt(count),
          productName: name
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to regenerate images');
      }

      // Navigate to regenerated images page
      router.push(`/RegeneratedImages?generationId=${result.generationId}&name=${encodeURIComponent(name)}`);
      
    } catch (error) {
      console.error('Regeneration error:', error);
      setError(error.message || 'Failed to regenerate images. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="min-h-screen px-10 py-8 bg-white">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="w-6 h-6 relative cursor-pointer">
          <Image src="/ArrowBack.svg" alt="Back" fill />
        </button>
        <h1 className="text-3xl font-bold text-[#233B6E]">Regenerate Selected Images</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Selected Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative border-2 rounded-lg overflow-hidden">
            <Image
              src={url}
              alt={`Selected ${index}`}
              width={300}
              height={300}
              className="object-cover w-full h-64"
            />
          </div>
        ))}
      </div>

      {/* Prompt & Count */}
      <div className="max-w-xl space-y-4">
        <div>
          <label className="block text-lg font-bold mb-1">Prompt<span className="text-red-500">*</span></label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter new prompt for regeneration"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg resize-none h-24 focus:ring-2 focus:ring-[#233B6E]"
            disabled={isRegenerating}
          />
        </div>

        <div>
          <label className="block text-lg font-bold mb-1">Count</label>
          <select
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            disabled={isRegenerating}
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={isRegenerating || !prompt.trim()}
            className={`px-8 py-3 rounded-full font-medium transition ${
              isRegenerating || !prompt.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#233B6E] text-white hover:bg-[#1a2951]'
            }`}
          >
            {isRegenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
        </div>
      </div>
    </div>
  );
}
