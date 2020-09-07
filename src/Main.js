import React, { Component } from "react";
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";
import EventList from './EventList';
import BookEvent from './BookEvent';

class Main extends React.Component {

    render(){
        return <Router>
          <Switch>
        <Route exact path="/event-list">
          <EventList/>
        </Route>
        <Route exact path="/book-event/:id">
          <BookEvent />
        </Route>
        <Route exact path="/">
          <EventList />
        </Route>
      </Switch>
      </Router> 
    }
}

export default Main;
