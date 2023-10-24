import React, { useState, useEffect } from "react";
import "./pages.css";
import { Link } from "react-router-dom";

export default function Ktshop() {
  const [showItemsError, setShowItemsError] = useState(false);
  const [items, setItems] = useState([]);

  const showItems = async () => {
    try {
      setShowItemsError(false);
      const res = await fetch("api/item/items");
      const data = await res.json();
      if (data.success === false) {
        setShowItemsError(true);
        return;
      }
      setItems(data);
    } catch (error) {
      setShowItemsError(true);
    }
  };
  useEffect(() => {
    showItems();
  }, []);

  useEffect(() => {
    showItems();
  }, []);

  return (
    <div>
      <h1>KT Shop</h1>
      <div className="items-grid">
        
        {items.map((item) => (
          <Link to={`/view-item/${item._id}`}>
          <div key={item._id} className="item-box">
            <img
              src={item.imageUrls[0]}
              alt="item image"
              className="item-img"
            />
            <p className="item-info" id="name">{item.name}</p>
            <p className="item-info" id="point">{item.point} KTP</p>
          </div>
          </Link>
        ))}

      </div>
    </div>
  );
}
