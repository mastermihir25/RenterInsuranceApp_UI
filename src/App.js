import React, { useState } from "react";
import ItemList from "./components/ItemList";
import "./styles/index.css";

const App = () => {
  const [items, setItems] = useState([]);

  const handleAddItem = (item) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  const handleDeleteItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div className="container">
      <ItemList items={items} onDeleteItem={handleDeleteItem} />
    </div>
  );
};

export default App;
