"use client"

import React, { useState } from 'react';
import { useCredenSure } from './context/CredenSureContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Form, Card, ListGroup } from 'react-bootstrap';
import { PlusCircleFill, CheckCircleFill, ArrowRepeat } from 'react-bootstrap-icons';

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
            console.log(credentials);
            setCredentials(credentials);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFetchEndorsements = async () => {
        try {
            const endorsements = await fetchEndorsements(user);
            console.log(endorsements);
            setEndorsements(endorsements);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">CredenSure</h1>
            <Row className="mb-4">
                <Col className="text-center">
                    <Button variant="primary" onClick={handleCreateSessionKey}>
                        Create Session Key <PlusCircleFill className="ms-2" />
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header as="h2">Issue Credential</Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Recipient Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter recipient address"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Credential Data</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter credential data"
                                    value={data}
                                    onChange={(e) => setData(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="success" onClick={handleIssueCredential}>
                                Issue Credential <CheckCircleFill className="ms-2" />
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header as="h2">Endorse</Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Recipient Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter recipient address"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Endorsement Message</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter endorsement message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="warning" onClick={handleEndorse}>
                                Endorse <CheckCircleFill className="ms-2" />
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header as="h2">Fetch Credentials</Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>User Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter user address"
                                    value={user}
                                    onChange={(e) => setUser(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="info" onClick={handleFetchCredentials}>
                                Fetch <ArrowRepeat className="ms-2" />
                            </Button>
                            <ListGroup className="mt-3">
                                {credentials.map((credential, index) => (
                                    <ListGroup.Item key={index}>
                                        Issuer: {credential.issuer}, Data: {credential.data}, Issued At: {new Date(credential.issuedAt * 1000).toLocaleString()}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header as="h2">Fetch Endorsements</Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>User Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter user address"
                                    value={user}
                                    onChange={(e) => setUser(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="info" onClick={handleFetchEndorsements}>
                                Fetch <ArrowRepeat className="ms-2" />
                            </Button>
                            <ListGroup className="mt-3">
                                {endorsements.map((endorsement, index) => (
                                    <ListGroup.Item key={index}>
                                        Endorser: {endorsement.endorser}, Message: {endorsement.message}, Endorsed At: {new Date(endorsement.endorsedAt * 1000).toLocaleString()}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
