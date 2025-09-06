import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductCardProps {
  title: string;
  description: string;
  price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  price,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
      <CardFooter>
        <p>${price}</p>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
