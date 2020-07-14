import React, {useState} from 'react';
import {Navbar, Container, Row, Col} from "react-bootstrap";

import ChartWrapper from './ChartWrapper'
import GenderDropdown from "./GenderDropdown";

function App() {
    const [gender, setGender] = useState('men')

  return (
    <div className="App">
        <Navbar bg="light">
            <Navbar.Brand>D3 Barchart</Navbar.Brand>
        </Navbar>
        <Container>
            <Row>
                <Col xs={12}>
                    <GenderDropdown genderSelected={setGender}/>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <ChartWrapper gender={gender}/>
                </Col>
            </Row>
        </Container>
    </div>
  );
}

export default App;
