// components/ProductCard.tsx
import React from "react";
import Image from "next/image";

interface ProductCardProps {
  name: string;
  imageUrl: string;
  retailer: string;
  externalLink: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  imageUrl,
  retailer,
  externalLink,
}) => {
  return (
    <div>
      <h3>{name}</h3>
      <Image src={imageUrl} alt={name} width={200} height={200} />
      <p>Retailer: {retailer}</p>
      <a href={externalLink} target="_blank" rel="noopener noreferrer">
        View on Store
      </a>
    </div>
  );
};

export default ProductCard;
