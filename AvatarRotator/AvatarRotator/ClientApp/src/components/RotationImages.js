import React, { Component } from 'react';
import { Form, Input, FormGroup, Button, Container, ButtonGroup } from 'reactstrap';
import { RotationImage } from './RotationImage';
import { AddImage } from './AddImage';

export class RotationImages extends Component { 

    constructor(props) {
        super(props);
        this.state = {
            images: []
        };
        this.getUserRotationImages();

        this.imageAdded = this.imageAdded.bind(this);
    }

    render () {
        return (
            <Container>
                {this.state.images.map(item => (
                    <React.Fragment key={item.id}>
                        <RotationImage imageLink={item.link}></RotationImage>
                    </React.Fragment>
                ))}
                <AddImage baseUrl={this.props.baseUrl} rotationId={this.props.rotationId} authenticationToken={this.props.authenticationToken} imageAdded={this.imageAdded}/>
            </Container>
        );
    }

    getUserRotationImages() {
        fetch(this.props.baseUrl+'api/rotations/'+this.props.rotationId, {
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
            }
        }
        ).then(data => {
            this.setState({
                images: data
            });
        });
    }

    imageAdded(image) {
        if (!image)
            return;
            
        let newImages = this.state.images.slice();
        newImages.push(image);
        console.log(newImages);
        this.setState({
            images: newImages
        });
    }
}