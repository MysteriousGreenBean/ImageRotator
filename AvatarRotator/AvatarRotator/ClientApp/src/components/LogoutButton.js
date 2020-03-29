import React, { Component } from 'react';
import { Button } from 'reactstrap'
import Cookies from 'universal-cookie';
import './LogoutButton.css';

export class LogoutButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
    }

    render () {
        return (
            <Button className="logoutButton button" onClick={() => this.logOut()}><i className="fas fa-sign-out-alt"></i> Wyloguj</Button>
        );
    }

    logOut() {
        const cookies = new Cookies();
        cookies.remove('userId');
        cookies.remove('username');
        cookies.remove('token');
        cookies.remove('loggedIn');
        this.props.onLogOut();
    }
}