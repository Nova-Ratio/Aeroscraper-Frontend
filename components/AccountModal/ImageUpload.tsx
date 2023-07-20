import { ChangeEvent, FC, useRef } from 'react';
import { UploadIcon } from "../Icons/Icons";
import Text from '../Texts/Text';

const ImageUpload: FC<{ onImageUpload: (image: string) => void }> = ({ onImageUpload }) => {

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const base64 = event.target?.result as string;
        onImageUpload(base64);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='w-full h-full'>
      <button onClick={handleButtonClick} className="bg-[#74517A] px-2 py-2.5 w-full rounded flex justify-between items-center relative">
        <Text size='base' className="mr-auto">Drop an image or select from your device</Text>
        <UploadIcon />
      </button>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept='image/*'
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUpload;