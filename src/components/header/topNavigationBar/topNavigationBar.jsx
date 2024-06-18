import styles from "./topNavigationBar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";

export const TopNavigationBar = ({ cart, isAuthenticated, logout, isAdmin }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/">
          <h1 className={styles.logo}>
            <img src="/images/logo.jpeg" alt="logo" />
          </h1>
        </Link>
        <div className={styles.input_wrap}>
          <input
            type="text"
            placeholder="상품 또는 음식을 검색해보세요!"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearch}
          />
          <img
            src="/images/icon-search.svg"
            alt="search"
            onClick={() => navigate(`/search?query=${searchTerm}`)}
          />
        </div>
        <Link to="/categories" className={styles.categoryLink}>
          <button className={styles.drawerButton}>
            <img src="/images/category.png" alt="category" />
            카테고리
          </button>
        </Link>
      </div>

      <div className={styles.menu}>
        <Link to="/wishlist"> 
          <div className={styles.shopping_cart}>
            <FavoriteIcon />
            <span>찜</span>
          </div>
        </Link>
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
          isAdmin ? (
            <>
              <Link to="/admin">
                <div className={styles.mypage}>
                  <img src="/images/icon-user.svg" alt="user" />
                  <span>관리자</span>
                </div>
              </Link>
              <button onClick={handleLogout} className={styles.logoutButton}>
                <img src="/images/icon-logout.svg" alt="logout" className={styles.logoutIcon} />
                <span>로그아웃</span>
              </button>
            </>
          ) : (
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
          )
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
