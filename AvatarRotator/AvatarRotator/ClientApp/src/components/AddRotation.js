import React, { Component } from 'react';
import { Form, Input, FormGroup, Button, Container, NavItem, NavLink, ButtonGroup } from 'reactstrap';

export class AddRotation extends Component { 

    constructor(props) {
        super(props);
        this.state = {
            isCreationMode: false,
            newRotationName: "",
            isNewRotationNameInvalid: false
        };

        this.toggleMode = this.toggleMode.bind(this);
        this.updateNewRotationName = this.updateNewRotationName.bind(this);
        this.validateName = this.validateName.bind(this);
        this.addRotation = this.addRotation.bind(this);
        this.blurToggle = this.blurToggle.bind(this);
    }

    render () {
        let control;
        if (this.state.isCreationMode) {
            control = 
                <NavLink> 
                    <ButtonGroup>
                        <Input type="text" invalid={this.state.isNewRotationNameInvalid} onChange={this.updateNewRotationName} autoFocus/>                    
                        <Button onClick={this.validateName} id="rotationAdd"><i className="fas fa-plus-circle"></i></Button>
                        <Button onClick={this.toggleMode} id="rotationAddCancel"><i className="fas fa-minus-circle"></i></Button>
                    </ButtonGroup>
                </NavLink>
        } else {
            control =             
                <NavItem>
                    <NavLink onClick={this.toggleMode}><i className="fas fa-plus-circle"></i></NavLink>
                </NavItem>
        }

        return (
            control
        );
    }

    blurToggle(event) {
        console.log(event.target);
        if (event.target.id == "rotationAdd" || event.target.id == "rotationAddCancel") {
            return;
         }
         this.toggleMode();
    }

    toggleMode() {
        this.setState({
            isCreationMode: !this.state.isCreationMode
        });
    }

    updateNewRotationName(event) {
        this.setState({
            newRotationName: event.target.value
        });
    }

    validateName(event) {
        if (this.state.newRotationName) {
            this.setState({
                isNewRotationNameInvalid: false
            })
            this.addRotation(this.state.newRotationName)
        } else {
            this.setState({
                isNewRotationNameInvalid: true
            });
        }
    }

    addRotation(rotationName) {
        fetch(this.props.baseUrl+'api/rotations', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+ this.props.authenticationToken
            },
            body: JSON.stringify({
                "Name": rotationName
            })
        })
        .then(
            response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return null;
                }
            }
        ).then(data => {
            if (data)
            {
                this.props.rotationAdded(data);
                this.toggleMode();
            }
        });
    }
}