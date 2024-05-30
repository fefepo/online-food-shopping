import styles from "./cart.module.css";
import { CartHeader } from "./cartHeader";
import { CartList } from "./cartList";
import { TotalCart } from "./totalCart";

export const Cart = ({cart, setCart}) => {

  const handleQuantity = (type, id, quantity) => {
    const found = cart.filter((el) => el.id === id)[0];
    const idx = cart.indexOf(found);
    const cartItem = {
      id: found.id,
      Image: found.image,
      name: found.name,
      price: found.price,
      quantity: quantity,
      provider: found.provider,
    };
    if (type === "plus") {
      setCart([...cart.slice(0, idx), cartItem, ...cart.slice(idx+1)]);  
    }else {
      if(quantity === 0) return;
      setCart([...cart.slice(0, idx), cartItem, ...cart.slice(idx+1)]);
    }
  };


  const handleRemove = (id) => {
    setCart(cart.filter((el) => el.id !== id));
  };
  return (
    <>
      <header className={styles.header}>
        <h1>장바구니</h1>
      </header>
      <CartHeader />
      {cart.length === 0 ? (
        <div>
          <h2>장바구니에 담긴 상품이 없습니다.</h2>
          <p>원하는 상품을 장바구니에 담으세요</p>
        </div>

      ) :( 
        cart.map((cart) => {
        return (
          <CartList 
            key = {`key-${cart.id}`}
            cart = {cart} 
            handleQuantity={handleQuantity}
            handleRemove={handleRemove}
          />
        );
      })
    )}

    {cart.length === 0 ? "" : <TotalCart/>}           
    </>
  );
};
