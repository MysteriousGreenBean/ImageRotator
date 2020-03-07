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
      loggedIn: true,
      username: "Tajemnicza Zielona Fasolka",
      userId: 3,
      authenticationToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjMiLCJuYmYiOjE1ODM1MzExNDIsImV4cCI6MTU4NDEzNTk0MiwiaWF0IjoxNTgzNTMxMTQyfQ.pOuA_hxZIIUk8g03eJ8fkU-XelluchAgPiP2tyGdhlc"
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
