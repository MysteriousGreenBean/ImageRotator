import React, { Component } from 'react';
import { Button } from 'reactstrap'

export class RemoveImage extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
          image: this.props.image
        };

        this.removeImage = this.removeImage.bind(this);
    }

    render () {
        return (
            <Button onClick={this.removeImage} className="removeImage"><i className="fas fa-trash-alt"></i></Button>
        );
    }

    imageRemoved() {
        this.props.imageRemoved(this.state.image);
    }

    removeImage(link) {
        fetch(`${this.props.baseUrl}api/rotations/${this.state.image.rotationID}?ImageId=${this.state.image.id}`, {
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
                    this.imageRemoved();
                }
            }
        );
    }
}