import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Product } from "../components/products/product";
import styles from "./wishlist.module.css";

const Wishlist = ({ convertPrice }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const q = query(collection(db, "users"), where("uid", "==", user.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            const updatedWishlist = userData.wishlist || [];
            setWishlist(updatedWishlist);
          } else {
            console.log("User data not found!");
          }
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        }
      }
    };
  
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userRef = doc(db, "users", querySnapshot.docs[0].id);
          const userData = querySnapshot.docs[0].data();
          const updatedWishlist = userData.wishlist || [];
          const filteredWishlist = updatedWishlist.filter(item => item.id !== productId);
          
          await setDoc(userRef, { wishlist: filteredWishlist }, { merge: true });
          setWishlist(filteredWishlist); // Update local state after deleting
          console.log("Document successfully updated!");
          alert("상품이 찜 목록에서 삭제되었습니다.");
        } else {
          console.log("User data not found!");
        }
      } catch (error) {
        console.error("Error removing document: ", error);
      }
    }
  };

  return (
    <div className={styles.wishlistContainer}>
      {wishlist.length > 0 ? (
        wishlist.map((item) => (
          <div key={item.id} className={styles.productContainer}>
            <Product product={item} convertPrice={convertPrice} />
            <button className={styles.removeButton} onClick={() => removeFromWishlist(item.id)}>찜 삭제</button>
          </div>
        ))
      ) : (
        <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>찜한 상품이 없습니다. 상품 정보에 들어가 찜을 추가하세요!</p>
      )}
    </div> 
  );
};

export default Wishlist;
