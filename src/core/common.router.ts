import { Router } from '@/server/router';
import { FastifyApplication } from '@/server/www';

class CommonRouter extends Router {
	apply(app: FastifyApplication): void {
		app.get('/status', (request, reply) => {
			reply.send({
				running: true,
			});
		});
	}
}

export const commonRouter = new CommonRouter();
