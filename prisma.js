const { PrismaClient } = require('@prisma/client');

function normalizeLegacyValue(value) {
	const text = String(value ?? '').trim();
	const match = text.match(/^(['"])(.*)\1,$/);
	return match ? match[2] : text;
}

if (!process.env.DATABASE_URL) {
	const host = normalizeLegacyValue(process.env.host);
	const port = normalizeLegacyValue(process.env.port);
	const user = normalizeLegacyValue(process.env.user);
	const password = normalizeLegacyValue(process.env.password);
	const database = normalizeLegacyValue(process.env.database);
	const configuredPort = port;
	const parsedPort = Number(configuredPort);

	if (host && user && password && database && Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort < 65536) {
		process.env.DATABASE_URL = `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${parsedPort}/${encodeURIComponent(database)}`;
	}
}

const prisma = new PrismaClient();

module.exports = prisma;