import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Login } from './components/Login';
import { AvatarRotator } from './components/AvatarRotator';

export default class App extends Component {
  static displayName = App.name;

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      username: "",
      userId: -1,
      authenticationToken: ""
    };
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
  }
}
