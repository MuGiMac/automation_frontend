import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import MenuPage from './components/Menus/MenuPage';
import CpuMemory from './components/CpuMemory/CpuMemory';
import ServerDetails from './components/ServerDetails/ServerDetails';
import DriveSpace from './components/DriveSpace/DriveSpace';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <Router basename="/automation_frontend">
      <Routes>
        <Route
          path="/"
          element={
            loggedIn ? <Navigate to="/menu" /> : <Login onLogin={() => setLoggedIn(true)} />
          }
        />
        <Route
          path="/menu"
          element={loggedIn ? <MenuPage /> : <Navigate to="/" />}
        />
        <Route
          path="/cpumemory"
          element={loggedIn ? <CpuMemory /> : <Navigate to="/" />}
        />
        <Route
          path="/serverdetails"
          element={loggedIn ? <ServerDetails /> : <Navigate to="/" />}
        />
        <Route
          path="/drivespace"
          element={loggedIn ? <DriveSpace /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
