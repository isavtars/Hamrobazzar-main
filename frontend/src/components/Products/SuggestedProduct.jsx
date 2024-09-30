import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";



//clobrative filtering with items base algorithma
// Function to calculate similarity based on categories
const calculateCategorySimilarity = (categories1, categories2) => {
  const intersection = categories1.filter(category => categories2.includes(category)).length;
  const union = [...new Set([...categories1, ...categories2])].length;
  return union > 0 ? intersection / union : 0; 
};

// Function to get recommendations based on the selected product
const getRecommendations = (currentProduct, allProducts) => {
  if (!currentProduct) return [];

  const similarities = allProducts.map(product => {
    if (product._id === currentProduct._id) return { id: product._id, score: 0 };

    return {
      id: product._id,
      score: calculateCategorySimilarity([currentProduct.category], [product.category]),
    };
  });

  return similarities
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => allProducts.find(product => product._id === item.id));
};

const SuggestedProduct = ({ data }) => {
  const { allProducts } = useSelector((state) => state.products);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    if (data && allProducts) {
      const recommendations = getRecommendations(data, allProducts);
      setRecommendedProducts(recommendations);
    }
  }, [data, allProducts]);

  return (
    <div>
      {data ? (
        <div className={`p-4 ${styles.section}`}>
          <h2 className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}>
            Related Products
          </h2>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {recommendedProducts.map((product, index) => (
              <ProductCard data={product} key={index} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SuggestedProduct;
