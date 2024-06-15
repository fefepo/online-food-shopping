import styles from "./detail.module.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../../service/fetcher";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { collection, addDoc, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";

export const Detail = ({ convertPrice, cart, setCart, wishlist, setWishlist }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts().then((data) => {
      const foundProduct = data.data.products.find((product) => product.id === id);
      setProduct(foundProduct);
      setLoading(false);
    });
  }, [id]);

  const handleQuantity = (type) => {
    if (type === "plus") {
      setCount(count + 1);
    } else {
      if (count === 1) return;
      setCount(count - 1);
    }
  };

  const setQuantity = (id, quantity) => {
    const found = cart.filter((el) => el.id === id)[0];
    const idx = cart.indexOf(found);
    const cartItem = {
      id: product.id,
      image: product.image,
      name: product.name,
      quantity: quantity,
      price: product.price,
      provider: product.provider,
    };
    setCart([...cart.slice(0, idx), cartItem, ...cart.slice(idx + 1)]);
  };

  const handleCart = () => {
    const user = auth.currentUser;
    if (!user) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/login");
      return;
    }

    const cartItem = {
      id: product.id,
      image: product.image,
      name: product.name,
      quantity: count,
      price: product.price,
      provider: product.provider,
    };
    const found = cart.find((el) => el.id === cartItem.id);
    if (found) setQuantity(cartItem.id, found.quantity + count);
    else setCart([...cart, cartItem]);
    alert("장바구니에 담겼습니다.");
  };

  const handleWishlist = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/login");
      return;
    }

    const wishlistItem = {
      id: product.id,
      image: product.image,
      name: product.name,
      price: product.price,
      provider: product.provider,
    };

    const userRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userRef, {
        wishlist: arrayUnion(wishlistItem)
      });
      console.log("상품을 찜 목록에 추가했습니다.");
      alert("상품을 찜 목록에 추가했습니다.");

      setWishlist([...wishlist, wishlistItem]);
    } catch (error) {
      console.error("상품을 찜 목록에 추가하는 중 오류가 발생했습니다.", error);
    }
  };

  const handleBuyNow = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/login");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        console.error("사용자 정보를 찾을 수 없습니다.");
        return;
      }
      const userData = userDoc.data();

      const orderData = {
        userId: user.uid,
        userName: userData.name,
        userPhone: userData.phone,
        userEmail: userData.email,
        userAddress: userData.address,
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        productPrice: product.price,
        productProvider: product.provider,
        quantity: count,
        totalAmount: product.price * count,
        orderDate: new Date().toISOString()
      };

      await addDoc(collection(db, "orders"), orderData);

      alert("구매가 완료되었습니다.");
    } catch (error) {
      console.error("구매 처리 중 오류가 발생했습니다.", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <main className={styles.main}>
        <section className={styles.product}>
          <div className={styles.product_img}>
            <img src={product.image} alt="product" />
          </div>
        </section>
        <section className={styles.product}>
          <div className={styles.product_info}>
            <p className={styles.seller_store}>{product.provider}</p>
            <p className={styles.product_name}>{product.name}</p>
            <span className={styles.price}>
              {convertPrice(product.price + "")}
              <span className={styles.unit}>원</span>
            </span>
          </div>

          <div className={styles.delivery}>
            <p>택배배송 / 무료배송</p>
          </div>

          <div className={styles.line}></div>

          <div className={styles.amount}>
            <img
              className={styles.minus}
              src="/images/icon-minus-line.svg"
              alt="minus"
              onClick={() => handleQuantity("minus")}
            />

            <div className={styles.count}>
              <span>{count}</span>
            </div>

            <img
              className={styles.plus}
              src="/images/icon-plus-line.svg"
              alt="plus"
              onClick={() => handleQuantity("plus")}
            />
          </div>

          <div className={styles.line}></div>

          <div className={styles.sum}>
            <div>
              <span className={styles.sum_price}>총 상품 금액</span>
            </div>

            <div className={styles.total_info}>
              <span className={styles.total}>
                총 수량 <span className={styles.total_count}>{count}개</span>
              </span>
              <span className={styles.total_price}>
                {convertPrice(product.price * count)}
                <span className={styles.total_unit}>원</span>
              </span>
            </div>
          </div>

          <div className={styles.btn}>
            <button className={styles.btn_buy} onClick={handleBuyNow}>
              바로 구매
            </button>
            <button
              className={styles.btn_cart}
              onClick={handleCart}
            >
              장바구니
            </button>
            <button
              className={styles.btn_wishlist}
              onClick={handleWishlist}
            >
              <FavoriteIcon /> 찜
            </button>
          </div>
        </section>
      </main>
    </>
  );
};
