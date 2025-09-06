"use client";
import React from "react";
import Image from "next/image";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

interface ProductCardProps {
  name: string;
  imageUrl: string;
  retailer: string;
  store_code: string;
  product_id: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  imageUrl,
  retailer,
  store_code,
  product_id,
}) => {
  const generateLink = useAction(api.links.generateAffiliateLink);

  const handleLinkClick = async () => {
    try {
      const url = await generateLink({ store_code, product_id });
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to generate affiliate link:", error);
      // Handle the error appropriately, e.g., show a message to the user
    }
  };

  return (
    <div>
      <h3>{name}</h3>
      <Image src={imageUrl} alt={name} width={200} height={200} />
      <p>Retailer: {retailer}</p>
      <button onClick={handleLinkClick}>View on Store</button>
    </div>
  );
};

export default ProductCard;
