// pages/index.jsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">Create Designs With AI</h1>
      <p className="text-lg text-gray-600 mb-6 text-center max-w-xl mt-4">
        Generate Imaginary Images With Your Ideas Running In Your Brian With Some References And Prompting Your Thoughts.
      </p>
      <Link href="/productType">
        <button className="bg-[#EDF5FF] text-[#233B6E] text-[24px] font-medium px-12 py-1 rounded-full border border-[#233B6E] cursor-pointer mt-6">
          Start Now
        </button>
      </Link>
    </div>
  );
}
