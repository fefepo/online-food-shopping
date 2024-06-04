// src/App.js

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { TopNavigationBar } from "./components/header/topNavigationBar/topNavigationBar";
import Home from "./pages/home";
import Product from "./pages/product";
import Basket from "./pages/basket";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyPage from "./pages/MyPage";
//import Orders from "./pages/Orders";
//import Withdrawal from "./pages/Withdrawal";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [auth, setAuth] = useState(false);

  const convertPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <BrowserRouter>
      <TopNavigationBar cart={cart} isAuthenticated={auth} />
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
            <Basket cart={cart} setCart={setCart} convertPrice={convertPrice} />
          }
        />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mypage" element={<MyPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
