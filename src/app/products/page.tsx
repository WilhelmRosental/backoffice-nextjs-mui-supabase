import { NextPage } from "next";

import { useFetchFilteredProducts } from "@/hooks/products/useFetchFilteredProducts";
import ProductsDisplay from "@/components/ProductsDisplay";

interface ProductsDisplayProps {
  range: Range;
}

const Products: NextPage = () => {
  return (
    <>
      <h1>Products</h1>
      <ProductsDisplay range={{ from: 0, to: 40 }} />
    </>
  );
};

export default Products;
