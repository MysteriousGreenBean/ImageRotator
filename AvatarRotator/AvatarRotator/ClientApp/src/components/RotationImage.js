import React, { Component } from 'react';
import { Input, Container, Card, CardImg, Modal, ModalHeader, ModalBody, ModalFooter, CardBody } from 'reactstrap';
import { RemoveImage } from './RemoveImage';
import './RotationImage.css';

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
                    <CardImg className="rotationImage" src={this.state.image.link} alt={this.state.image.link} onClick={this.toggle}/>
                    <CardBody>
                        <Input className="textInput" type="text" value={this.state.image.link} readOnly />
                        <RemoveImage imageRemoved={this.imageRemoved} image={this.state.image} baseUrl={this.props.baseUrl} authenticationToken={this.props.authenticationToken}  />
                    </CardBody>
                </Card>
                <Modal className="imageModal" size="lg" isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Podgląd obrazka</ModalHeader>
                    <ModalBody>
                        <img className="modalFullImage" src={this.state.image.link} alt="Podgląd obrazka"/>
                    </ModalBody>
                    <ModalFooter>
                        <Input className="textInput" type="text" value={this.state.image.link} readOnly />
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