import React, { Component } from 'react';
import { Form, Input, FormGroup, Button, Container } from 'reactstrap';
import './Login.css';

export class Login extends Component {
    static displayName = "Login";

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            loginDisabled: true,
            invalidData: false
        };
        this.usernameChanged = this.usernameChanged.bind(this);
        this.passwordChanged = this.passwordChanged.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
    }

    render () {
        return (
        <Container className="loginContainer">
            <Form>
                <FormGroup>
                    <Input 
                        type="text" 
                        id="username"
                        className="textInput" 
                        placeholder="Mortisowa nazwa użytkownika" 
                        onChange={this.usernameChanged} 
                        invalid={this.state.invalidData}
                        onKeyPress={this.keyPressed}
                        />
                </FormGroup>
                <FormGroup>
                    <Input 
                        type="password" 
                        id="password" 
                        className="textInput" 
                        placeholder="Mortisowe hasło" 
                        onChange={this.passwordChanged} 
                        invalid={this.state.invalidData}
                        onKeyPress={this.keyPressed}
                        />
                </FormGroup>
                <Button 
                    className="button"
                    disabled={this.state.loginDisabled} 
                    onClick={this.validate.bind(this)}>Zaloguj</Button>
            </Form>
        </Container>
        );
    }

    usernameChanged(event) {
        this.setState({
            username: event.target.value
        });
        this.formValueChanged();
    }

    passwordChanged(event) {
        this.setState({
            password: event.target.value
        });
        this.formValueChanged();
    }

    formValueChanged() {
        this.setState({
            loginDisabled: !this.state.username || !this.state.password
        })
    }

    validate() {
        fetch(this.props.baseUrl+'api/authentication/authenticate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "Username": this.state.username,
                "Password": this.state.password
            })
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
            this.logIn(data.id, data.username, data.token);
        });
    }

    logIn(userId, username, token) {
        this.props.logIn(userId, username, token);
    }

    keyPressed(e) {
        if (e.key === "Enter") {
            this.validate();
        }
    }
}
