'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ProductTypePage() {
  const router = useRouter();
  // const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const products = [
    { id: 1, name: 'Hoodie', image: '/ProductTypeHooide.svg' },
    { id: 2, name: 'Blazer', image: '/ProductTypeBlazer.svg' },
    { id: 3, name: 'Parka', image: '/ProductTypeParka.svg' },
    { id: 4, name: 'Cardigan', image: '/ProductTypeHooide.svg' },
    { id: 5, name: 'Shrug', image: '/ProductTypeHooide.svg' },
    { id: 6, name: 'Skirt', image: '/ProductTypeHooide.svg' },
    { id: 7, name: 'Overalls', image: '/ProductTypeHooide.svg' },
    { id: 8, name: 'Blouse', image: '/ProductTypeHooide.svg' },
    { id: 9, name: 'Kurta', image: '/ProductTypeHooide.svg' },
    { id: 10, name: 'Dress', image: '/ProductTypeHooide.svg' },
  ];

  
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, []);

  const handleSelect = (product) => {
    if (selected === product.id) {
      setSelected(null); // Unselect
      console.log('Unselected product:', product);
    } else {
      setSelected(product.id); // Select
      console.log('Selected product:', product);
    }
  };

  const handleNext = () => {
  if (selected) {
    const product = products.find((p) => p.id === selected);
    const query = new URLSearchParams({
      id: product.id,
      name: product.name,
      image: product.image,
    }).toString();

    router.push(`/productDescription?${query}`);
  }
};


  return (
    <div className="min-h-screen bg-white p-6 mt-15 mx-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-6 h-6 relative cursor-pointer">
            <Image src="/ArrowBack.svg" alt="Back" fill />
          </button>
          <h2 className="text-[24px] md:text-[32px] font-semibold text-gray-800">
            Choose your product type
          </h2>
        </div>

        <button onClick={() => router.push('/')} className="w-6 h-6 relative cursor-pointer">
          <Image src="/CrossIcon.svg" alt="Close" fill />
        </button>
      </div>

      {/* Product Grid */}
      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 mb-10">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleSelect(product)}
              className={`bg-white rounded-xl p-3 shadow cursor-pointer flex flex-col items-center transition border-2 ${
                selected === product.id ? 'border-[#233B6E]' : 'border-transparent'
              } hover:shadow-md`}
            >
              <div className="w-full h-50 relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-md"
                />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-700">{product.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!selected}
          className={`px-10 py-2 rounded-full text-white font-medium cursor-pointer ${
            selected
              ? 'bg-[#233B6E] hover:bg-[#1c2f5b]'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
