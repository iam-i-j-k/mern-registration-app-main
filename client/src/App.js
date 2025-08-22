import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import WelcomePage from './components/WelcomePage';

function App() {
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const handleRegistrationSuccess = (response) => {
    console.log('Registration successful:', response);
    setRegisteredUsers(prev => [...prev, response.user]);
    alert(`Welcome ${response.user.firstName}! Registration successful.`);
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <header style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '20px 0',
          textAlign: 'center'
        }}>
          <h1>MERN Registration System</h1>
        </header>

        <main style={{ padding: '20px 0' }}>
          <Routes>
            <Route path="/" element={<RegistrationForm onRegistrationSuccess={handleRegistrationSuccess} />} />
            <Route path="/welcome" element={<WelcomePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;