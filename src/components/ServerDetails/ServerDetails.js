import { useEffect, useState } from 'react'; 
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './ServerDetails.css';
import '../images/logo.png';
import { Link } from 'react-router-dom';
import { All_SERVERS_API } from '../apiEndpints';

const ServerDetails = () => {
  const [serverData, setServerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverFilter, setServerFilter] = useState('both');
  const [integrationServers, setIntegrationServers] = useState([]);
  const [productionServers, setProductionServers] = useState([]);

  useEffect(() => {
    fetch(All_SERVERS_API.ALL_SERVERS)
      .then(response => response.json())
      .then(data => {
        console.log('Raw API data:', data);

        const transformed = data.map(server => ({
          name: server.serverName,
          hostName: server.hostName,
          ip: server.ipAddress,
          os: server.osName,
          ram: server.ramGb,
          cores: server.cores,
          owner: server.owner,
          env: Number(server.environment),
        }));

        console.log('Transformed data:', transformed);

        const integration = transformed
          .filter(server => server.env === 2)
          .map(server => server.name);

        const production = transformed
          .filter(server => server.env === 1)
          .map(server => server.name);

        setIntegrationServers(integration);
        setProductionServers(production);
        setServerData(transformed);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching server data:', error);
        setLoading(false);
      });
  }, []);

  const exportToExcel = () => {
    const filteredExportData = serverData.filter(server => {
      if (serverFilter === 'integration') return integrationServers.includes(server.name);
      if (serverFilter === 'production') return productionServers.includes(server.name);
      return true;
    });

    const filteredData = filteredExportData.map(server => ({
      'Server Name': server.name,
      'Host Name': server.hostName,
      'IP Address': server.ip,
      'OS Name': server.os,
      'RAM (GB)': server.ram,
      'Cores': server.cores,
      'Owner': server.owner,
      'Environment': server.env === 1 ? 'Production' : server.env === 2 ? 'Integration' : 'Other',
    }));

    if (filteredData.length === 0) {
      alert('No data available to export');
      return;
    }

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

    let fileName = 'server_information';
    if (serverFilter === 'production') fileName += '_production';
    else if (serverFilter === 'integration') fileName += '_integration';
    fileName += '.xlsx';

    saveAs(data, fileName);
  };

  const handleFilterChange = (e) => {
    setServerFilter(e.target.value);
  };

  const filteredData = serverData.filter(server => {
    if (serverFilter === 'integration') return integrationServers.includes(server.name);
    if (serverFilter === 'production') return productionServers.includes(server.name);
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

        <h1 className="ServerDetails-title">🖥️ Server Information</h1>
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
                if (integrationServers.includes(server.name)) {
                  rowClass = 'highlight-green-ServerDetails';
                } else if (productionServers.includes(server.name)) {
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
                    <td>{server.env === 1 ? 'Production' : server.env === 2 ? 'Integration' : 'Other'}</td>
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
