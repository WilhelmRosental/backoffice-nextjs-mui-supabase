"use client";

import React from "react";
import { useFetchFilteredProducts } from "@/hooks/products/useFetchFilteredProducts";
import { Card, CardContent, CardMedia, Typography, Grid } from "@mui/material";
import { Range, Product } from "@/types";

interface ProductsDisplayProps {
  range: Range;
}

const ProductsDisplay: React.FC<ProductsDisplayProps> = ({ range }) => {
  const { products, loading, error } = useFetchFilteredProducts(range);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Grid container spacing={2}>
      {products?.map((product: Product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <Card variant="outlined">
            {/* <CardMedia
              component="img"
              height="140"
              image={product.image_url} // Remplacez par la propriété appropriée pour l'URL de l'image
              alt={product.name}
            /> */}
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {product.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.description}
              </Typography>
              {/* Ajoutez d'autres détails du produit ici si nécessaire */}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductsDisplay;
