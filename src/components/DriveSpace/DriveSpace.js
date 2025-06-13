import { useEffect, useState } from 'react';
import './DriveSpace.css';
import logo from '../images/logo.png';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Link } from 'react-router-dom';

const INTEGRATION_SERVERS = ['MCHP021A', 'MCHP026A', 'MCHP025A'];
const PRODUCTION_SERVERS = ['MCHP029A', 'MCHP028A', 'MCHP027A'];

const MOCK_DRIVE_DATA = [
  {
    serverName: "MCHP021A",
    diskSpace: [
      { drive: "C", freeSpace: "131.60", totalSpace: "237.32" },
      { drive: "D", freeSpace: "100.00", totalSpace: "200.00" },
      { drive: "H", freeSpace: "50.00", totalSpace: "100.00" },
    ]
  },
  {
    serverName: "MCHP026A",
    diskSpace: [
      { drive: "C", freeSpace: "110.50", totalSpace: "220.00" },
      { drive: "D", freeSpace: "90.00", totalSpace: "180.00" },
      { drive: "H", freeSpace: "70.00", totalSpace: "150.00" },
    ]
  },
  {
    serverName: "MCHP025A",
    diskSpace: [
      { drive: "C", freeSpace: "80.00", totalSpace: "180.00" },
      { drive: "D", freeSpace: "60.00", totalSpace: "120.00" },
    ]
  },
  {
    serverName: "MCHP029A",
    diskSpace: [
      { drive: "C", freeSpace: "99.90", totalSpace: "200.00" },
      { drive: "D", freeSpace: "40.00", totalSpace: "120.00" },
      { drive: "H", freeSpace: "60.00", totalSpace: "150.00" },
    ]
  },
  {
    serverName: "MCHP028A",
    diskSpace: [
      { drive: "C", freeSpace: "70.00", totalSpace: "200.00" },
      { drive: "D", freeSpace: "50.00", totalSpace: "100.00" },
      { drive: "H", freeSpace: "45.00", totalSpace: "150.00" },
    ]
  },
  {
    serverName: "MCHP027A",
    diskSpace: [
      { drive: "C", freeSpace: "60.00", totalSpace: "180.00" },
      { drive: "D", freeSpace: "30.00", totalSpace: "100.00" },
    ]
  },
];

const DriveSpace = () => {
  const [driveEntries, setDriveEntries] = useState([]);
  const [serverFilter, setServerFilter] = useState('both');
  const [driveFilter, setDriveFilter] = useState('ALL');

  useEffect(() => {
    const entries = [];

    MOCK_DRIVE_DATA.forEach(({ serverName, diskSpace }) => {
      diskSpace.forEach(({ drive, freeSpace, totalSpace }) => {
        const total = parseFloat(totalSpace);
        const free = parseFloat(freeSpace);

        entries.push({
          serverName,
          drive,
          total,
          free,
        });
      });
    });

    setDriveEntries(entries);

    const interval = setInterval(() => {
      setDriveEntries(prevEntries =>
        prevEntries.map(entry => {
          const free = +(entry.total * (0.1 + Math.random() * 0.85)).toFixed(2);
          return { ...entry, free };
        })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (e) => {
    setServerFilter(e.target.value);
  };

  const handleDriveFilterChange = (e) => {
    setDriveFilter(e.target.value);
  };

  const exportToExcel = () => {

    const filteredExportData = driveEntries.filter(({ serverName, drive }) => {
      if (serverFilter === 'integration' && !INTEGRATION_SERVERS.includes(serverName)) return false;
      if (serverFilter === 'production' && !PRODUCTION_SERVERS.includes(serverName)) return false;
      if (driveFilter !== 'ALL' && drive !== driveFilter) return false;
      return true;
    });

    const formattedData = filteredExportData.map(entry => ({
      'Server Name': entry.serverName,
      'Drive': entry.drive,
      'Total Space (GB)': entry.total.toFixed(2),
      'Free Space (GB)': entry.free.toFixed(2),
    }));

    if (filteredExportData.length === 0) {
      alert('No data available to export');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const columnWidths = Object.keys(formattedData[0]).map(key => {
      const maxLength = Math.max(
        key.length,
        ...formattedData.map(row => String(row[key] || '').length)
      );
      return { wch: maxLength + 2 };
    });
    worksheet['!cols'] = columnWidths;


    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DriveSpace');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    let fileName = 'drive_space';
    if (serverFilter !== 'both') fileName += `_${serverFilter}`;
    if (driveFilter !== 'ALL') fileName += `_${driveFilter.toLowerCase()}_drive`;
    fileName += '.xlsx';

    saveAs(blob, fileName);
  };

  const filteredExportData = driveEntries.filter(({ serverName, drive }) => {
    if (serverFilter === 'integration' && !INTEGRATION_SERVERS.includes(serverName)) return false;
    if (serverFilter === 'production' && !PRODUCTION_SERVERS.includes(serverName)) return false;
    if (driveFilter !== 'ALL' && drive !== driveFilter) return false;
    return true;
  });

  return (
    <div className="DriveSpace-container">
      <nav className="DriveSpace-nav">
        <div className="DriveSpace-logo">
          <Link to="/menu">
            <img src={logo} alt="Logo" className="DriveSpace-logo-img" />
          </Link>
        </div>
        <div className="DriveSpace-nav-spacer"></div>
      </nav>

      <div className="header-row-DriveSpace">
        <div className="filters-group">
          <label htmlFor="serverFilter" className="serverFilter-label-DriveSpace">Filter By Server Type :</label>
          <select
            id="serverFilter"
            value={serverFilter}
            onChange={handleFilterChange}
            className="serverFilter-DriveSpace"
          >
            <option value="both">Both</option>
            <option value="integration">Integration</option>
            <option value="production">Production</option>
          </select>

          <label htmlFor="driveFilter" className="serverFilter-label-DriveSpace">Filter By Drive :</label>
          <select
            id="driveFilter"
            value={driveFilter}
            onChange={handleDriveFilterChange}
            className="serverFilter-DriveSpace"
          >
            <option value="ALL">ALL</option>
            <option value="C">C Drive</option>
            <option value="D">D Drive</option>
            <option value="H">H Drive</option>
          </select>
        </div>

        <h1 className="DriveSpace-title">💾 Drive Space Dashboard</h1>

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
              <th>Free Space (GB)</th>
            </tr>
          </thead>
          <tbody>
            {filteredExportData.map(({ serverName, drive, total, free }, i) => {
              let rowClass = '';

              if (INTEGRATION_SERVERS.includes(serverName)) {
                rowClass = 'highlight-green-DriveSpace';
              } else if (PRODUCTION_SERVERS.includes(serverName)) {
                rowClass = 'highlight-red-DriveSpace';
              }

              const freePercent = (free / total) * 100;

              return (
                <tr key={i} className={rowClass}>
                  <td>{serverName}</td>
                  <td>{drive}</td>
                  <td>{total.toFixed(1)}</td>
                  <td>
                    {freePercent < 30 ? (
                      <span className="warning">
                        {free.toFixed(1)} <span className="warning-icon">⚠️</span>
                      </span>
                    ) : (
                      `${free.toFixed(1)}`
                    )}
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
