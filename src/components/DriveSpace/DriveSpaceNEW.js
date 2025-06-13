import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './DriveSpace.css';
import logo from '../images/logo.png';
import { Link } from 'react-router-dom';
import { DRIVE_SPACE_API, All_SERVERS_API } from '../apiEndpints';

const DriveSpace = () => {
  const [servers, setServers] = useState([]);
  const [integrationServers, setIntegrationServers] = useState([]);
  const [productionServers, setProductionServers] = useState([]);
  const [serverFilter, setServerFilter] = useState('both');
  const [driveFilter, setDriveFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchServers = async () => {
    try {
      const res = await fetch(All_SERVERS_API.ALL_SERVERS);
      const data = await res.json();

      console.log('Raw data fetched:', data);

      const transformed = data.map(server => ({
        name: server.serverName.toUpperCase().trim(),
        env: Number(server.environment),
      }));

      console.log('Transformed data:', transformed);

      const integration = transformed
        .filter(server => server.env === 2)
        .map(server => server.name);

      const production = transformed
        .filter(server => server.env === 1)
        .map(server => server.name);

      console.log('Integration servers:', integration);
      console.log('Production servers:', production);

      setIntegrationServers(integration);
      setProductionServers(production);
    } catch (error) {
      console.error('Error fetching servers list:', error);
    }
  };

  const fetchDriveSpaceData = () => {
    const fetch1 = fetch(DRIVE_SPACE_API.DS_API_021A).then(res => res.json());
    const fetch2 = fetch(DRIVE_SPACE_API.DS_API_026A).then(res => res.json());
    const fetch3 = fetch(DRIVE_SPACE_API.DS_API_025A).then(res => res.json());

    Promise.all([fetch1, fetch2, fetch3])
      .then(([data1, data2, data3]) => {
        console.log('Raw API data from mchp021a:', data1);
        console.log('Raw API data from mchp026a:', data2);
        console.log('Raw API data from mchp025a:', data3);

        const combined = [
          ...(Array.isArray(data1) ? data1 : [data1]),
          ...(Array.isArray(data2) ? data2 : [data2]),
          ...(Array.isArray(data3) ? data3 : [data3]),
        ];

        console.log('Raw API combined data:', combined);

        const entries = [];
        combined.forEach(({ serverName, diskSpace }) => {
          if (!diskSpace) return;
          diskSpace.forEach(({ drive, freeSpace, totalSpace }) => {
            entries.push({
              serverName: serverName.toUpperCase(),
              drive,
              total: parseFloat(totalSpace),
              free: parseFloat(freeSpace),
            });
          });
        });

        setServers(entries);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching drive space data:', error);
        setLoading(false);
      });
  };

  const exportToExcel = () => {
    const filteredEntries = servers.filter(({ serverName, drive }) => {
        if (serverFilter === 'integration' && !integrationServers.includes(serverName)) return false;
        if (serverFilter === 'production' && !productionServers.includes(serverName)) return false;
        if (driveFilter !== 'ALL' && drive !== driveFilter) return false;
        return true;
    });

    if (filteredEntries.length === 0) {
      alert('No data available to export');
      return;
    }

    const mappedData = filteredEntries.map(({ serverName, drive, total, free }) => ({
      'Server Name': serverName,
      'Drive': drive,
      'Total Space (GB)': total.toFixed(2),
      'Free Space (GB)': free.toFixed(2),
    }));

    const worksheet = XLSX.utils.json_to_sheet(mappedData);
    const columnWidths = Object.keys(mappedData[0]).map(key => {
      const maxLength = Math.max(
        key.length,
        ...mappedData.map(row => String(row[key] || '').length)
      );
      return { wch: maxLength + 2 };
    });
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DriveSpace');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

    let fileName = 'drive_space';
    if (serverFilter !== 'both') fileName += `_${serverFilter}`;
    if (driveFilter !== 'ALL') fileName += `_${driveFilter.toLowerCase()}_drive`;
    fileName += '.xlsx';

    saveAs(data, fileName);
  };

  const handleFilterChange = (e) => {
    setServerFilter(e.target.value);
  };

  const handleDriveFilterChange = (e) => {
    setDriveFilter(e.target.value);
  };

  useEffect(() => {
    let intervalId;

    const initialize = async () => {
      await fetchServers();
      fetchDriveSpaceData();
      intervalId = setInterval(fetchDriveSpaceData, 10000);
    };

    initialize();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const filteredEntries = servers.filter(({ serverName, drive }) => {
    if (serverFilter === 'integration' && !integrationServers.includes(serverName)) return false;
    if (serverFilter === 'production' && !productionServers.includes(serverName)) return false;
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
          <label htmlFor="serverFilter" className="serverFilter-label-DriveSpace">
            Filter By Server Type :
          </label>
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

          <label htmlFor="driveFilter" className="serverFilter-label-DriveSpace">
            Filter By Drive :
          </label>
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
        {loading ? (
          <p>Loading data...</p>
        ) : (
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
              {filteredEntries.map(({ serverName, drive, total, free }, i) => {
                let rowClass = '';

                if (integrationServers.includes(serverName)) {
                  rowClass = 'highlight-green-DriveSpace';
                } else if (productionServers.includes(serverName)) {
                  rowClass = 'highlight-red-DriveSpace';
                }

                const freePercent = (free / total) * 100;

                return (
                  <tr key={`${serverName}-${drive}-${i}`} className={rowClass}>
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
        )}
      </main>

      <footer className="DriveSpace-footer">© 2025 Mitel Networks Corporation</footer>
    </div>
  );
};

export default DriveSpace;
