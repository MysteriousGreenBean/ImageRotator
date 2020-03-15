import React, { Component } from 'react';
import { Input, Container,  Card, CardImg, CardBody } from 'reactstrap';
import './AddImage.css';

export class AddImage extends Component { 

    constructor(props) {
        super(props);
        this.state = {
            link: "",
            linkInvalid: false
        };

        this.linkChanged = this.linkChanged.bind(this);
        this.addLink = this.addLink.bind(this);
    }

    render () {
        return (
            <Container className="cardContainer">
                <Card className="card">
                    <CardImg id="test" className="addImageButton button" onClick={this.addLink} src="https://i.imgur.com/USdndK4.png"></CardImg>
                    <CardBody>
                        <Input type="text" className="textInput" placeholder="Link do obrazka" invalid={this.state.linkInvalid} onChange={this.linkChanged}/>
                    </CardBody>
                </Card>
            </Container>
        );
    }

    linkChanged(event) {
        this.setState({
            link: event.target.value
        });
    }

    addLink() {
        if (!this.state.link)
        {
            this.setState({
               linkInvalid: true 
            });
        } else {
            this.addLinkToDatabase(this.state.link);
        }
    }

    addLinkToDatabase(link) {
        fetch(this.props.baseUrl+'api/rotations/'+this.props.rotationId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+ this.props.authenticationToken
            },
            body: JSON.stringify({
                "Link": link
            })
        })
        .then(
            response => {
                if (response.ok) {
                    return response.json();
                } else {
                    this.setState({
                        linkInvalid: true 
                     });
                }
            }
        ).then(data => {
            this.imageAdded(data);
        });
    }

    imageAdded(image) {
        this.props.imageAdded(image);
    }
}