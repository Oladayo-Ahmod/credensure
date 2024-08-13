"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserProvider, Provider, Wallet,Contract,utils,types } from 'zksync-ethers';
import { ABI, ADDRESS , PAYMASTER_ADDRESS}  from '../constants/index'

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

     // paymaster params
     const paymasterParams = utils.getPaymasterParams(PAYMASTER_ADDRESS, {
        type: "General",
        innerInput: new Uint8Array(),
      });

    useEffect(() => {
        const init = async () => {
            if(!connect) return
            const provider = new BrowserProvider(connect)
            const zkProvider = new Provider('https://sepolia.era.zksync.dev');

            const signer = await provider.getSigner()
            const contract = new Contract(ADDRESS, ABI, signer);

            setZkProvider(zkProvider);
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
        if (contract) {
            // calculate gas limits
            const gasLimit = await contract.issueCredential
                .estimateGas(recipient,data,{
                customData: {
                gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
                paymasterParams: paymasterParams,
                },
           });
                         
            // execute transaction
            const tx = await contract
                .issueCredential(recipient,data,{
                maxPriorityFeePerGas: ethers.toBigInt(0),
                maxFeePerGas: await zkProvider.getGasPrice(),
                gasLimit,
                customData: {
                gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
                paymasterParams,
                },
          });

          await tx.wait()

        }
    };

    const endorse = async (recipient, message) => {
         // calculate gas limits
        const gasLimit = await contract.endorse
            .estimateGas(recipient,message,{
            customData: {
            gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
            paymasterParams: paymasterParams,
            },
        });

            // execute transaction
            const tx = await contract
            .endorse(recipient,message,{
            maxPriorityFeePerGas: ethers.toBigInt(0),
            maxFeePerGas: await zkProvider.getGasPrice(),
            gasLimit,
            customData: {
            gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
            paymasterParams,
            },
        });

        await tx.wait()
            // await signMetaTxRequest(sessionKey, tx);
            // const sentTx = await zkProvider.sendTransaction(metaTx);
            // await sentTx.wait();
            // return sentTx.hash;
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
