import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]); // Ensure default value is an array
  const token = localStorage.getItem("token");
  useEffect(() => {fetchOrders()}, []);

  const fetchOrders = async () => {
    const res =await axios.get("http://127.0.0.1:8000/api/orders/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(res.data.results)
    console.log("data", res.data);
  };

  return (
    <div>
      <h2>Your Order History</h2>
      {orders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id}>
            <h4>
              {order.product_name} - ${order.product_price}
            </h4>
            <img src={order.images} alt={order.name} width={100}/>
            <p>Quantity: {order.quantity}</p>
            <p>Price per Item: {order.product_price}</p>
            <p>Total: ${order.total_price}</p>
             <p><strong>Ordered At:</strong> {order.order_time}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
