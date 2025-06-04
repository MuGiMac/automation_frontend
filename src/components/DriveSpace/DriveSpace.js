import { useEffect, useState } from 'react';
import './DriveSpace.css';
import '../images/logo.png';
import { Link } from 'react-router-dom';

const INTEGRATION_SERVERS = ['MCHP021A', 'MCHP026A', 'MCHP025A'];
const PRODUCTION_SERVERS = ['MCHP029A', 'MCHP028A', 'MCHP027A'];

const MOCK_DRIVE_DATA = [
  {
    serverName: "MCHP021A",
    drives: {
      C: 99.9,
      D: 19.9,
      H: 428,
    },
  },
  {
    serverName: "MCHP026A",
    drives: {
      C: 99.9,
      D: 19.9,
      H: 149,
    },
  },
  {
    serverName: "MCHP025A",
    drives: {
      C: 99.9,
      D: 99.9,
      H: null,
    },
  },
  {
    serverName: "MCHP029A",
    drives: {
      C: 99.9,
      D: 19.9,
      H: 149,
    },
  },
  {
    serverName: "MCHP028A",
    drives: {
      C: 99.9,
      D: 19.9,
      H: 149,
    },
  },
  {
    serverName: "MCHP027A",
    drives: {
      C: 99.9,
      D: 19.9,
      H: null,
    },
  },
];

const exportToExcel = () => {

};

const getRandomUsed = (total) => {
  if (!total) return null;
  return +(total * (0.1 + Math.random() * 0.85)).toFixed(2);
};

const DriveSpace = () => {
  const [driveEntries, setDriveEntries] = useState([]);
  const [serverFilter, setServerFilter] = useState('both');

  useEffect(() => {
    const entries = [];

    MOCK_DRIVE_DATA.forEach(({ serverName, drives }) => {
      Object.entries(drives).forEach(([drive, total]) => {
        if (total === null || total === undefined) return;

        const used = getRandomUsed(total);
        const free = +(total - used).toFixed(2);
        const freePercent = +((free / total) * 100).toFixed(1);

        entries.push({
          serverName,
          drive,
          total,
          used,
          free,
          freePercent,
        });
      });
    });

    setDriveEntries(entries);

    const interval = setInterval(() => {
      setDriveEntries(prevEntries =>
        prevEntries.map(entry => {
          const used = getRandomUsed(entry.total);
          const free = +(entry.total - used).toFixed(2);
          const freePercent = +((free / entry.total) * 100).toFixed(1);
          return { ...entry, used, free, freePercent };
        })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (e) => {
    setServerFilter(e.target.value);
  };

  const filteredEntries = driveEntries.filter(({ serverName }) => {
    if (serverFilter === 'integration') return INTEGRATION_SERVERS.includes(serverName);
    if (serverFilter === 'production') return PRODUCTION_SERVERS.includes(serverName);
    return true;
  });

  return (
    <div className="DriveSpace-container">
      <nav className="DriveSpace-nav">
        <div className="DriveSpace-logo">
          <Link to="/menu">
           <img src={require('../images/logo.png')} alt="Logo" className="CpuMemory-logo-img" />
          </Link>
        </div>
        <div className="DriveSpace-nav-spacer"></div>
      </nav>

      <div className="header-row-DriveSpace">
        <label htmlFor="serverFilter" className="serverFilter-label-DriveSpace">Filter By Server Type :</label>
        <select id="serverFilter" value={serverFilter} onChange={handleFilterChange} className="serverFilter-DriveSpace" >
          <option value="both">Both</option>
          <option value="integration">Integration</option>
          <option value="production">Production</option>
        </select>
        <h1 className="DriveSpace-title">💾 Server Drive Space Dashboard</h1>
        <button onClick={exportToExcel} className="export-button-DriveSpace">
          Export
        </button>
      </div>

      <main className="DriveSpace-main">
        <table className="DriveSpace-table">
          <thead>
            <tr>
              <th>Server Name</th>
              <th>Drive</th>
              <th>Total Space (GB)</th>
              <th>Used Space (GB)</th>
              <th>Free Space (GB)</th>
              <th>Free Space (%)</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map(({ serverName, drive, total, used, free, freePercent }, i) => {
              let rowClass = '';

              if (INTEGRATION_SERVERS.includes(serverName)) {
                rowClass = 'highlight-green-DriveSpace';
              } else if (PRODUCTION_SERVERS.includes(serverName)) {
                rowClass = 'highlight-red-DriveSpace';
              }

              return (
                <tr key={i} className={rowClass}>
                  <td>{serverName}</td>
                  <td>{drive}</td>
                  <td>{total.toFixed(1)}</td>
                  <td>{used.toFixed(1)}</td>
                  <td>{free.toFixed(1)}</td>
                  <td className={freePercent < 30 ? 'alert-DriveSpace' : 'normal-DriveSpace'}>
                    {freePercent}% {freePercent < 30 && '⚠️'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>

      <footer className="DriveSpace-footer">
        © 2025 Mitel Networks Corporation
      </footer>
    </div>
  );
};

export default DriveSpace;
