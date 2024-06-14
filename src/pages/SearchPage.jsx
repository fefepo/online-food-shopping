import React, { useEffect, useState } from "react";
import styles from "./searchPage.module.css";
import { useLocation } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Product } from "../components/products/product";
import { EventBanner } from "../components/eventBanner/eventBanner";

export const SearchPage = ({ convertPrice }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("query");

  const [searchResults, setSearchResults] = useState([]);
  const [sortedResults, setSortedResults] = useState([]);
  const [ingredientList, setIngredientList] = useState([]);

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
    const fetchProductsAndIngredients = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const ingredientsCollection = collection(db, 'ingredients');

        // 검색어에 해당하는 제품 필터링
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const filteredProducts = productList.filter(product =>
          product.name.includes(searchTerm)
        );

        // 음식에 해당하는 재료 가져오기
        const ingredientQuery = query(ingredientsCollection, where("__name__", "==", searchTerm));
        const ingredientSnapshot = await getDocs(ingredientQuery);

        let ingredientList = [];
        ingredientSnapshot.forEach(doc => {
          const data = doc.data();
          ingredientList = Object.values(data);
        });

        console.log("Ingredients List: ", ingredientList);
        setIngredientList(ingredientList);

        // 재료 이름을 포함하는 제품 검색
        let ingredientProducts = [];
        if (ingredientList.length > 0) {
          ingredientProducts = productList.filter(product =>
            ingredientList.some(ingredient => product.name.includes(ingredient))
          );
        }

        console.log("Ingredient Products: ", ingredientProducts);

        // 제품과 재료 제품 합치기
        const combinedResults = [...filteredProducts, ...ingredientProducts];

        // 중복 제거
        const uniqueResults = combinedResults.filter((result, index, self) =>
          index === self.findIndex((r) => r.id === result.id)
        );

        console.log("Combined Results: ", uniqueResults);
        setSearchResults(uniqueResults);
        setSortedResults(uniqueResults); // 초기 정렬 설정
      } catch (error) {
        console.error("Error fetching products and ingredients: ", error);
      }
    };

    if (searchTerm) {
      fetchProductsAndIngredients();
    }
  }, [searchTerm]);

  return (
    <>
      <EventBanner />
      {ingredientList.length > 0 && (
        <div className={styles.ingredientList}>
          {ingredientList.map((ingredient, index) => (
            <div key={index} className={styles.ingredientItem}>
              {ingredient}
            </div>
          ))}
        </div>
      )}
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
