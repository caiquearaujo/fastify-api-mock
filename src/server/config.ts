import { config } from 'dotenv';
import path from 'path';

export const { ENVIRONMENT = 'development' } = process.env;
const DIR = path.resolve(__dirname, '../..');

config({
	path: `${DIR}/.env.${ENVIRONMENT}`,
});

export const { NAME, VERSION, PORT } = process.env;
