import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import MenuPage from './components/Menus/MenuPage';
import CpuMemory from './components/CpuMemory/CpuMemory';
import ServerDetails from './components/ServerDetails/ServerDetails';
import DriveSpace from './components/DriveSpace/DriveSpace';
import Dashboard from './components/Dashboard/Dashboard';
import { getToken } from './components/Services/authServices';

function App() {
  const [loggedIn, setLoggedIn] = useState(() => !!getToken());

  useEffect(() => {
    const checkToken = () => {
      const token = getToken();
      setLoggedIn(!!token);
    };

    checkToken();

    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            loggedIn ? (
              <Navigate to="/menu" />
            ) : (
              <Login onLogin={() => setLoggedIn(true)} />
            )
          }
        />
        <Route
          path="/menu"
          element={loggedIn ? <MenuPage /> : <Navigate to="/" />}
        />
        <Route
          path="/cpumemory"
          element={loggedIn ? <CpuMemory onLogout={() => setLoggedIn(false)} /> : <Navigate to="/" />}
        />
        <Route
          path="/serverdetails"
          element={loggedIn ? <ServerDetails onLogout={() => setLoggedIn(false)} /> : <Navigate to="/" />}
        />
        <Route
          path="/drivespace"
          element={loggedIn ? <DriveSpace /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard"
          element={loggedIn ? <Dashboard onLogout={() => setLoggedIn(false)} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
