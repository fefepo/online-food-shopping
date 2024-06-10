import styles from "./cart.module.css";
import { useState } from "react";
import { CartHeader } from "./cartHeader";
import { CartList } from "./cartList";
import { TotalCart } from "./totalCart";

export const Cart = ({ cart, setCart, convertPrice }) => {
  const [total, setTotal] = useState(0);
  const [checkLists, setCheckLists] = useState([]);
  const isAllChecked =
    cart.length === checkLists.length && checkLists.length !== 0;

  const handleQuantity = (type, id, quantity) => {
    const found = cart.filter((el) => el.id === id)[0];
    const idx = cart.indexOf(found);
    let updatedCart;

    if (type === "plus") {
      const cartItem = {
        id: found.id,
        image: found.image,
        name: found.name,
        quantity: quantity,
        price: found.price,
        provider: found.provider,
      };
      updatedCart = [...cart.slice(0, idx), cartItem, ...cart.slice(idx + 1)];
      setCart(updatedCart);
    } else {
      if (quantity === 0) return;
      const cartItem = {
        id: found.id,
        image: found.image,
        name: found.name,
        quantity: quantity,
        price: found.price,
        provider: found.provider,
      };
      updatedCart = [...cart.slice(0, idx), cartItem, ...cart.slice(idx + 1)];
      setCart(updatedCart);
    }
    updateTotal(updatedCart, checkLists);
  };

  const handleRemove = (id) => {
    const updatedCart = cart.filter((cart) => cart.id !== id);
    const updatedCheckLists = checkLists.filter((check) => parseInt(check) !== id);
    setCart(updatedCart);
    setCheckLists(updatedCheckLists);
    updateTotal(updatedCart, updatedCheckLists);
  };

  const handleCheckList = (checked, id) => {
    let updatedCheckLists = [];
    if (checked) {
      updatedCheckLists = [...checkLists, id];
    } else {
      updatedCheckLists = checkLists.filter((check) => check !== id);
    }
    setCheckLists(updatedCheckLists);
    updateTotal(cart, updatedCheckLists);
  };

  const handleCheckAll = (checked) => {
    if (checked) {
      const checkItems = cart.map((cart) => `${cart.id}`);
      setCheckLists(checkItems);
      updateTotal(cart, checkItems);
    } else {
      setCheckLists([]);
      setTotal(0);
    }
  };

  const updateTotal = (cart, checkLists) => {
    const selectedItems = cart.filter((item) =>
      checkLists.includes(`${item.id}`)
    );
    const total = selectedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(total);
  };

  return (
    <>
      <CartHeader isAllChecked={isAllChecked} handleCheckAll={handleCheckAll} />
      {cart.length !== 0 ? (
        cart.map((cart) => {
          return (
            <CartList
              key={`key-${cart.id}`}
              cart={cart}
              setCart={setCart}
              convertPrice={convertPrice}
              handleQuantity={handleQuantity}
              handleRemove={handleRemove}
              handleCheckList={handleCheckList}
              checkLists={checkLists}
            />
          );
        })
      ) : (
        <div className={styles.not}>
          <h2>장바구니에 담긴 상품이 없습니다.</h2>
          <p>원하는 상품을 장바구니에 담아보세요!</p>
        </div>
      )}
      {cart.length !== 0 ? (
        <TotalCart
          total={total}
          convertPrice={convertPrice}
        />
      ) : (
        ""
      )}
    </>
  );
};
