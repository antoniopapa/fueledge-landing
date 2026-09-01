import { useRef, useState } from 'react';

const MOCK_BOL_NAME = 'BOL-88412';

type BoLUploaderProps = {
  bol: string | null;
  onUpload: (bol: string) => void;
  mock?: boolean;
};

export default function BoLUploader({ bol, onUpload, mock = false }: BoLUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    onUpload(file.name);
  }

  function triggerUpload() {
    if (mock) {
      onUpload(MOCK_BOL_NAME);
      return;
    }
    inputRef.current?.click();
  }

  const hiddenInput = (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      capture="environment"
      className="hidden"
      onChange={(e) => handleFile(e.target.files?.[0])}
    />
  );

  if (bol) {
    return (
      <>
        {hiddenInput}
        <div className="rounded-lg border border-accent-200 bg-accent-50 p-3">
          <div className="flex items-center gap-2.5">
            {preview ? (
              <img src={preview} alt="Bill of Lading" className="h-14 w-14 rounded-md object-cover object-top" />
            ) : (
              <span className="w-14 h-14 rounded-md bg-accent-100 flex items-center justify-center">
                <i className="ri-file-text-line text-accent-700 text-xl leading-none" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-accent-800">Bill of Lading uploaded</p>
              <p className="truncate text-[11px] text-accent-700 tabular">{bol}</p>
            </div>
            <span className="w-6 h-6 flex items-center justify-center text-accent-600">
              <i className="ri-checkbox-circle-fill text-lg leading-none" />
            </span>
          </div>
          <button
            type="button"
            onClick={triggerUpload}
            className="mt-2 text-[11px] font-medium text-accent-700 hover:text-accent-800 cursor-pointer"
          >
            Replace photo
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {hiddenInput}
      <button
        type="button"
        onClick={triggerUpload}
        className="flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-background-300 bg-background-100/50 px-4 py-4 text-center cursor-pointer hover:bg-background-100 transition-colors"
      >
        <span className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
          <i className="ri-camera-line text-primary-700 text-lg leading-none" />
        </span>
        <span className="text-[12px] font-semibold text-foreground-700">Take photo or upload BoL</span>
        <span className="text-[11px] text-foreground-400">Camera opens on your phone</span>
      </button>
    </>
  );
}