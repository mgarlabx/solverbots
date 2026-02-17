const localHosts = ['localhost', '127.0.0.1'];
const isLocalEnvironment = localHosts.includes(window.location.hostname);

const productionBackendPath = `${window.location.protocol}//${window.location.hostname}/solverbots/backend/`;

const defaultBackendPath = isLocalEnvironment
    ? 'http://localhost:8888/_solveredu/solverbots/backend/'
    : productionBackendPath;

const Settings = {
    backendPath: window.SOLVERBOTS_BACKEND_PATH || defaultBackendPath
}