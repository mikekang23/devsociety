import React, {Fragment, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {setAlert, removeAlert} from '../../actions/alert';
import PropTypes from 'prop-types';

const Register = (props) => {
  const [ formData, setFormData ]= useState(
    {
      name: '',
      email: '',
      password: '',
      password2: ''
    }
  );

  useEffect(() => {
    if(props.alerts.length > 0){
      props.alerts.forEach((item, i) => {
        setTimeout(function(){
          props.removeAlert(item.id)
        }, 3000*(i+1))
      });
    }
  })

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const { name, email, password, password2 } = formData

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('hit it!')
    if (password !== password2){
      props.setAlert('The passwords do not match', 'danger')
    }else{
      console.log('success')

      // // This is the non-redux version
      // const newUser = {
      //   name,
      //   email,
      //   password
      // }
      //
      // try {
      //   const config = {
      //     headers: {
      //       'Content-Type': 'application/json'
      //     }
      //   }
      //
      //   const body = JSON.stringify(newUser);
      //   const res = await axios.post('/api/users', body, config);
      //   console.log(res.data);
      // } catch(err) {
      //   console.log(err.message);
      // }
    }

  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            required
            value={name}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}

          />
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={password2}
            onChange={(e) => onChange(e)}

          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  )
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  alerts: state.alert
})

export default connect(mapStateToProps, { setAlert, removeAlert })(Register);
