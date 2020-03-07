import React, { Component } from 'react';
import { Form, Input, FormGroup, Button, Container, ButtonGroup, Card, CardImg,
     Modal, ModalHeader, ModalBody, ModalFooter, CardBody, CardTitle, CardText } from 'reactstrap';
import './RotationImage.css';

export class RotationImage extends Component { 

    constructor(props) {
        super(props);
        this.state = {
            imageLink: props.imageLink,
            modal: false
        };

        this.toggle = this.toggle.bind(this);
    }

    render () {
        return (
            <Container className="cardContainer">
                <Card className="card">
                    <CardImg src={this.state.imageLink} alt={this.state.imageLink} onClick={this.toggle}/>
                    <CardBody>
                        <Input type="text" value={this.state.imageLink} readOnly />
                    </CardBody>
                </Card>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className="imageModal">
                    <ModalHeader toggle={this.toggle}>Tu byndzie link</ModalHeader>
                    <ModalBody>
                        <img src={this.state.imageLink} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        );
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
}