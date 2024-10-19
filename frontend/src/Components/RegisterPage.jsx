import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './RegisterPage.css'; // Assuming you'll create this for the new styles

function RegisterPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); 
  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role:', role);

    if (role === 'student') {
      navigate('/student/interface');
    } else if (role === 'institute') {
      navigate('/institute/interface');
    } else if (role === 'driver') {
      navigate('/driver/StartRouteButton');
    }
  };
  return (
    <div className="home-container">

      <div className="right-section">
        <div className="login-container">
          <h2>LOGIN</h2>
          <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          className="login-input"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="login-input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="student">Student</option>
          <option value="institute">Institute</option>
          <option value="driver">Driver</option>
        </select><br />

        <button className="login-button" type="submit">Login</button>
      </form>
          <p>Don't have an account?</p>
          <div className="register-buttons">
            <Link to="/register/student" className="register-btn">Register as students</Link>
            <Link to="/register/institute" className="register-btn">Register as Institute</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
