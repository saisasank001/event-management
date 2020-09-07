import React, { Component } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { createBrowserHistory } from "history";
import { withRouter } from "react-router-dom";
import { saveSelectedEvent, saveEvents } from "./actions";
import eventsData from "./data-source/events.json";
import { Input } from "antd";
import { Card } from "antd";
import { Row, Col } from "antd";
import { Button } from "antd";
import config from './config/config.json';

const { Search } = Input;

const history = createBrowserHistory();
class EventList extends React.Component {
  state = {
    events: [],
    searchText:""
  };

  bookEvent = (event) => {
    sessionStorage.setItem("event", JSON.stringify(event));
    this.props.saveSelectedEvent({ eventId: event.eventId });
    this.props.history.push("/book-event/" + event.eventId);
  };

  componentDidMount = () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetch(config.url+"/booking/getBookings", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        data = data.data;
        let events = eventsData;
        events.forEach((item) => {
          item.bookings = 0;
          let filteredData = data.map((fil) => {
            if (fil.eventId == item.eventId) {
              return fil;
            }
          });
          filteredData.forEach((booking) => {
            if (booking) item.bookings += booking.noOfSeats;
          });
          item.seatsAvailable -= item.bookings;
        });
        this.setState({ events });
      });
  };

  search = (value) =>{
    this.setState({searchText:value});
  }

  getResults=()=>{
      let flag=false;
    this.state.events.forEach((event, index) => {
        if(!this.state.searchText || this.state.searchText=='' || (this.state.searchText && event.eventName.indexOf(this.state.searchText)>-1))
        {
            flag=true ;
            return
        }
    });
    console.log({flag})
        return flag;
                            
  }

  render() {
    const { saveSelectedEvent, saveEvents } = this.props;
    return (
      <div className="page text-align-center">
        <div className="header">
          <br />
          <Search
            placeholder="SEARCH EVENTS"
            onSearch={(value) => this.search(value)}
            style={{ width: "50%", marginBottom: 20 }}
          />
          <br />
        </div>
        <br />

        <div>
            {
                !this.getResults() && 
                <h1 class="text-align-center">No results found</h1>
            }
            
          <Row>
            {this.state.events.map((event, index) => {
                
              return (
                    (!this.state.searchText || this.state.searchText=='' || (this.state.searchText && event.eventName.indexOf(this.state.searchText)>-1)) && 
                     // ((this.state.searchText && this.state.searchText.includes(event.eventName)) || !this.state.searchText) && 
                      <>
                      
                       
                      <Col
                        xs={24}
                        sm={24}
                        md={8}
                        lg={6}
                        xl={6}
                        style={{ padding: "10px" }}
                      >
                        <Card
                          size="small"
                          title={event.eventName}
                          style={{ width: "100%" }}
                        >
                          <Row>
                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                              <img src={event.eventLogo} className="full-width" />
                            </Col>
                            <Col
                              xs={24}
                              sm={24}
                              md={16}
                              lg={16}
                              xl={16}
                              className="event-content"
                            >
                              <p>{event.eventDate}</p>
                              <p>Seats Available : {event.seatsAvailable}</p>
                              {event.seatsAvailable == 0 && (
                                <Button type="primary" disabled>
                                  Sold Out
                                </Button>
                              )}
                              {event.seatsAvailable != 0 && (
                                <Button
                                  type="primary"
                                  onClick={(e) => this.bookEvent(event)}
                                >
                                  Book Now
                                </Button>
                              )}
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    </>
                  
                  
              );
            })}
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    counter: state.counter,
  };
};

export default withRouter(
  connect(mapStateToProps, { saveSelectedEvent, saveEvents })(EventList)
);
