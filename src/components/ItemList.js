import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { fetchCategories, fetchItems, addItem, deleteItem } from "../services/api"; 
import DialogBox from "./DialogBox"; 

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    value: "",
    category: "",
  });
  const [showDialog, setShowDialog] = useState(false); 
  const [dialogMessage, setDialogMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); 
  const [deleteItemId, setDeleteItemId] = useState(null); 

  // Fetch categories and items on component load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }

      try {
        const fetchedItems = await fetchItems();
        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddItem = async () => {
    const formattedValue = parseFloat(newItem.value).toFixed(2);

    if (!newItem.name || !formattedValue || !newItem.category) {
      setDialogMessage("Please fill in all fields!");
      setShowDialog(true);
      return;
    }

    try {
      const itemToAdd = { ...newItem, value: formattedValue };
      await addItem(itemToAdd); 
      const updatedItems = await fetchItems();
      setItems(updatedItems);  // Refresh the item list
      setNewItem({ name: "", value: "", category: "" }); // Reset form
    } catch (error) {
      setDialogMessage("Error adding item, please try again.");
      setShowDialog(true);
    }
  };

  const handleDeleteItem = (id) => {
    // Show confirmation dialog before actually deleting
    setShowDeleteConfirm(true);
    setDeleteItemId(id);
  };

  const confirmDeleteItem = async () => {
    try {
      await deleteItem(deleteItemId);  
      const updatedItems = await fetchItems();
      setItems(updatedItems);
      setShowDeleteConfirm(false);
    } catch (error) {
      setDialogMessage("Error deleting item, please try again.");
      setShowDialog(true);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false); 
    setDeleteItemId(null); // Clear the ID
  };

  // Group items by category
  const groupedItems = items.reduce((groups, item) => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
    return groups;
  }, {});

  const getTotalValue = (items) => 
    items.reduce((sum, item) => sum + parseFloat(item.value), 0);

  return (
    <div className="container">
      <h1 className="page-title">Renter's Insurance</h1>

      {/* Add Item Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddItem();
        }}
        className="item-form"
      >
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="input-field"
          maxLength="100" 
        />
        <input
          type="number"
          placeholder="Item Value"
          value={newItem.value}
          onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
          className="input-field"
        />
        <select
          value={newItem.category}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          className="select-field"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button type="submit" className="add-item-btn">
          Add Item
        </button>
      </form>

      {/* Item List Display */}
      <div className="item-list-container">
        {Object.keys(groupedItems)
        .sort((a, b) => a.localeCompare(b))
        .map((category) => (
          <div key={category} className="category-section">
            <div className="category-header">
              <h2 className="category-title">{category}</h2>
              <span className="category-total">
                ${getTotalValue(groupedItems[category]).toFixed(2)}
              </span>
            </div>
            <ul className="item-list">
              {groupedItems[category].map((item) => (
                <li key={item.id} className="item">
                  <span className="item-name">{item.name}</span> - 
                  <span className="item-value">${parseFloat(item.value).toFixed(2)}</span>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <FaTrashAlt />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="grand-total">
          <h3>
            Grand Total: ${getTotalValue(items).toFixed(2)}
          </h3>
        </div>
      </div>

      {/* Dialog Box for displaying messages */}
      {showDialog && (
        <DialogBox message={dialogMessage} onClose={() => setShowDialog(false)} />
      )}

      {/* Confirmation dialog for deleting an item */}
      {showDeleteConfirm && (
        <DialogBox 
          message="Are you sure you want to delete this item?"
          onClose={cancelDelete}
          onConfirm={confirmDeleteItem}
          isConfirm={true}
        />
      )}
    </div>
  );
};

export default ItemList;
