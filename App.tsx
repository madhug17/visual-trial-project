
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Spinner } from './components/Spinner';
import { generateVirtualTryOnImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

interface GeneratedResult {
  imageUrl: string;
  text: string | null;
}

const App: React.FC = () => {
  const [personFile, setPersonFile] = useState<File | null>(null);
  const [clothingFile, setClothingFile] = useState<File | null>(null);
  const [personPreview, setPersonPreview] = useState<string | null>(null);
  const [clothingPreview, setClothingPreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);

  const handlePersonImageChange = useCallback((file: File | null) => {
    setPersonFile(file);
    if (file) {
      setPersonPreview(URL.createObjectURL(file));
    } else {
      setPersonPreview(null);
    }
  }, []);

  const handleClothingImageChange = useCallback((file: File | null) => {
    setClothingFile(file);
    if (file) {
      setClothingPreview(URL.createObjectURL(file));
    } else {
      setClothingPreview(null);
    }
  }, []);

  const handleGenerate = async () => {
    if (!personFile || !clothingFile) {
      setError('Please upload both a person and a clothing item image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedResult(null);

    try {
      const personBase64 = await fileToBase64(personFile);
      const clothingBase64 = await fileToBase64(clothingFile);
      
      const result = await generateVirtualTryOnImage(personBase64, clothingBase64);

      if (!result.imageUrl) {
        setError(result.text || 'The model did not return an image. Please try different images.');
      } else {
        setGeneratedResult({ imageUrl: result.imageUrl, text: result.text });
      }
    } catch (e) {
      console.error(e);
      setError('An error occurred while generating the image. Please check the console for details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Virtual Try-On Studio
          </h1>
          <p className="mt-2 text-lg text-slate-400">Upload an image of a person and a clothing item to see the magic!</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
            <h2 className="text-2xl font-bold mb-6 text-center text-slate-300">Upload Your Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploader 
                id="person-uploader" 
                label="Person Image" 
                onFileChange={handlePersonImageChange}
                previewUrl={personPreview} 
              />
              <ImageUploader 
                id="clothing-uploader" 
                label="Clothing Item" 
                onFileChange={handleClothingImageChange} 
                previewUrl={clothingPreview}
              />
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={handleGenerate}
                disabled={!personFile || !clothingFile || isLoading}
                className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isLoading ? 'Generating...' : 'Generate Image'}
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 flex items-center justify-center min-h-[400px]">
            {isLoading && <Spinner />}
            {!isLoading && error && (
              <div className="text-center text-red-400">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
            {!isLoading && !error && !generatedResult && (
              <div className="text-center text-slate-500">
                <p className="text-xl font-medium">Your generated image will appear here.</p>
                <p>Upload images and click "Generate" to start.</p>
              </div>
            )}
            {!isLoading && generatedResult && (
              <div className="w-full text-center">
                <h3 className="text-2xl font-bold mb-4 text-slate-300">Result</h3>
                <img 
                  src={generatedResult.imageUrl} 
                  alt="Generated virtual try-on" 
                  className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
                />
                {generatedResult.text && (
                   <p className="mt-4 text-slate-400 italic bg-slate-900/50 p-3 rounded-lg">{generatedResult.text}</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
