import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export const getProducts = async () => {
  const products = [];
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach(doc => {
    products.push({ id: doc.id, ...doc.data() });
  });
  return { data: { products } };
};
