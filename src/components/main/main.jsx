import styles from "./main.module.css";
import { useEffect } from "react";
import { EventBanner } from "../eventBanner/eventBanner";
import { Product } from "../products/product";
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

export const Main = ({ convertPrice, products, setProducts }) => {
  const sortProduct = (type) => {
    const newProduct = [...products];
    if (type === "recent") {
      newProduct.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
    } else if (type === "row") {
      newProduct.sort((a, b) => a.price - b.price);
    } else if (type === "high") {
      newProduct.sort((a, b) => b.price - a.price);
    }
    setProducts(newProduct);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'products');
      const q = query(productsCollection, orderBy("createdAt", "desc"));
      const productSnapshot = await getDocs(q);
      const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
    };

    fetchProducts();
  }, [setProducts]);

  return (
    <>
      <EventBanner />
      <div className={styles.filter}>
        <p onClick={() => sortProduct("recent")}>최신순</p>
        <p onClick={() => sortProduct("row")}>낮은 가격</p>
        <p onClick={() => sortProduct("high")}>높은 가격</p>
      </div>
      <main className={styles.flex_wrap}>
        {products.map((product) => {
          return (
            <Product
              key={`key-${product.id}`}
              product={product}
              convertPrice={convertPrice}
            />
          );
        })}
      </main>
    </>
  );
};
