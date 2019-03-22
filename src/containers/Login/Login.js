import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import BodyClassName from 'react-body-classname';

export default  class Login extends Component{
  static displayName = 'Login';

  static contextTypes = {
    baseUrl: PropTypes.string.isRequired,
    project: PropTypes.string.isRequired
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      password: "",
      username: "",
    }
    //this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = {
      password: this.state.password,
      username: this.state.username
    };
  }

  render() {
    return (
      <div className='Login'>
        <div className= "login loginSocial">
          <div className = "loginForm">
            <p className = "titleLogin" >Login Material Pagination</p>
            <div className = "formulario">
              <a className="btnLogin" href={this.context.baseUrl + "/auth/facebook/"} id="loginFacebook">
                <div className = "cicleIcon">
                  <img height="42" width="42" className= "imgMain" src={this.context.baseUrl +  "/media/image/icono_fb.png"}  />
                  <img height="42" width="42" className= "imgMainHover" src={this.context.baseUrl +  "/media/image/icono_fb_hover.png"}  />
                </div>
               <p>Con Facebook</p>
              </a>               
              <a className="btnLogin" href={this.context.baseUrl + "/auth/google/"} id="loginGoogle">
                <div className = "cicleIcon">
                  <img height="42" width="42" className= "imgMain" src={this.context.baseUrl +  "/media/image/icono_google.png"}  />
                  <img height="42" width="42" className= "imgMainHover" src={this.context.baseUrl +  "/media/image/icono_google_hover.png"}  />
                </div>
                <p>Con Google</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}