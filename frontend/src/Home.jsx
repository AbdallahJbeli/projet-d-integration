import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ isAuthenticated }) => {
      const handleDelete = () => {
    axios.get('http://localhost:8080/logout')
      .then(res => {
        window.location.reload(true);
      }).catch(err => console.log(err));
  }
  return (
    <header className="navbar navbar-dark bg-dark mb-4">
      <div className="container">
        <Link to="/" className="navbar-brand">My App</Link>
        <div>
          {isAuthenticated ? (
            <Link to="/" className="btn btn-danger me-2" onClick={handleDelete}>Logout</Link>
            
          ) : (
            <>
              <Link to="/login" className="btn btn-primary me-2">Sign In</Link>
              <Link to="/register" className="btn btn-success">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-dark text-white">
      <div className="container text-center">
        <p>&copy; 2024 My App</p>
      </div>
    </footer>
  );
};

const Home = () => {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:8080')
      .then(res => {
        console.log(res.data);
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
        } else {
          setAuth(false);
          setName('');
          setMessage(res.data.Error);
        }
      })
      .catch(err => console.error('Error during registration:', err));
  }, [])

  const handleDelete = () => {
    axios.get('http://localhost:8080/logout')
      .then(res => {
        window.location.reload(true);
      }).catch(err => console.log(err));
  }

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Header isAuthenticated={auth} />
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        {
          auth ?
            <div>
              <h3>Welcome back, {name}!</h3>
              <p>You are currently logged in.</p>
              <Link to='/' className='btn btn-danger' onClick={handleDelete}>Logout</Link>
            </div>
            :
            <div>
              <h3>{message}</h3>
              <h3>Login to access your account</h3>
              <div className="mt-3 d-flex justify-content-center">
                <Link to="/login" className='btn btn-primary me-2'>Sign In</Link>
                <Link to="/register" className='btn btn-success'>Sign Up</Link>
              </div>
            </div>
        }
      </div>
      <Footer />
    </div>
  )
}

export default Home;
