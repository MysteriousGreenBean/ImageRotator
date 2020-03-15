import React, { Component } from 'react';
import { Login } from './components/Login';
import { AvatarRotator } from './components/AvatarRotator';
import Cookies from 'universal-cookie';
import './App.css';

export default class App extends Component {
  static displayName = App.name;

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.logIn = this.logIn.bind(this);
  }

  render () {
    if (this.state.loggedIn) {
      return(
        <AvatarRotator baseUrl={this.props.baseUrl} authenticationToken={this.state.authenticationToken} />
      );
    } else {
      return (
        <Login baseUrl={this.props.baseUrl} logIn={this.logIn}/>
      );
    }
  }

  logIn(userId, username, token) {
    this.setState({
      userId: userId,
      username: username,
      authenticationToken: token,
      loggedIn: true
    });
    this.setLogInCookies(userId, username, token);
  }

  setLogInCookies(userId, username, token) {
    const cookies = new Cookies();
    let expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 5);

    cookies.set('userId', userId, { expires: expirationDate });
    cookies.set('username', username, { expires: expirationDate });
    cookies.set('token', token, { expires: expirationDate });
    cookies.set('loggedIn', true, { expires: expirationDate });
  }  

  getInitialState() {
    const cookies = new Cookies();

    let loggedIn = cookies.get('loggedIn');
    if (loggedIn === 'true') {
      return {
        loggedIn: true,
        username: cookies.get('username'),
        userId: cookies.get('userId'),
        authenticationToken: cookies.get('token')
      };
    } else {
      return {
        loggedIn: false,
        username: "",
        userId: -1,
        authenticationToken: ""
      };
    }
  }
}
