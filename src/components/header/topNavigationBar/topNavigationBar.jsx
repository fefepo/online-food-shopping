import styles from "./topNavigationBar.module.css";
import { Link, useNavigate } from "react-router-dom";

export const TopNavigationBar = ({ cart, isAuthenticated, logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the passed logout function
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/">
          <h1 className={styles.logo}>
            <img src="/images/logo.png" alt="logo" />
          </h1>
        </Link>
        <div className={styles.input_wrap}>
          <input type="text" placeholder="상품을 검색해보세요!" />
          <img src="/images/icon-search.svg" alt="search" />
        </div>
      </div>

      <div className={styles.menu}>
        <Link to="/cart">
          <div className={styles.shopping_cart}>
            <img src="/images/icon-shopping-cart.svg" alt="cart" />
            <span>장바구니</span>
            {cart.length >= 1 ? (
              <div className={styles.new_shopping_cart}>
                <p>{cart.length}</p>
              </div>
            ) : (
              ""
            )}
          </div>
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/mypage">
              <div className={styles.mypage}>
                <img src="/images/icon-user.svg" alt="user" />
                <span>마이페이지</span>
              </div>
            </Link>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <img src="/images/icon-logout.svg" alt="logout" className={styles.logoutIcon} />
              <span>로그아웃</span>
            </button>
          </>
        ) : (
          <Link to="/login">
            <div className={styles.mypage}>
              <img src="/images/icon-user.svg" alt="user" />
              <span>로그인</span>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
};