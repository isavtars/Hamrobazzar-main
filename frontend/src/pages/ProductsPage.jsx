import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";

// Merge Sort algorithm to sort products by a key (e.g., price)
const mergeSort = (array, key) => {
  if (array.length <= 1) {
    return array;
  }

  const middleIndex = Math.floor(array.length / 2);
  const left = mergeSort(array.slice(0, middleIndex), key);
  const right = mergeSort(array.slice(middleIndex), key);

  return merge(left, right, key);
};

const merge = (left, right, key) => {
  let sortedArray = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i][key] < right[j][key]) {
      sortedArray.push(left[i]);
      i++;
    } else {
      sortedArray.push(right[j]);
      j++;
    }
  }

  return [...sortedArray, ...left.slice(i), ...right.slice(j)];
};

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [data, setData] = useState([]);

  useEffect(() => {
    let d;
    if (categoryData === null) {
      d = allProducts;
    } else {
      d = allProducts && allProducts.filter((i) => i.category === categoryData);
    }


    const sortedData = mergeSort(d || [], 'price');
    setData(sortedData);

  }, [allProducts, categoryData]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={3} />
          <br />
          <br />
          <div className={`${styles.section}`}>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
              {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
            </div>
            {data && data.length === 0 ? (
              <h1 className="text-center w-full pb-[100px] text-[20px]">
                No products Found!
              </h1>
            ) : null}
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default ProductsPage;
