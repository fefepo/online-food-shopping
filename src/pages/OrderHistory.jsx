import React, { useEffect, useState } from "react";
import { getOrders } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import styles from "./orderHistory.module.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [user] = useAuthState(auth);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        const ordersData = await getOrders(user.uid);
        const sortedOrders = ordersData.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sortedOrders);
      }
    };

    fetchOrders();
  }, [user]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const filteredOrders = selectedDate
    ? orders.filter((order) =>
        new Date(order.orderDate).toLocaleDateString() ===
        new Date(selectedDate).toLocaleDateString()
      )
    : orders;

  return (
    <div className={styles.container}>
      <h1>구매 내역</h1>
      <div className={styles.dateFilter}>

        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
      {filteredOrders.length === 0 ? (
        <p className={styles.noOrders}>
          {selectedDate ? "해당 날짜에 구매 내역이 없습니다." : "구매 내역이 없습니다."}
        </p>
      ) : (
        <div className={styles.ordersGrid}>
          {filteredOrders.map((order) => (
            <div key={order.id} className={styles.orderItem}>
              <img
                src={order.productImage}
                alt={order.productName}
                className={styles.productImage}
              />
              <p className={styles.productName}>{order.productName}</p>
              <p>구매 개수: {order.quantity}</p>
              <p>결제 금액: {order.totalAmount}원</p>
              <p>
                구매 날짜: {new Date(order.orderDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
