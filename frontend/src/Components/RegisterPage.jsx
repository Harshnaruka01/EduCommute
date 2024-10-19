import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css'; // Assuming you'll create this for the new styles

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Determine the API route based on the selected role
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

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Login failed. Please try again.');
        setLoading(false);
        return;
      }

      const result = await response.json();
      console.log('API Result:', result); // Log the API result
      console.log('Selected role:', role); // Log selected role

      if (result.success) {
        // Redirect based on role after successful login
        if (role === 'student') {
          navigate('/student/interface');
        } else if (role === 'institute') {
          navigate('/institute/interface');
        } else if (role === 'driver') {
          navigate('/Driver/StartRouteButton');
        }
      } else {
        alert(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again later.');
    }

    setLoading(false);
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
