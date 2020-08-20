import React, { Fragment, useState } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState(
    {
      email: '',
      password: ''
    }
  )

  const { email, password } = formData;

  const onSubmit = async (e) => {
    e.preventDefault();
    const header = {
      'Content-type': 'application/json'
    }
    const body = {
      email,
      password
    }

    const response = await axios.post('/auth', body, header)
    console.log(response.data)
  }

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }


  return (
    <Fragment>
      <h1 className="large text-primary">Login</h1>
      <p className="lead"><i className="fas fa-user"></i> Login to your account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
          />
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
        <input type="submit" className="btn btn-primary" value="Login" />

        <p className="my-1">Don't have an account? <Link to="/register">Sign Up</Link></p>
      </form>
    </Fragment>
  )
}

export default Login
