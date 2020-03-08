import React, { Component } from 'react';
import { NavLink, orm, Input, FormGroup, Button, Container, ButtonGroup, NavItem } from 'reactstrap';
import { AddRotation } from './AddRotation';


export class RemoveRotation extends Component { 

    constructor(props) {
        super(props);

        this.removeRotation = this.removeRotation.bind(this);
    }

    render () {
        return(
            <Button onClick={this.removeRotation}><i className="fas fa-trash-alt"></i></Button>
        )
    }

    removeRotation() {
        fetch(`${this.props.baseUrl}api/rotations/${this.props.rotation.id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+ this.props.authenticationToken
            }
        })
        .then(
            response => {
                if (response.ok) {
                    this.rotationRemoved();
                }
            }
        );
    }

    rotationRemoved() {
        this.props.rotationRemoved(this.props.rotation);
    }
}