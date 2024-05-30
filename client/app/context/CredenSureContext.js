import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Provider, Wallet } from 'zksync-ethers';
import { ABI, ADDRESS}  from '../constants/index'

const CredenSureContext = createContext();
const private_key = process.env.WALLET_PRIVATE_KEY

export const CredenSureProvider = ({ children }) => {
    const [wallet, setWallet] = useState(null);
    const [zkProvider, setZkProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [sessionKey, setSessionKey] = useState(null);

    useEffect(() => {
        const init = async () => {
            const zkProvider = new Provider('https://sepolia.era.zksync.dev');
            const wallet = new Wallet(private_key, zkProvider);
            console.log(wallet)
            const contract = new ethers.Contract(ADDRESS, ABI, wallet);
            setZkProvider(zkProvider);
            setWallet(wallet);
            setContract(contract);
        };

        init();
    }, []);

    const createSessionKey = async () => {
        const sessionKeyWallet = ethers.Wallet.createRandom();
        const sessionKey = {
            address: sessionKeyWallet.address,
            privateKey: sessionKeyWallet.privateKey
        };
        setSessionKey(sessionKey);
        return sessionKey;
    };

    const signMetaTxRequest = async (signer, sessionKey, tx) => {
        const signature = await sessionKey.signMessage(ethers.utils.arrayify(tx.hash));
        return {
            tx,
            signature
        };
    };

    const issueCredential = async (recipient, data) => {
        if (contract && sessionKey) {
            const tx = await contract.populateTransaction.issueCredential(recipient, data);
            const metaTx = await signMetaTxRequest(wallet, sessionKey, tx);
            const sentTx = await zkProvider.sendTransaction(metaTx);
            await sentTx.wait();
            return sentTx.hash;
        }
    };

    const endorse = async (recipient, message) => {
        if (contract && sessionKey) {
            const tx = await contract.populateTransaction.endorse(recipient, message);
            const metaTx = await signMetaTxRequest(wallet, sessionKey, tx);
            const sentTx = await zkProvider.sendTransaction(metaTx);
            await sentTx.wait();
            return sentTx.hash;
        }
    };

    const fetchCredentials = async (user) => {
        if (contract) {
            return await contract.getCredentials(user);
        }
    };

    const fetchEndorsements = async (user) => {
        if (contract) {
            return await contract.getEndorsements(user);
        }
    };

    return (
        <CredenSureContext.Provider value={{ createSessionKey, issueCredential, endorse, fetchCredentials, fetchEndorsements }}>
            {children}
        </CredenSureContext.Provider>
    );
};

export const useCredenSure = () => useContext(CredenSureContext);
