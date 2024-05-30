"use client"

import React, { useState } from 'react';
import { useCredenSure } from './context/CredenSureContext';

const Home = () => {
    const { createSessionKey, issueCredential, endorse, fetchCredentials, fetchEndorsements } = useCredenSure();
    const [recipient, setRecipient] = useState('');
    const [data, setData] = useState('');
    const [message, setMessage] = useState('');
    const [credentials, setCredentials] = useState([]);
    const [endorsements, setEndorsements] = useState([]);
    const [user, setUser] = useState('');

    const handleCreateSessionKey = async () => {
        try {
            const sessionKey = await createSessionKey();
            console.log('Session Key Created:', sessionKey);
        } catch (error) {
            console.error(error);
        }
    };

    const handleIssueCredential = async () => {
        try {
            const txHash = await issueCredential(recipient, data);
            console.log('Credential Issued:', txHash);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEndorse = async () => {
        try {
            const txHash = await endorse(recipient, message);
            console.log('Endorsement Added:', txHash);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFetchCredentials = async () => {
        try {
            const credentials = await fetchCredentials(user);
            setCredentials(credentials);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFetchEndorsements = async () => {
        try {
            const endorsements = await fetchEndorsements(user);
            setEndorsements(endorsements);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>CredenSure</h1>
            <button onClick={handleCreateSessionKey}>Create Session Key</button>
            <div>
                <h2>Issue Credential</h2>
                <input
                    type="text"
                    placeholder="Recipient Address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Credential Data"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                />
                <button onClick={handleIssueCredential}>Issue</button>
            </div>
            <div>
                <h2>Endorse</h2>
                <input
                    type="text"
                    placeholder="Recipient Address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Endorsement Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleEndorse}>Endorse</button>
            </div>
            <div>
                <h2>Fetch Credentials</h2>
                <input
                    type="text"
                    placeholder="User Address"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                />
                <button onClick={handleFetchCredentials}>Fetch</button>
                <ul>
                    {credentials.map((credential, index) => (
                        <li key={index}>
                            Issuer: {credential.issuer}, Data: {credential.data}, Issued At: {new Date(credential.issuedAt * 1000).toLocaleString()}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Fetch Endorsements</h2>
                <input
                    type="text"
                    placeholder="User Address"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                />
                <button onClick={handleFetchEndorsements}>Fetch</button>
                <ul>
                    {endorsements.map((endorsement, index) => (
                        <li key={index}>
                            Endorser: {endorsement.endorser}, Message: {endorsement.message}, Endorsed At: {new Date(endorsement.endorsedAt * 1000).toLocaleString()}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Home;
