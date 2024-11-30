import React from "react";
import "./DialogBox.css"; // Ensure the styles are up to date

const DialogBox = ({ message, onClose, onConfirm, isConfirm }) => {
  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <p>{message}</p>
        <div className="dialog-buttons">
          <button className="dialog-close" onClick={onClose}>
            {isConfirm ? "Cancel" : "Close"}
          </button>
          {isConfirm && (
            <button className="dialog-confirm" onClick={onConfirm}>
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
