import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Product } from "../components/products/product";
import styles from "./wishlist.module.css";

const Wishlist = ({ convertPrice, cart, setCart }) => {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistSets, setWishlistSets] = useState([]);
  const [newSetName, setNewSetName] = useState("");
  const [selectedTab, setSelectedTab] = useState("wishlist");

  useEffect(() => {
    const fetchWishlist = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const q = query(collection(db, "users"), where("uid", "==", user.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setWishlist(userData.wishlist || []);
            setWishlistSets(userData.wishlistSets || []);
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
          const updatedWishlist = userData.wishlist.filter(item => item.id !== productId);

          await setDoc(userRef, { wishlist: updatedWishlist }, { merge: true });
          setWishlist(updatedWishlist);
          alert("상품이 찜 목록에서 삭제되었습니다.");
        } else {
          console.log("User data not found!");
        }
      } catch (error) {
        console.error("Error removing document: ", error);
      }
    }
  };

  const handleCreateSet = async () => {
    const user = auth.currentUser;
    if (user && newSetName.trim() !== "") {
      try {
        const newSet = { name: newSetName, items: [] };
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userRef = doc(db, "users", querySnapshot.docs[0].id);
          const userData = querySnapshot.docs[0].data();

          // Ensure wishlistSets is an array before pushing the new set
          const updatedWishlistSets = [...(userData.wishlistSets || []), newSet];

          await setDoc(userRef, { wishlistSets: updatedWishlistSets }, { merge: true });
          setWishlistSets(updatedWishlistSets);

          setNewSetName("");
          alert("세트가 생성되었습니다.");
        } else {
          console.log("User data not found!");
        }
      } catch (error) {
        console.error("Error creating set: ", error);
      }
    }
  };

  const handleAddItemToSet = async (setName, item) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userRef = doc(db, "users", querySnapshot.docs[0].id);
          const userData = querySnapshot.docs[0].data();

          // Check if the item already exists in the set
          let itemExists = false;
          const updatedWishlistSets = (userData.wishlistSets || []).map(set => {
            if (set.name === setName) {
              // Check if the item is already in the set
              if (!set.items.some(existingItem => existingItem.id === item.id)) {
                set.items.push(item);
                itemExists = true;
              } else {
                itemExists = false; // item already exists
              }
            }
            return set;
          });

          // If the item was added successfully, update Firestore and state
          if (itemExists) {
            await setDoc(userRef, { wishlistSets: updatedWishlistSets }, { merge: true });
            setWishlistSets(updatedWishlistSets);
            alert(`상품이 ${setName} 세트에 추가되었습니다.`);
          } else {
            alert(`이미 ${setName} 세트에 해당 상품이 있습니다.`);
          }
        } else {
          console.log("User data not found!");
        }
      } catch (error) {
        console.error("Error adding item to set: ", error);
      }
    }
  };

  const handleRemoveItemFromSet = async (setName, itemId) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userRef = doc(db, "users", querySnapshot.docs[0].id);
          const userData = querySnapshot.docs[0].data();

          const updatedWishlistSets = (userData.wishlistSets || []).map(set => {
            if (set.name === setName) {
              set.items = set.items.filter(item => item.id !== itemId);
            }
            return set;
          });

          await setDoc(userRef, { wishlistSets: updatedWishlistSets }, { merge: true });
          setWishlistSets(updatedWishlistSets);
          alert(`상품이 ${setName} 세트에서 삭제되었습니다.`);
        } else {
          console.log("User data not found!");
        }
      } catch (error) {
        console.error("Error removing item from set: ", error);
      }
    }
  };

  const handleAddSetToCart = (items) => {
    console.log("추가할 세트의 아이템들:", items);

    // cart 상태가 배열이 아닌 경우, 기본적으로 빈 배열로 설정
    const updatedCart = Array.isArray(cart) ? [...cart] : [];

    items.forEach((item) => {
      const foundItem = updatedCart.find(cartItem => cartItem.id === item.id);
      if (foundItem) {
        foundItem.quantity += 1; // 수량 업데이트
        console.log(`${item.name}의 수량이 업데이트되었습니다. 새로운 수량:`, foundItem.quantity);
      } else {
        updatedCart.push({ ...item, quantity: 1 });
        console.log(`${item.name}이(가) 장바구니에 추가되었습니다.`);
      }
    });

    setCart(updatedCart);
    console.log("업데이트된 장바구니:", updatedCart);
    alert("세트의 상품이 장바구니에 추가되었습니다.");
  };

  const handleRemoveSet = async (setName) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userRef = doc(db, "users", querySnapshot.docs[0].id);
          const userData = querySnapshot.docs[0].data();
          const updatedWishlistSets = (userData.wishlistSets || []).filter(set => set.name !== setName);

          await setDoc(userRef, { wishlistSets: updatedWishlistSets }, { merge: true });
          setWishlistSets(updatedWishlistSets);
          alert(`${setName} 세트가 삭제되었습니다.`);
        } else {
          console.log("User data not found!");
        }
      } catch (error) {
        console.error("Error removing set: ", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2>목록</h2>
        <ul className={styles.tabList}>
          <li
            className={selectedTab === "wishlist" ? styles.selected : ""}
            onClick={() => setSelectedTab("wishlist")}
          >
            찜 목록
          </li>
          <li
            className={selectedTab === "sets" ? styles.selected : ""}
            onClick={() => setSelectedTab("sets")}
          >
            찜 세트
          </li>
        </ul>
        {selectedTab === "wishlist" && (
          <div className={styles.createSetContainer}>
            <h3>찜 세트 만들기</h3>
            <input
              type="text"
              value={newSetName}
              onChange={(e) => setNewSetName(e.target.value)}
              placeholder="세트 이름"
            />
            <button onClick={handleCreateSet}>세트 생성</button>
          </div>
        )}
      </div>
      <div className={styles.content}>
        {selectedTab === "wishlist" ? (
          <>
            <h2>찜한 상품들</h2>
            <div className={styles.productGrid}>
              {wishlist.length > 0 ? (
                wishlist.map(item => (
                  <div key={item.id} className={styles.productContainer}>
                    <Product product={item} convertPrice={convertPrice} />
                    <button className={`${styles.button} ${styles.danger}`} onClick={() => removeFromWishlist(item.id)}>삭제</button>
                    {wishlistSets.map(set => (
                      <button
                        className={styles.button}
                        key={set.name}
                        onClick={() => handleAddItemToSet(set.name, item)}
                      >
                        {set.name}에 추가
                      </button>
                    ))}
                  </div>
                ))
              ) : (
                <p>찜한 상품이 없습니다.</p>
              )}
            </div>
          </>
        ) : (
          <>
            <h2>찜한 세트들</h2>
            <div className={styles.setsContainer}>
              {wishlistSets.length > 0 ? (
                wishlistSets.map(set => (
                  <div key={set.name} className={styles.setContainer}>
                    <h3>{set.name}</h3>
                    <div className={styles.setItems}>
                      {set.items.length > 0 ? (
                        set.items.map(item => (
                          <div key={item.id} className={styles.productContainer}>
                            <Product product={item} convertPrice={convertPrice} />
                            <button className={`${styles.button} ${styles.danger}`} onClick={() => handleRemoveItemFromSet(set.name, item.id)}>
                              삭제
                            </button>
                          </div>
                        ))
                      ) : (
                        <p>이 세트에 추가된 상품이 없습니다.</p>
                      )}
                    </div>
                    <div className={styles.setActions}>
                      <button className={styles.button} onClick={() => handleAddSetToCart(set.items)}>
                        장바구니에 추가
                      </button>
                      <button className={`${styles.button} ${styles.danger}`} onClick={() => handleRemoveSet(set.name)}>
                        세트 삭제
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>생성된 찜 세트가 없습니다.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
