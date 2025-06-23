'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function RegeneratePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const imageParam = searchParams.get('images');
  const generationId = searchParams.get('generationId');
  const name = searchParams.get('name');

  const [prompt, setPrompt] = useState('');
  const [count, setCount] = useState('1');
  const [imageUrls, setImageUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (imageParam) {
      const decoded = imageParam.split(',').map(decodeURIComponent);
      setImageUrls(decoded);
    }
  }, [imageParam]);

  const handleSubmit = async () => {
    setError('');

    if (!prompt.trim()) {
      setError('Prompt is required.');
      return;
    }

    try {
      setSubmitting(true);

      // const res = await fetch('/api/regenerate', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     generationId,
      //     selectedImages: imageUrls,
      //     newPrompt: prompt,
      //     count: parseInt(count),
      //     productName: name || ''
      //   })
      // });

      // const text = await res.text();

      // let data;
      // try {
      //   data = JSON.parse(text);
      // } catch (err) {
      //   console.error('Response was not JSON:', text);
      //   throw new Error('Server error: Invalid JSON returned. Check server logs.');
      // }

      // if (!res.ok) {
      //   throw new Error(data.error || 'Failed to regenerate');
      // }

      // Redirect on success
      router.push(
        `/RegeneratedImages?generationId=${generationId}&name=${name}&count=${count}&prompt=${encodeURIComponent(prompt)}`
      );

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-6 md:px-16 py-10 bg-white mt-[65px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-6 h-6 relative cursor-pointer">
            <Image src="/ArrowBack.svg" alt="Back" fill />
          </button>
          <h1 className="text-[24px] md:text-[32px] font-semibold text-[#233B6E]">
            Regenerate Designs
          </h1>
        </div>
        <button onClick={() => router.push('/')} className="w-6 h-6 relative cursor-pointer">
          <Image src="/CrossIcon.svg" alt="Close" fill />
        </button>
      </div>

      {/* Selected Images */}
      {imageUrls.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative border border-gray-300 rounded-lg overflow-hidden">
              <Image
                src={url}
                alt={`Selected ${index}`}
                width={300}
                height={300}
                className="object-contain w-full h-64"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-10">No images selected for regeneration.</p>
      )}

      {/* Prompt and Count */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-2/3">
          <label className="block text-lg font-semibold mb-2">
            Prompt<span className="text-red-500">*</span>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter new prompt for regeneration"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg resize-none h-28 focus:ring-2 focus:ring-[#233B6E]"
          />
          {error && (
            <p className="text-red-600 mt-2 text-sm">{error}</p>
          )}
        </div>

        <div className="w-full md:w-1/3">
          <label className="block text-lg font-semibold mb-2">Count</label>
          <select
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#233B6E] bg-white"
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Button (below count field) */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`px-8 py-3 rounded-full font-semibold transition ${
            submitting
              ? 'bg-gray-400 text-gray-100 cursor-not-allowed'
              : 'bg-[#233B6E] text-white hover:bg-[#1a2951]'
          }`}
        >
          {submitting ? 'Regenerating...' : 'Regenerate'}
        </button>
      </div>
    </div>
  );
}
