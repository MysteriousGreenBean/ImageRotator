import React, { Component } from 'react';
import { Form, Input, FormGroup, Button, Container, ButtonGroup } from 'reactstrap';
import { AddRotation } from './AddRotation';


export class RotationSets extends Component { 

    constructor(props) {
        super(props);
        this.state = {
            rotations: [],
            selectedRotation: null
        };
        this.getUserRotationSets();
    }

    render () {
        return (
            <Container>
                <ButtonGroup>
                    {this.state.rotations.map(item => (
                        <React.Fragment key={item.id}>
                            <Button onClick={() => this.rotationChanged(item)}>{item.name}</Button>
                        </React.Fragment>
                    ))}
                    <AddRotation />
                </ButtonGroup>
            </Container>
        );
    }

    getUserRotationSets() {
        fetch(this.props.baseUrl+'api/rotations', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+ this.props.authenticationToken
            }
        })
        .then(
            response => {
                if (response.ok) {
                    return response.json();
                } else {
                    this.setState({
                        invalidData: true
                    });
                    return null;
                }
            }
        ).then(data => {
            this.setState({
                rotations: data,
            });
            this.rotationChanged(data[0]);
        });
    }

    rotationChanged(rotation) {
        this.setState({
            selectedRotation: rotation
        });
        this.props.rotationChanged(rotation);
    }
}