import React, { useState, useContext } from 'react';
import Style from './UsernameModal.module.css';

import pocketbase from '../../app/pocketbase/pocketbase';
import { useWallet } from '@solana/wallet-adapter-react';

// Create a context for the username
const UsernameContext = React.createContext();

export const UsernameProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
};

const UsernameModal = ({handleUsernameSubmit}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async (e) => {

    e.preventDefault();
    await handleUsernameSubmit(inputValue);
    
  };

  return (
    <div className={Style.ModalContainer}>
      <div className={Style.Modal}>
        <h2 className={Style.ModalTitle}>Enter Your Username</h2>
        <form className={Style.Form}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Username"
            required
            className={Style.Input}
          />
          <button onClick={handleSubmit} className={Style.SubmitButton}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default UsernameModal;