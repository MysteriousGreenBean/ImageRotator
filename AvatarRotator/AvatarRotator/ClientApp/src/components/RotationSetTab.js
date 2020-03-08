import React, { Component } from 'react';
import { NavLink, orm, Input, FormGroup, Button, Container, ButtonGroup, NavItem } from 'reactstrap';
import { AddRotation } from './AddRotation';
import { RemoveRotation } from './RemoveRotation';


export class RotationSetTab extends Component { 

    constructor(props) {
        super(props);

        this.state = {
            editMode: false,
            isNewRotationNameInvalid: false,
            rotationName: this.props.rotation.name,
            rotation: this.props.rotation
        }

        this.rotationRemoved = this.rotationRemoved.bind(this);
        this.rotationChanged = this.rotationChanged.bind(this);
        this.toggleMode = this.toggleMode.bind(this);
        this.updateNewRotationName = this.updateNewRotationName.bind(this);
        this.updateRotationName = this.updateRotationName.bind(this);
    }

    render () {
        let control;
        if (this.state.editMode) {
           control = 
           <NavItem>
                <NavLink> 
                    <ButtonGroup>
                        <Input type="text" invalid={this.state.isNewRotationNameInvalid} onChange={this.updateNewRotationName} defaultValue={this.state.rotation.name}/>                    
                        <Button onClick={this.updateRotationName}><i className="fas fa-save"></i></Button>
                        <RemoveRotation baseUrl={this.props.baseUrl} authenticationToken={this.props.authenticationToken} rotation={this.state.rotation} rotationRemoved={this.rotationRemoved}/>
                        <Button onClick={this.toggleMode}><i className="fas fa-minus-circle"></i></Button>
                    </ButtonGroup>
                </NavLink>
            </NavItem>
        } else {
            control =             
                <NavItem>
                    <NavLink onClick={this.rotationChanged} onDoubleClick={this.toggleMode}>
                            {this.state.rotation.name}
                    </NavLink>
                </NavItem>
        }

        return (
            control
        );
    }

    rotationRemoved(rotation) {
        this.props.rotationRemoved(rotation);
    }

    rotationChanged() {
        this.props.rotationChanged(this.state.rotation);
    }

    toggleMode() {
        this.setState({
            editMode: !this.state.editMode
        });
    }

    updateNewRotationName(event) {
        if (event.target.value) {
            this.setState({
                rotationName: event.target.value,
                isNewRotationNameInvalid: false,
            });
        } else {
            this.setState({
                isNewRotationNameInvalid: true
            });
        }
    }

    updateRotationName() {
        if (this.state.isNewRotationNameInvalid)
            return;

        fetch(`${this.props.baseUrl}api/rotations/${this.state.rotation.id}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+ this.props.authenticationToken
            },
            body: JSON.stringify({
                "Name": this.state.rotationName
            })
        })
        .then(
            response => {
                if (response.ok) {
                    return response.json();
                } else {
                    this.setState({
                        isNewRotationNameInvalid: true
                    });
                    return null;
                }
            }
        ). then(data => {
            if (data) {
                this.setState({
                    rotation: data,
                    isNewRotationNameInvalid: false,
                    editMode: false,
                    rotationName: data.name
                });
            }
               
        });
    }
}