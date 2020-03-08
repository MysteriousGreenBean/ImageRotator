import React, { Component } from 'react';
import { Form, Input, FormGroup, Button, Container, ButtonGroup, Card, CardImg,
     Modal, ModalHeader, ModalBody, ModalFooter, CardBody, CardTitle, CardText } from 'reactstrap';
import './RotationImage.css';
import { RemoveImage } from './RemoveImage';

export class RotationImage extends Component { 

    constructor(props) {
        super(props);
        this.state = {
            image: props.image,
            modal: false,
            isRemoved: false
        };

        this.toggle = this.toggle.bind(this);
        this.imageRemoved = this.imageRemoved.bind(this);
    }

    render () {
        return (
            <Container className="cardContainer">
                <Card className="card">
                    <CardImg src={this.state.image.link} alt={this.state.image.link} onClick={this.toggle}/>
                    <CardBody>
                        <Input type="text" value={this.state.image.link} readOnly />
                        <RemoveImage imageRemoved={this.imageRemoved} image={this.state.image} baseUrl={this.props.baseUrl} authenticationToken={this.props.authenticationToken}  />
                    </CardBody>
                </Card>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className="imageModal">
                    <ModalHeader toggle={this.toggle}>Tu byndzie link</ModalHeader>
                    <ModalBody>
                        <img src={this.state.image.link} />
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

    imageRemoved(image) {
        this.props.imageRemoved(image);
    }
}