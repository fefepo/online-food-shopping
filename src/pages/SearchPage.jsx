import React, { useEffect, useState } from "react";
import styles from "./searchPage.module.css";
import { useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Product } from "../components/products/product";
import { EventBanner } from "../components/eventBanner/eventBanner";

export const SearchPage = ({ convertPrice }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("query");

  const [searchResults, setSearchResults] = useState([]);
  const [sortedResults, setSortedResults] = useState([]);

  const sortProduct = (type) => {
    const newProduct = [...searchResults];
    if (type === "recent") {
      newProduct.sort((a, b) => a.id - b.id);
    } else if (type === "low") {
      newProduct.sort((a, b) => a.price - b.price);
    } else if (type === "high") {
      newProduct.sort((a, b) => b.price - a.price);
    }
    setSortedResults(newProduct);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 이름에 검색어가 포함된 제품만 필터링
        const filteredProducts = productList.filter(product =>
          product.name.includes(searchTerm)
        );

        console.log("Fetched products:", filteredProducts);
        setSearchResults(filteredProducts);
        setSortedResults(filteredProducts); // 초기 정렬 설정
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    if (searchTerm) {
      fetchProducts();
    }
  }, [searchTerm]);

  return (
    <>
      <EventBanner />
      <div className={styles.filter}>
        <p onClick={() => sortProduct("recent")}>최신순</p>
        <p onClick={() => sortProduct("low")}>낮은 가격</p>
        <p onClick={() => sortProduct("high")}>높은 가격</p>
      </div>
      <main className={styles.flex_wrap}>
        {sortedResults.length > 0 ? (
          sortedResults.map((product) => (
            <Product
              key={`key-${product.id}`}
              product={product}
              convertPrice={convertPrice}
            />
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </main>
    </>
  );
};
