import React, { useEffect, useState } from "react";
import { getOrders } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import styles from "./orderHistory.module.css"; 

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        const ordersData = await getOrders(user.uid);
        console.log("Fetched Orders:", ordersData);
        setOrders(ordersData);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className={styles.container}>
      <h1>구매 내역</h1>
      {orders.length === 0 ? (
        <p className={styles.noOrders}>구매 내역이 없습니다.</p>
      ) : (
        <div className={styles.ordersGrid}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderItem}>
              <img src={order.productImage} alt={order.productName} className={styles.productImage} />
              <p className={styles.productName}>{order.productName}</p>
              <p>구매 개수: {order.quantity}</p>
              <p>결제 금액: {order.totalAmount}원</p>
              <p>구매 날짜: {new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
