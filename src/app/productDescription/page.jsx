'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

export default function ProductDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get('name');
  const image = searchParams.get('image');

  const [prompt, setPrompt] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [adjectives, setAdjectives] = useState('');
  const [color, setColor] = useState('');
  const [count, setCount] = useState('1');
  const [error, setError] = useState('');

  const [showHelp, setShowHelp] = useState(false);

const samplePrompts = [
  'A modern hoodie with abstract geometric patterns',
  'A sleek minimalist design for sportswear',
  'A vintage retro-style T-shirt with neon vibes',
  'Eco-friendly fabric dress with pastel tones',
  'Luxury streetwear with bold typography',
];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 5 - uploadedImages.length;

    if (files.length > remaining) {
      alert(`You can only upload ${remaining} more image(s).`);
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            url: event.target.result,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Prompt is required.');
      return;
    }

    setError('');

    // Simulate API payload
    const payload = {
      prompt,
      adjectives,
      color,
      count,
      product: { name, image },
      references: uploadedImages.map((img) => img.url),
    };

    console.log('Sending data to backend:', payload);

    // You can replace this with actual API call
    // Example:
    // const response = await fetch('/api/generate', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // });

    // Navigate to results page with query OR save to storage
    router.push(`/FirstGeneration?prompt=${encodeURIComponent(prompt)}&name=${name}`);
  };

  return (
    <div className="min-h-screen bg-white px-8 py-6 mx-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 justify-between">
  <div className="flex items-center gap-3">
    <button onClick={() => router.back()} className="w-6 h-6 relative cursor-pointer">
      <Image src="/ArrowBack.svg" alt="Back" fill />
    </button>
    <h1 className="text-[24px] md:text-[32px] font-semibold text-[#233B6E] ml-4">
      Product Description
    </h1>
  </div>

  {/* Help Icon */}
  <div className="relative">
    <button
      onClick={() => setShowHelp((prev) => !prev)}
      className="w-8 h-8 rounded-full bg-[#233B6E] text-white text-xl flex items-center justify-center hover:bg-[#1d2d55]"
    >
      ?
    </button>

    {/* Help Popup */}
    {showHelp && (
      <div className="absolute right-0 mt-2 w-[300px] bg-white border border-gray-300 shadow-xl rounded-lg z-50 p-4">
        <h3 className="text-lg font-semibold mb-2 text-[#233B6E]">Sample Prompts</h3>
        <ul className="space-y-2">
          {samplePrompts.map((text, i) => (
            <li key={i} className="flex justify-between items-start text-sm">
              <span className="text-gray-700 mr-2">{text}</span>
              <button
                onClick={() => navigator.clipboard.writeText(text)}
                className="text-blue-500 hover:text-blue-700 text-xs"
              >
                Copy
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
</div>


      <div className="flex flex-col md:flex-row gap-8">
        {/* Left - Product Info */}
        <div className="w-full md:w-1/4 p-6 rounded-lg">
          <div className="flex flex-col items-center gap-4">
            {image && (
              <div className="w-70 h-70 relative border-2 border-gray-200 rounded-lg overflow-hidden">
                <Image src={image} alt={name || 'Product'} layout="fill" objectFit="contain" />
              </div>
            )}
            {name && (
              <p className="text-center font-semibold text-4xl text-gray-700">{name}</p>
            )}
          </div>
        </div>

        {/* Right - Form */}
        <div className="w-full md:w-3/4 space-y-6">
          {/* Prompt */}
          <div>
            <label className="block text-lg font-bold mb-2">Prompt<span className="text-red-500">*</span></label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to generate..."
              className="w-full border border-gray-300 px-4 py-3 rounded-lg resize-none h-24 focus:ring-2 focus:ring-[#233B6E]"
              required
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>

          {/* Upload Reference Images */}
          <div>
            <label className="block text-lg font-bold mb-2">Upload Reference Images (Max: 5)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#233B6E]">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer text-gray-500 text-sm font-medium">
                Click to upload images
              </label>
            </div>

            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="relative group w-full aspect-square rounded border">
                    <Image src={img.url} alt={img.name} layout="fill" objectFit="cover" className="rounded" />
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inputs: Adjectives, Color, Count */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-lg font-bold mb-1">Adjectives</label>
              <input
                type="text"
                value={adjectives}
                onChange={(e) => setAdjectives(e.target.value)}
                placeholder="e.g. bold, stylish"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#233B6E]"
              />
            </div>
            <div>
              <label className="block text-lg font-bold mb-1">Color</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. red, pastel"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#233B6E]"
              />
            </div>
            <div>
              <label className="block text-lg font-bold mb-1">Count</label>
              <select
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#233B6E] bg-white"
              >
                {[1, 2, 3, 4, 5, 6].map((val) => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleGenerate}
              className="w-1/4 bg-[#233B6E] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1d2d55]"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
