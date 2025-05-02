import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BuyProduct from "./BuyProduct";
import axios from "axios";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  // console.log('data',products);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
};
    useEffect(() => {
      fetchProducts();
    }, []);

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/products/published/"
        );
        setProducts(res.data);
        // console.log("data", res.data);
      } catch (error) {
        console.log(error);
      }
    };
  

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <div>
          <p>Welcome, <b>{user.username}</b>!</p>
          <p>Email: {user.email}</p>
          <Link to='/orderslist' >check orders</Link>
          <hr />
          <div className="container">
          {products.map((product) => (
            <div key={product.id} className="containerProducts">
              <BuyProduct product={product} token={token} fetchProducts={fetchProducts} />
            </div>
          ))}
          </div>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Please login.</p>
      )}
    </div>
  );
};

export default Dashboard;
