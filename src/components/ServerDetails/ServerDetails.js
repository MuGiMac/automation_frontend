import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './ServerDetails.css';
import '../images/logo.png';
import { Link } from 'react-router-dom';

const INTEGRATION_SERVERS = ['MCHP021A', 'MCHP026A', 'MCHP025A'];
const PRODUCTION_SERVERS = ['MCHP029A', 'MCHP028A', 'MCHP027A'];

const ServerDetails = () => {
  const [serverData, setServerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverFilter, setServerFilter] = useState('both');

  useEffect(() => {
    fetch('http://localhost:3001/servers')
      .then(response => response.json())
      .then(data => {
        const transformed = data.map(server => ({
          name: server.name,
          hostName: server.host_name,
          ip: server.ip_address,
          os: server.os_name,
          ram: server.ram_gb,
          cores: server.cores,
          owner: server.owner,
          env: server.environment,
        }));
        setServerData(transformed);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching server data:', error);
        setLoading(false);
      });
  }, []);

  const exportToExcel = () => {
    const filteredData = serverData.map(server => ({
      'Server Name': server.name,
      'Host Name': server.hostName,
      'IP Address': server.ip,
      'OS Name': server.os,
      'RAM (GB)': server.ram,
      'Cores': server.cores,
      'Owner': server.owner,
      'Environment': server.env
    }));

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const columnWidths = Object.keys(filteredData[0]).map(key => {
      const maxLength = Math.max(
        key.length,
        ...filteredData.map(row => String(row[key] || '').length)
      );
      return { wch: maxLength + 2 };
    });

    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Servers');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(data, 'server_details.xlsx');
  };

  const handleFilterChange = (e) => {
    setServerFilter(e.target.value);
  };

  const filteredData = serverData.filter(server => {
    if (serverFilter === 'integration') return INTEGRATION_SERVERS.includes(server.name);
    if (serverFilter === 'production') return PRODUCTION_SERVERS.includes(server.name);
    return true;
  });

  return (
    <div className="ServerDetails-container">
      <nav className="ServerDetails-nav">
        <div className="ServerDetails-logo">
          <Link to="/menu">
           <img src={require('../images/logo.png')} alt="Logo" className="CpuMemory-logo-img" />
          </Link>
        </div>
        <div className="ServerDetails-nav-spacer"></div>
      </nav>

      <div className="header-row-ServerDetails">
        <label htmlFor="serverFilter" className="serverFilter-label-ServerDetails">Filter By Server Type :</label>
        <select id="serverFilter" value={serverFilter} onChange={handleFilterChange} className="serverFilter-ServerDetails">
          <option value="both">Both</option>
          <option value="integration">Integration</option>
          <option value="production">Production</option>
        </select>

        <h1 className="ServerDetails-title">🖥️ Server Details</h1>
        <button onClick={exportToExcel} className="export-button-ServerDetails">
          Export
        </button>
      </div>

      <main className="ServerDetails-main">
        {loading ? (
          <p>Loading server data...</p>
        ) : (
          <table className="ServerDetails-table">
            <thead>
              <tr>
                <th>Server Name</th>
                <th>Host Name</th>
                <th>IP Address</th>
                <th>OS Name</th>
                <th>RAM (GB)</th>
                <th>Core(s)</th>
                <th>Owner</th>
                <th>Environment</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((server, index) => {
                let rowClass = '';
                if (INTEGRATION_SERVERS.includes(server.name)) {
                  rowClass = 'highlight-green-ServerDetails';
                } else if (PRODUCTION_SERVERS.includes(server.name)) {
                  rowClass = 'highlight-red-ServerDetails';
                }

                return (
                  <tr key={index} className={rowClass}>
                    <td>{server.name}</td>
                    <td>{server.hostName}</td>
                    <td>{server.ip}</td>
                    <td>{server.os}</td>
                    <td>{server.ram}</td>
                    <td>{server.cores}</td>
                    <td>{server.owner}</td>
                    <td>{server.env}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>

      <footer className="ServerDetails-footer">
        © 2025 Mitel Networks Corporation
      </footer>
    </div>
  );
};

export default ServerDetails;
