import Image from "next/image";

interface ImageAttributes {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

const CustomImageComponent: React.FC<ImageAttributes> = ({
  src,
  alt = "Image",
  className,
}) => {
  return (
    <div className={`relative  aspect-[3/2] ${className}`}>
      <Image src={src} alt={alt} fill className="object-cover rounded-2xl " />
    </div>
  );
};

export default CustomImageComponent;
