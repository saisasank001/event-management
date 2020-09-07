import React, { Component } from "react";
import { PageHeader } from "antd";
import { connect } from "react-redux";
import { Row, Col } from "antd";
import { Typography } from "antd";
import { Input, Tooltip } from "antd";
import { Button } from "antd";
import { Select } from "antd";
import { Card } from "antd";
import { Modal } from 'antd';
import { useHistory } from "react-router-dom";
import { createBrowserHistory } from "history";
import { withRouter } from "react-router-dom";
import { saveSelectedEvent, saveEvents } from "./actions";
import config from './config/config.json';

import {
  InfoCircleOutlined,
  UserOutlined,
  RedEnvelopeOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Result} from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const validateForm = (errors) => {
  let valid = true;
  Object.keys(errors).forEach((val) => {
    console.log(val);
    if (val.indexOf("attendees") > -1) {
      let index =
        val.charAt(val.length - 1)(errors[val + index] != "") &&
        (valid = false);
    } else {
      errors[val] != "" && (valid = false);
    }
  });
  return valid;
};

const checkCharAndSpace = RegExp(/^([a-zA-Z]+\s)*[a-zA-Z]+$/);
const validPhoneRegex = RegExp(
  /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/
);

const validations = {
  attendeeName: ["required", "charWsp"],
  email: ["required", "email"],
  phoneNumber: ["required", "tel"],
};
class BookEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      successModalVisible : false,
      event:{},
      eventId: "",
      errors: {
        attendees:[
          ""
        ]
      },
      attendees: [
        {
          name: "",
        },
      ],
    };
  }

  validateCWsp = (value) => {
    return checkCharAndSpace.test(value);
  };

  validateEmail = (value) => {
    return validEmailRegex.test(value);
  };

  validatePhone = (value) => {
    return validPhoneRegex.test(value);
  };

  componentDidMount = () => {
    this.setState({
      eventId: this.props.eventId
        ? this.props.eventId
        : JSON.parse(sessionStorage.getItem("event"))["eventId"],
        event:JSON.parse(sessionStorage.getItem('event'))
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  
  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state)
    let validForm = true;
    let errorKeys=Object.keys(this.state.errors);
    if(errorKeys.length){
      errorKeys.forEach(element =>{
        if(element!='attendees')
        {
          if(this.state.errors[element]){
          validForm = false;
          this.setState({element:'Please enter '+element})
         } 
        }
      })
    }

    console.log({1:validForm})
    let finalData = this.state;
    
    finalData["createdAt"] = new Date().toISOString();
    finalData["noOfSeats"] = finalData["attendees"].length;
    let elementsToCheck = ["eventId","email","phoneNumber","noOfSeats"];
    elementsToCheck.forEach(element=>{
      if(!finalData[element] || finalData[element]==''){
        validForm  = false;
        finalData['errors'][element]='Please enter '+element;
        this.setState(finalData);
      }
    })

    console.log({2:validForm})

    finalData['attendees'].forEach((attendee,index)=>{
      if(attendee['name']=='' || !attendee['name']==''){
        finalData['errors']['attendees'][index]  = 'Please enter name';
        validForm = false;
        this.setState(finalData);
      }
    })

    console.log({3:validForm})

    console.log(finalData)
    
    if(!validForm){
      this.showModal();
      return;
    }
  
    delete finalData["errors"];
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalData),
    };
    fetch(config.url+"/booking/createBooking", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.setState({'successModalVisible':true});
        
      });
  };

  handleSuccessOk=()=>{
    this.props.history.push("/");
  }

  validateField = (name, value) => {
    let state = this.state;
    state["errors"][name] = "";

    if (value) {
      if (validations[name] && validations[name].indexOf("charWsp") > -1) {
        if (!this.validateCWsp(value)) {
          state["errors"][name] = name + " is invalid";
        }
      }
      if (validations[name] && validations[name].indexOf("email") > -1) {
        if (!this.validateEmail(value)) {
          state["errors"][name] = name + " is invalid";
        }
      }
      if (validations[name] && validations[name].indexOf("tel") > -1) {
        if (!this.validatePhone(value)) {
          state["errors"][name] = name + " is invalid";
        }
      }
    } else {
      state["errors"][name] = name + " is required";
    }

    console.log(state);
    this.setState(state);
  };

  setFormValue = (e) => {
    console.log(e.target.name);
    let form = this.state;
    form[e.target.name] = e.target.value;
    this.setState(form);
  };

  changeFormField = (e) => {
    this.setFormValue(e);
    this.validateField(e.target.name, e.target.value);
  };

  handleChangeSeats = (e) => {
    e = eval(e);
    let stateData = this.state;
    stateData["attendees"].length = 1;
    if (e > 1) {
      for (let i = 0; i < e - 1; i++) {
        stateData["attendees"].push({ name: "" });
        stateData['errors']['attendees'].push('');
      }
    }
    e = {
      target: {
        name: "seats",
        value: e,
      },
    };
    this.setFormValue(e);

    this.setState(stateData);
  };

  changeAttendeeName = (e, index) => {
    let stateData = this.state;
    stateData["attendees"][index] = e.target.value;
    stateData["errors"]["attendees" + index] = "";
    if (e.target.value && !this.validateCWsp(e.target.value)) {
      stateData["errors"]["attendees" + index] =
        "Only letters and spaces are allowed";
    } else if (!e.target.value) {
      stateData["errors"]["attendees"][index] = "Please enter your name";
    }
    this.setState(stateData);
  };

  cancel = () => {
    this.props.history.push("/");
  };

  render() {
    const { errors } = this.state;
    return (
      <div className="page">
        <div className="header">
          <Title level={1}>{this.state.event.eventName}</Title>
          <Title level={4}>Number of Seats Available : {this.state.event.seatsAvailable}</Title>
        </div>
        <div className={"event-card"}>
          <Row>
            <Col xs={24} sm={24} md={8} lg={8} xl={8} className={"left-panel"}>
              <Card className="event-image-card">
                <img
                  className="round-img"
                  src={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTzedXLywa44Gen-fmQKCIJc9uDB2nGlMLG3Q&usqp=CAU"
                  }
                  width="100%"
                />
              </Card>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={16}
              lg={16}
              xl={16}
              className={"right-panel"}
            >
              <div className={"full-width"}>
                <div className={"form-group"}>
                  <label>Name:</label>
                  <div>
                    <Input
                      placeholder="Example"
                      name="attendeeName"
                      onChange={(e) => {
                        this.changeAttendeeName(e, 0);
                      }}
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      suffix={
                        <Tooltip title="Enter your name">
                          <InfoCircleOutlined
                            style={{ color: "rgba(0,0,0,.45)" }}
                          />
                        </Tooltip>
                      }
                    />
                    {
                      this.state.errors['attendees'][0] && 
                      <p class="error-text">Please enter name</p>
                    }
                    
                  </div>
                </div>
                <div className={"form-group"}>
                  <label>Email:</label>
                  <div>
                    <Input
                      placeholder="example@example.com"
                      name="email"
                      onChange={(e) => this.changeFormField(e)}
                      prefix={
                        <RedEnvelopeOutlined className="site-form-item-icon" />
                      }
                      suffix={
                        <Tooltip title="Enter your email address">
                          <InfoCircleOutlined
                            style={{ color: "rgba(0,0,0,.45)" }}
                          />
                        </Tooltip>
                      }
                    />
                   
                    {
                      this.state.errors['email'] && 
                      <p class="error-text">Please enter valid email address</p>
                    }
                  </div>
                </div>
                <div className={"form-group"}>
                  <label>Phone No:</label>
                  <div>
                    <Input
                      placeholder="9xxxxxxxx"
                      name="phoneNumber"
                      onChange={(e) => this.changeFormField(e)}
                      prefix={<PhoneOutlined className="site-form-item-icon" />}
                      suffix={
                        <Tooltip title="Enter your phone number">
                          <InfoCircleOutlined
                            style={{ color: "rgba(0,0,0,.45)" }}
                          />
                        </Tooltip>
                      }
                    />
                     {
                      this.state.errors['phoneNumber'] && 
                      <p class="error-text">Please enter valid phone number</p>
                    }
                  </div>
                </div>
                <div className={"form-group"}>
                  <label>Number of seats:</label>
                  <div>
                    <Select
                      defaultValue="1"
                      style={{ width: "100%" }}
                      onChange={this.handleChangeSeats}
                    >
                      <Option value="1">1 Seat</Option>
                      <Option value="2">2 Seats</Option>
                      <Option value="3">3 Seats</Option>
                      <Option value="4">4 Seats</Option>
                      <Option value="5">5 Seats</Option>
                      <Option value="6">6 Seats</Option>
                    </Select>
                  </div>
                </div>
               
                {
                  this.state.attendees.length > this.state.event.seatsAvailable && 
                  <p className="error-text">Number of seats selected is more than available seats</p>
                }

                {
                !(this.state.attendees.length > this.state.event.seatsAvailable) &&
                this.state.attendees.slice(1).map((attendee, index) => {
                  return (
                    <div className={"form-group"} key={index}>
                      <label>Name of Attendee {index + 2}:</label>
                      <div>
                        <Input
                          placeholder="Example Name"
                          prefix={
                            <UserOutlined className="site-form-item-icon" />
                          }
                          onChange={(e) => {
                            this.changeAttendeeName(e, index + 1);
                          }}
                          suffix={
                            <Tooltip title="Enter your other attendee name">
                              <InfoCircleOutlined
                                style={{ color: "rgba(0,0,0,.45)" }}
                              />
                            </Tooltip>
                          }
                        />
                         {
                      this.state.errors['attendees'][index+1] && 
                      <p class="error-text">Please enter name</p>
                    }
                      </div>
                    </div>
                  );
                })}
                <div className={"form-group flex-right button-panel"}>
                  <Button type="danger" onClick={this.cancel}>
                    Cancel
                  </Button>
                  <Button type="primary" onClick={(e) => this.handleSubmit(e)}>
                    Book Now
                  </Button>
                 
                    <Modal
                      title="Error"
                      visible={this.state.visible}
                      onOk={this.handleOk}
                      onCancel={this.handleCancel}
                    >
                      <Result
                status="error"
                title="Submission Failed"
                subTitle="Please check given inputs and modify the following information before resubmitting."
              ></Result>
                    </Modal>
                    
                    <Modal
                      title="Success"
                      visible={this.state.successModalVisible}
                      onOk={this.handleSuccessOk}
                      onCancel={this.handleSuccessOk}
                    >
                      <Result
    status="success"
    title="Successfully Booked Seats!"
    subTitle={"Your seats are booked with "+this.state.noOfSeats+" seats"}
    
  />
                    </Modal>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    eventId: state.eventId,
  };
};

export default withRouter(
  connect(mapStateToProps, { saveSelectedEvent, saveEvents })(BookEvent)
);
