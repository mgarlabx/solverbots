const localHosts = ['localhost', '127.0.0.1'];
const isLocalEnvironment = localHosts.includes(window.location.hostname);

const defaultBackendPath = isLocalEnvironment
    ? 'http://localhost:8888/_solveredu/solverbots/backend/'
    : 'https://solvertank.tech/solverbots/backend/';

const Settings = {
    backendPath: window.SOLVERBOTS_BACKEND_PATH || defaultBackendPath
}