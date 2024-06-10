import React, { useEffect, useState } from "react";
import { getOrders } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
//d
const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        const ordersData = await getOrders(user.uid);
        setOrders(ordersData);
      }
    };

    fetchOrders();
  }, [user]);

  const calculateTotalQuantity = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div>
      <h1>Order History</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <h2>Order ID: {order.id}</h2>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  <p>Product Name: {item.productName}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: {item.price}</p>
                </li>
              ))}
            </ul>
            <p>Total Quantity: {calculateTotalQuantity(order.items)}</p>
            <p>Total Price: {calculateTotalPrice(order.items)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderHistory;