
import React, { useCallback, useRef } from 'react';

interface ImageUploaderProps {
  id: string;
  label: string;
  onFileChange: (file: File | null) => void;
  previewUrl: string | null;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onFileChange, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileChange(file);
  }, [onFileChange]);

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    onFileChange(null);
  };

  return (
    <div className="flex flex-col items-center">
      <label className="text-lg font-semibold text-slate-400 mb-2">{label}</label>
      <div 
        className="w-full h-64 bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center cursor-pointer hover:border-purple-500 transition-colors duration-300 relative overflow-hidden group"
        onClick={handleContainerClick}
      >
        <input 
          id={id} 
          type="file" 
          accept="image/*" 
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        {previewUrl ? (
          <>
            <img src={previewUrl} alt={label} className="w-full h-full object-cover" />
            <button 
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </>
        ) : (
          <div className="text-center">
            <UploadIcon />
            <p className="text-slate-500">Click to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};
