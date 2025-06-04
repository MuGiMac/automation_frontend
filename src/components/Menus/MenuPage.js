import { useNavigate } from 'react-router-dom';
import './MenuPage.css';

const MenuPage = () => {
  const navigate = useNavigate();

  return (
    <div className="menu-page">
        <div className='menu-content'>
        <h1>CE Server Status & Performance</h1>

        <div className="menu-grid">
          <button onClick={() => navigate('/serverdetails')} className="menu-button">
            Server Details
          </button>

          <button onClick={() => alert('Coming Soon')} className="menu-button">
            Check Processed LDAP Logs
          </button>

          <button onClick={() => navigate('/cpumemory')} className="menu-button">
            CPU and Memory Consumption
          </button>

          <button onClick={() => alert('Coming Soon')} className="menu-button">
            Kill Identity Processes
          </button>

          <button onClick={() => alert('Coming Soon')} className="menu-button">
            Check Windows Services Status
          </button>

          <button onClick={() => alert('Coming Soon')} className="menu-button">
            Check Windows Schedulers Status
          </button>

          <button onClick={() => navigate('/drivespace')} className="menu-button">
            Check Drive Free Space of all servers
          </button>

          <button onClick={() => alert('Coming Soon')} className="menu-button">
            Check Status of Identity Workflows
          </button>

          <button onClick={() => alert('Coming Soon')} className="menu-button">
            Check Replication Sync Status
          </button>

          <button onClick={() => alert('Coming Soon')} className="menu-button">
            Check Status of Request Workflows
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
