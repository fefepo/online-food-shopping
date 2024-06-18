import React, { useState, useEffect } from 'react';
import styles from "./cart.module.css";
import { CartHeader } from "./cartHeader";
import { CartList } from "./cartList";
import { TotalCart } from "./totalCart";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";

export const Cart = ({ cart, setCart, convertPrice }) => {
  const [total, setTotal] = useState(0);
  const [checkLists, setCheckLists] = useState([]);
  const isAllChecked = cart.length === checkLists.length && checkLists.length !== 0;

  useEffect(() => {
    updateTotal(cart, checkLists);
  }, [cart, checkLists]);

  const handleQuantity = (type, id, quantity) => {
    const found = cart.find((el) => el.id === id);
    if (!found) return;

    let updatedCart;
    if (type === 'plus') {
      const updatedItem = { ...found, quantity: found.quantity + 1 };
      updatedCart = cart.map((item) => (item.id === id ? updatedItem : item));
    } else {
      if (quantity === 0) return;
      const updatedItem = { ...found, quantity: found.quantity - 1 };
      updatedCart = cart.map((item) => (item.id === id ? updatedItem : item));
    }
    setCart(updatedCart);
  };

  const handleRemove = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    const updatedCheckLists = checkLists.filter((check) => check !== id);
    setCart(updatedCart);
    setCheckLists(updatedCheckLists);
    updateTotal(updatedCart, updatedCheckLists);
  };

  const handleCheckList = (checked, id) => {
    const updatedCheckLists = checked
      ? [...checkLists, id]
      : checkLists.filter((check) => check !== id);
    setCheckLists(updatedCheckLists);
  };

  const handleCheckAll = (checked) => {
    if (checked) {
      const allIds = cart.map((item) => item.id);
      setCheckLists(allIds);
    } else {
      setCheckLists([]);
    }
  };

  const updateTotal = (cart, checkLists) => {
    const selectedItems = cart.filter((item) => checkLists.includes(item.id));
    const total = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(total);
  };

  const handleOrder = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("사용자 인증이 필요합니다.");
      return;
    }

    if (checkLists.length === 0) {
      alert("선택된 상품이 없습니다.");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        console.error("사용자 정보를 찾을 수 없습니다.");
        return;
      }
      const userData = userDoc.data();
      const selectedItems = cart.filter((item) => checkLists.includes(item.id));

      // Bootpay 결제 요청
      if (window.Bootpay) {
        window.Bootpay.requestPayment({
          application_id: '666f89302ec2db891542ecae',  
          price: total,
          order_name: 'Cart Order',
          order_id: new Date().getTime().toString(), 
          pg: '카카오페이',
          method: '카카오페이',
          user: {
            id: user.uid,
            username: userData.name || 'User',
            phone: userData.phone || '01000000000',
            email: user.email,
          },
          items: selectedItems.map(item => ({
            id: item.id,
            name: item.name,
            qty: item.quantity,
            price: item.price,
          })),
          extra: {
            open_type: 'iframe',
            card_quota: '0,2,3',
            escrow: false,
          },
        })
        .then(async (response) => {
          console.log(response);

          // 결제 성공 시 주문 정보 저장
          const orderPromises = selectedItems.map((item) => {
            const orderData = {
              userId: user.uid,
              userName: userData.name,
              userPhone: userData.phone,
              userEmail: userData.email,
              userAddress: userData.address,
              productId: item.id,
              productName: item.name,
              productImage: item.image,
              productPrice: item.price,
              productProvider: item.provider,
              quantity: item.quantity,
              totalAmount: item.price * item.quantity,
              orderDate: new Date().toISOString(),
            };
            return addDoc(collection(db, "orders"), orderData);
          });

          await Promise.all(orderPromises);

          const remainingCartItems = cart.filter((item) => !checkLists.includes(item.id));
          setCart(remainingCartItems);
          setCheckLists([]);
          updateTotal(remainingCartItems, []);

          alert("결제가 완료되었습니다.");
        })
        .catch((error) => {
          console.error('결제 실패', error);
          alert('결제에 실패했습니다.');
        });
      } else {
        console.error('Bootpay SDK가 로드되지 않았습니다.');
      }
    } catch (error) {
      console.error("주문 처리 중 오류가 발생했습니다.", error);
    }
  };

  return (
    <>
      <CartHeader isAllChecked={isAllChecked} handleCheckAll={handleCheckAll} />
      {cart.length !== 0 ? (
        cart.map((item) => (
          <CartList
            key={item.id}
            cart={item}
            setCart={setCart}
            convertPrice={convertPrice}
            handleQuantity={handleQuantity}
            handleRemove={handleRemove}
            handleCheckList={handleCheckList}
            checkLists={checkLists}
          />
        ))
      ) : (
        <div className={styles.not}>
          <h2>장바구니에 담긴 상품이 없습니다.</h2>
          <p>원하는 상품을 장바구니에 담아보세요!</p>
        </div>
      )}
      {cart.length !== 0 && (
        <>
          <TotalCart total={total} convertPrice={convertPrice} />
          <button className={styles.btn_submit} onClick={handleOrder}>
            주문하기
          </button>
        </>
      )}
    </>
  );
};
