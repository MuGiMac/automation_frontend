import { getToken } from '../Services/authServices';
const All_SERVERS_API = {
  ALL_SERVERS: '/AutomationAPI/mchp021a/api/servers/allServers',
};

const CPU_MEMORY_API = {
	CM_API_021A: '/AutomationAPI/mchp021a/api/usage/CPUMemoryUsage',
	CM_API_026A: '/AutomationAPI/mchp026a/api/usage/CPUMemoryUsage',
	CM_API_025A: '/AutomationAPI/mchp025a/api/usage/CPUMemoryUsage',
};

const DRIVE_SPACE_API = {
	DS_API_021A: '/AutomationAPI/mchp021a/api/drive/diskSpace',
	DS_API_026A: '/AutomationAPI/mchp026a/api/drive/diskSpace',
	DS_API_025A: '/AutomationAPI/mchp025a/api/drive/diskSpace',
};

const LOGIN_API = {
	LOGIN_API_021A: '/AutomationAPI/mchp021a/auth/login',
};

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

export {
  All_SERVERS_API,
  CPU_MEMORY_API,
  DRIVE_SPACE_API,
  LOGIN_API,
  getAuthHeaders
};