import React from 'react';
import './Modal.css'; // Add your styling for the modal

const Modal = ({ toggleModal, headerText, bodyText, buttonText }) => {
  return (
    <div className="modal-overlay poppins-medium">
      <div className="modal-content">
        <h2 style={{color:'#fedc40'}}>{headerText}</h2>
        <p>{bodyText}</p>
        <button className="close-btn" onClick={toggleModal}>{buttonText}</button>
      </div>
    </div>
  );
};

export default Modal;