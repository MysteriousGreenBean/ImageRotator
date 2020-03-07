import React, { Component } from 'react';
import { Form, Input, FormGroup, Button, Container } from 'reactstrap';
import { RotationSets } from './RotationSets';
import { AddRotation } from './AddRotation';
import { RotationImages } from './RotationImages';


export class AvatarRotator extends Component { 

    constructor(props) {
        super(props);
        this.state = {
            rotation: null
        };
        this.rotationChanged = this.rotationChanged.bind(this);
    }

    render () {
        let imagesRender;
        if (this.state.rotation) {
            imagesRender = <RotationImages baseUrl={this.props.baseUrl} rotationId={this.state.rotation.id} authenticationToken={this.props.authenticationToken} />;
        } else {
            imagesRender = "";
        }
        return (
            <Container>
                <RotationSets baseUrl={this.props.baseUrl} authenticationToken={this.props.authenticationToken} rotationChanged={this.rotationChanged} />
                {imagesRender}
            </Container>
        );
    }

    rotationChanged(newRotation) {
        this.setState({
            rotation: newRotation
        });
    }
}