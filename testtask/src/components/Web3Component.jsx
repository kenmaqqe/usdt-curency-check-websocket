import React, { useState, useEffect } from "react";
import { BrowserProvider, formatEther } from "ethers";

const Web3Component = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  const connectMetamask = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);

        const provider = new BrowserProvider(window.ethereum);
        const balanceInWei = await provider.getBalance(accounts[0]);
        const balanceInEth = formatEther(balanceInWei);
        setBalance(balanceInEth);
      } else {
        setError("Будь ласка, встановіть Metamask");
      }
    } catch (err) {
      setError(`Помилка підключення: ${err.message}`);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]);
        connectMetamask();
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <div className="container">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!account ? (
        <div className="web3">
          <button onClick={connectMetamask} className="AddButton">Підключити Metamask</button>
        </div>
      ) : (
        <div className="web3">
          <div className="balance-display">
            Баланс: {balance ? `${balance} ETH` : "Завантаження..."}
          </div>
        </div>
      )}
    </div>
  );
};

export default Web3Component;
