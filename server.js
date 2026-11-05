require('dotenv').config();
const http = require('http');

const app = require('./app');

const configuredPort = process.env.API_PORT || process.env.PORT;
const parsedPort = Number(configuredPort);
const port = Number.isInteger(parsedPort) && parsedPort >= 0 && parsedPort < 65536
    ? parsedPort
    : 5000;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
})