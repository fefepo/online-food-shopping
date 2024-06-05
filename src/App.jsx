import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import { TopNavigationBar } from "./components/header/topNavigationBar/topNavigationBar";
import Home from "./pages/home";
import Product from "./pages/product";
import Basket from "./pages/basket";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyPage from "./pages/MyPage";
import AdminPage from "./pages/AdminPage";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [authState, setAuthState] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const convertPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const logout = async () => {
    try {
      await signOut(auth); 
      setAuthState(false);
      alert("로그아웃 되었습니다."); 
    } catch (error) {
      console.error("Error signing out: ", error);
      alert("로그아웃 실패: " + error.message); 
    }
  };

  return (
    <BrowserRouter>
      <TopNavigationBar cart={cart} isAuthenticated={authState} logout={logout} isAdmin={isAdmin} />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              convertPrice={convertPrice}
              products={products}
              setProducts={setProducts}
            />
          }
        />
        <Route
          path="/product/:id"
          element={
            <Product
              convertPrice={convertPrice}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/cart"
          element={
            authState ? ( 
              <Basket cart={cart} setCart={setCart} convertPrice={convertPrice} />
            ) : (
              <Navigate to="/login" /> 
            )
          }
        />
        <Route path="/login" element={<Login setAuth={setAuthState} setIsAdmin={setIsAdmin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;