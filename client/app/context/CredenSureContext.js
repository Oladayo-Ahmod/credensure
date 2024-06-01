"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserProvider, Provider, Wallet,Contract,utils,types } from 'zksync-ethers';
import { ABI, ADDRESS}  from '../constants/index'

const CredenSureContext = createContext();
const private_key = process.env.PRIVATE_KEY

let connect
if(typeof window !=='undefined'){
    connect = window.ethereum
}

export const CredenSureProvider = ({ children }) => {
    const [wallet, setWallet] = useState(null);
    const [zkProvider, setZkProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [sessionKey, setSessionKey] = useState(null);

    useEffect(() => {
        const init = async () => {
            // const provider = new BrowserProvider()
            const zkProvider = new Provider('https://sepolia.era.zksync.dev');
            // const wallet = new Wallet(private_key, zkProvider);

            const provider = Provider.getDefaultProvider(types.Network.Sepolia);
            const ethProvider = ethers.getDefaultProvider("sepolia");
            const wallet = new Wallet(private_key, provider, ethProvider);
            const contract = new Contract(ADDRESS, ABI, wallet);



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

    const signMetaTxRequest = async (sessionKey,tx) => {
        const signedTx = await wallet.signTransaction({
            type: utils.EIP712_TX_TYPE,
            to: tx.to,
            value: tx.value.toString(), // Ensure value is a string
            gasLimit: tx.gasLimit.toString(), // Ensure gasLimit is a string
            data: tx.data,
            chainId: tx.chainId,
            nonce: tx.nonce,
            maxPriorityFeePerGas: tx.maxPriorityFeePerGas.toString(), // Ensure maxPriorityFeePerGas is a string
            maxFeePerGas: tx.maxFeePerGas.toString(), 
          });

        return {
            tx,
            signedTx
        };
    };


    const issueCredential = async (recipient, data) => {
        if (contract && sessionKey) {
            const tx = await contract.issueCredential(recipient, data);
            await signMetaTxRequest(sessionKey, tx);
            // console.log(metaTx)
            // const sentTx = await wallet.sendTransaction(metaTx.signedTx);
            // await sentTx.wait();
            // return sentTx.hash;
        }
        throw new Error("Contract or session key not initialized");
    };

    const endorse = async (recipient, message) => {
        if (contract && sessionKey) {
            const tx = await contract.endorse(recipient, message);
            await signMetaTxRequest(sessionKey, tx);
            // const sentTx = await zkProvider.sendTransaction(metaTx);
            // await sentTx.wait();
            // return sentTx.hash;
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
