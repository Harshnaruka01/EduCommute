import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css'; // Assuming you'll create this for the new styles
import { toast} from 'react-toastify';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading when the form is submitted
  
    let apiUrl = '';
    if (role === 'student') {
      apiUrl = 'http://localhost:5000/api/login/Student';
    } else if (role === 'institute') {
      apiUrl = 'http://localhost:5000/api/login/Institute';
    } else if (role === 'driver') {
      apiUrl = 'http://localhost:5000/api/login/Driver';
    }
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        if (result.message === 'Incorrect Password.') {
          toast.error('Incorrect password. Please try again.');
        } else if (result.message === 'User not registered') {
          toast.error('This email is not registered. Please sign up first.');
        } else {
          toast.error(result.message || 'Incorrect Password or Email.');
        }
        setLoading(false); // Stop loading after handling errors
        return;
      }
  
      if (result.success) {
        if (role === 'student') {
          navigate('/student/interface');
        } else if (role === 'institute') {
          navigate('/institute/interface');
        } else if (role === 'driver') {
          navigate('/Driver/StartRouteButton');
        }
      } else {
        toast.error(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An error occurred. Please try again later.');
    }
  
    setLoading(false); // Stop loading after login attempt
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

            <button className="login-button" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
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
