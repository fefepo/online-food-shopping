// src/pages/CategoriesPage.jsx
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Product } from "../components/products/product";
import styles from "./CategoriesPage.module.css";

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const providersCollection = collection(db, "providers");
        const providerSnapshot = await getDocs(providersCollection);
        const categoryList = providerSnapshot.docs.map(doc => doc.data().category);
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products by selected category
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) return;
      try {
        const productsCollection = collection(db, "products");
        const q = query(productsCollection, where("provider", "==", selectedCategory));
        const productsSnapshot = await getDocs(q);
        const productList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2>카테고리</h2>
        <ul className={styles.categoryList}>
          {categories.map((category, index) => (
            <li
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? styles.selected : ""}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.content}>
        {selectedCategory && (
          <>
            <h2>{selectedCategory} 상품</h2>
            <div className={styles.productGrid}>
              {products.map(product => (
                <Product
                  key={product.id}
                  product={product}
                  convertPrice={(price) => price.toLocaleString()} 
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
