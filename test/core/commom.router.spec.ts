import { commonRouter } from '@/core/common.router';
import { Routering } from '@/server/router';
import { ApiServer, FastifyApplication } from '@/server/www';

let app: FastifyApplication;

beforeAll(async () => {
	const api = new ApiServer({
		router: new Routering(commonRouter),
	});

	await api.bootstrap();
	app = api.app;
});

describe('Common Routes', () => {
	it('GET /status', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/status',
		});

		expect(response.statusCode).toBe(200);
		expect(JSON.parse(response.body)).toStrictEqual({
			running: true,
		});
	});
});
