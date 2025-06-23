'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function RegeneratePage() {
  const router = useRouter(); // ✅ MISSING BEFORE
  const searchParams = useSearchParams();
  const imageParam = searchParams.get('images');

  const [prompt, setPrompt] = useState('');
  const [count, setCount] = useState('1');
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (imageParam) {
      const decoded = imageParam.split(',').map(decodeURIComponent);
      setImageUrls(decoded);
    }
  }, [imageParam]);

  const handleSubmit = () => {
    if (!prompt.trim()) {
      alert('Prompt is required');
      return;
    }

    const query = new URLSearchParams({
      count,
      prompt,
    }).toString();

    router.push(`/RegeneratedImages?${query}`);
  };

  return (
    <div className="min-h-screen px-10 py-8 bg-white">
      <h1 className="text-3xl font-bold text-[#233B6E] mb-6">Regenerate Selected Images</h1>

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
          <label className="block text-lg font-bold mb-1">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter new prompt for regeneration"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg resize-none h-24 focus:ring-2 focus:ring-[#233B6E]"
          />
        </div>

        <div>
          <label className="block text-lg font-bold mb-1">Count</label>
          <select
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
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
            className="bg-[#233B6E] text-white px-8 py-3 rounded-full hover:bg-[#1a2951]"
          >
            Regenerate
          </button>
        </div>
      </div>
    </div>
  );
}
