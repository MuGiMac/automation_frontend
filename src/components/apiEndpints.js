//const BASE_URL = '';

/*
const AUTH_API = {
  LOGIN: `${BASE_URL}/auth/login`,
};
*/

const All_SERVERS_API = {
    ALL_SERVERS: '/AutomationAPI/api/servers/allServers',
};

const CPU_MEMORY_API = {
	CM_API_021A: 'http://mchp021a.unify.com:9000/AutomationAPI/api/usage/CPUMemoryUsage',
	CM_API_026A: 'http://mchp026a.unify.com:9000/AutomationAPI/api/usage/CPUMemoryUsage',
	CM_API_025A: 'http://mchp025a.unify.com:9000/AutomationAPI/api/usage/CPUMemoryUsage',
};

export {
  //AUTH_API,
  All_SERVERS_API,
  CPU_MEMORY_API
};