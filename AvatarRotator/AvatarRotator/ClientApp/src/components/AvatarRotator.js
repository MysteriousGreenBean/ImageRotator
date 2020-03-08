import React, { Component } from 'react';
import { Nav, Form, Input, FormGroup, Button, Container, NavItem, NavLink, TabContent, TabPane, Label, Jumbotron, ToastHeader, ToastBody } from 'reactstrap';
import { RotationSetTab } from './RotationSetTab';
import { AddRotation } from './AddRotation';
import { RotationImages } from './RotationImages';


export class AvatarRotator extends Component { 

    constructor(props) {
        super(props);
        this.state = {
            rotations: [],
            activeRotation: '0'
        };
        this.getUserRotationSets();

        this.rotationChanged = this.rotationChanged.bind(this);
        this.rotationAdded = this.rotationAdded.bind(this);
        this.rotationRemoved = this.rotationRemoved.bind(this);
    }

    render () {
        return (
            <Container>
                <Nav tabs>
                    {this.state.rotations.map(item => (
                        <React.Fragment key={item.id}>
                            <RotationSetTab rotation={item} rotationChanged={this.rotationChanged} rotationRemoved={this.rotationRemoved} baseUrl={this.props.baseUrl} authenticationToken={this.props.authenticationToken} />
                        </React.Fragment>
                    ))}
                    <AddRotation baseUrl={this.props.baseUrl} authenticationToken={this.props.authenticationToken}  rotationAdded={this.rotationAdded}/>
                </Nav>
                <TabContent activeTab={this.state.activeRotation}>
                    {this.state.rotations.map(item => (
                        <React.Fragment key={item.id}>
                            <TabPane tabId={item.id.toString()} >
                                <Label>{item.link}</Label>
                            <RotationImages baseUrl={this.props.baseUrl} rotationId={item.id} authenticationToken={this.props.authenticationToken} />
                            </TabPane>
                        </React.Fragment>
                    ))}
                </TabContent>
            </Container>
        );
    }

    rotationRemoved(rotation) {
        let newRotations = this.state.rotations.filter(r => r.id != rotation.id);
        this.setState({
            rotations: newRotations
        });
    }

    rotationChanged(newRotation) {
        this.setState({
            rotation: newRotation,
            activeRotation: newRotation.id.toString()
        });
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
            if (data && data.length > 0) {
                this.setState({
                    rotations: data,
                    activeRotation: data[0].id.toString()
                });
            }
        });
    }

    rotationAdded(rotation) {
        let newRotations = this.state.rotations.slice();
        newRotations.push(rotation);
        this.setState({
            rotations: newRotations
        });
        this.rotationChanged(rotation);
    }
}