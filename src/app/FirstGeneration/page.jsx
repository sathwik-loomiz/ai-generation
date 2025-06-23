'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function GenerateResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const generationId = searchParams.get('generationId');
  const name = searchParams.get('name') || '';

  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generationData, setGenerationData] = useState(null);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [regenPrompt, setRegenPrompt] = useState('');
  const [regenLoading, setRegenLoading] = useState(false);
  const [regenError, setRegenError] = useState('');

  useEffect(() => {
    console.log('[Page] /FirstGeneration: Loaded.');
    if (generationId) {
      console.log(`[Page] /FirstGeneration: Found generationId: ${generationId}. Fetching results...`);
      fetchGenerationResults();
    } else {
      console.warn('[Page] /FirstGeneration: No generationId found. Displaying placeholder data.');
      // Fallback to placeholder data if no generation ID
      const generated = Array.from({ length: 6 }).map((_, i) => ({
        id: `img-${i + 1}`,
        url: `/ai_generated/placeholder${(i % 3) + 1}.jpg`,
      }));
      setImages(generated);
      setLoading(false);
    }
  }, [generationId]);

  const fetchGenerationResults = async () => {
    try {
      setLoading(true);
      console.log(`[Page] /FirstGeneration: Fetching /api/generations/${generationId}`);
      const response = await fetch(`/api/generations/${generationId}`);
      console.log(`[Page] /FirstGeneration: Received response with status: ${response.status}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch generation results');
      }

      console.log('[Page] /FirstGeneration: Successfully fetched data:', data);
      setGenerationData(data);
      
      // Combine original and all regenerations for display
      let allImages = [];
      // Original
      if (data.generatedImages && data.generatedImages.length > 0) {
        allImages = data.generatedImages.map((img, index) => ({
          id: `original-${index + 1}`,
          url: img.cloudinaryUrl,
          prompt: data.prompt,
          isOriginal: true
        }));
      }
      // Regenerations
      if (data.regenerations && data.regenerations.length > 0) {
        data.regenerations.forEach((regen, regenIdx) => {
          if (regen.generatedImages && regen.generatedImages.length > 0) {
            allImages = allImages.concat(
              regen.generatedImages.map((img, i) => ({
                id: `regen-${regenIdx + 1}-${i + 1}`,
                url: img.cloudinaryUrl,
                prompt: regen.prompt,
                isOriginal: false,
                regenIndex: regenIdx + 1
              }))
            );
          }
        });
      }
      setImages(allImages);
    } catch (error) {
      console.error('[Page] /FirstGeneration: Error fetching generation results:', error);
      setError(error.message);
    } finally {
      console.log('[Page] /FirstGeneration: Finished fetching process.');
      setLoading(false);
    }
  };

  const toggleImageSelect = (id) => {
    setSelectedImages((prev) => {
      const newSelection = prev.includes(id) ? prev.filter((imgId) => imgId !== id) : [...prev, id];
      console.log('[Page] /FirstGeneration: Image selection changed:', newSelection);
      return newSelection;
    });
  };

  const downloadImage = (url) => {
    console.log(`[Page] /FirstGeneration: Downloading image from ${url}`);
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
    setShowRegenerateModal(true);
    setRegenPrompt('');
    setRegenError('');
  };

  const handleRegenerateSubmit = async () => {
    if (!regenPrompt.trim()) {
      setRegenError('Prompt is required for regeneration.');
      return;
    }
    setRegenLoading(true);
    setRegenError('');
    try {
      const selectedURLs = images
        .filter((img) => selectedImages.includes(img.id))
        .map((img) => img.url);
      console.log('[Page] /FirstGeneration: Regenerating with selected images:', selectedURLs, 'Prompt:', regenPrompt);
      const response = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationId,
          selectedImages: selectedURLs,
          newPrompt: regenPrompt,
          count: 1, // or allow user to select count
          productName: name
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to regenerate images');
      setShowRegenerateModal(false);
      setRegenPrompt('');
      setSelectedImages([]);
      // Refetch to show new images
      fetchGenerationResults();
    } catch (error) {
      setRegenError(error.message || 'Failed to regenerate images.');
    } finally {
      setRegenLoading(false);
    }
  };

  const handle3DPrototype = () => {
    router.push('/3d-prototype');
  };

  if (loading) {
    return (
      <div className="min-h-screen px-6 md:px-12 py-8 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#233B6E] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading generated images...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen px-6 md:px-12 py-8 bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              console.log('[Page] /FirstGeneration: Clicking "Go Back" from error screen.');
              router.back();
            }}
            className="bg-[#233B6E] text-white px-6 py-3 rounded-full hover:bg-[#1a2951]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Group images by original and regenerations for display
  const groupedImages = [];
  if (generationData) {
    if (generationData.generatedImages && generationData.generatedImages.length > 0) {
      groupedImages.push({
        label: 'Original Generation',
        prompt: generationData.prompt,
        images: generationData.generatedImages.map((img, i) => ({
          id: `original-${i + 1}`,
          url: img.cloudinaryUrl,
          prompt: generationData.prompt
        }))
      });
    }
    if (generationData.regenerations && generationData.regenerations.length > 0) {
      generationData.regenerations.forEach((regen, idx) => {
        groupedImages.push({
          label: `Regeneration #${idx + 1}`,
          prompt: regen.prompt,
          images: regen.generatedImages.map((img, i) => ({
            id: `regen-${idx + 1}-${i + 1}`,
            url: img.cloudinaryUrl,
            prompt: regen.prompt
          }))
        });
      });
    }
  }

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

      {generationData && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Generation Details:</h3>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Prompt:</strong> {generationData.prompt}
          </p>
          {generationData.adjectives && (
            <p className="text-sm text-gray-600 mb-1">
              <strong>Adjectives:</strong> {generationData.adjectives}
            </p>
          )}
          {generationData.color && (
            <p className="text-sm text-gray-600 mb-1">
              <strong>Color:</strong> {generationData.color}
            </p>
          )}
          {generationData.processingTime && (
            <p className="text-sm text-gray-600">
              <strong>Processing Time:</strong> {Math.round(generationData.processingTime / 1000)}s
            </p>
          )}
        </div>
      )}

      {/* Grouped Images Display */}
      {groupedImages.map((group, idx) => (
        <div key={group.label} className="mb-8">
          <h4 className="text-lg font-semibold mb-2">{group.label}</h4>
          <p className="text-sm text-gray-500 mb-2">Prompt: {group.prompt}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {group.images.map((img) => (
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
        </div>
      ))}

      {/* Regenerate Modal */}
      {showRegenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-gray-600"
              onClick={() => setShowRegenerateModal(false)}
              disabled={regenLoading}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Regenerate Images</h2>
            <label className="block mb-2 font-medium">Enter a new prompt:</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 mb-2"
              rows={3}
              value={regenPrompt}
              onChange={e => setRegenPrompt(e.target.value)}
              disabled={regenLoading}
              placeholder="Describe your modifications or new style..."
            />
            {regenError && <p className="text-red-600 text-sm mb-2">{regenError}</p>}
            <button
              className={`w-full py-2 rounded-lg font-semibold ${regenLoading ? 'bg-gray-300 text-gray-500' : 'bg-[#233B6E] text-white hover:bg-[#1a2951]'}`}
              onClick={handleRegenerateSubmit}
              disabled={regenLoading}
            >
              {regenLoading ? 'Regenerating...' : 'Regenerate'}
            </button>
          </div>
        </div>
      )}

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
