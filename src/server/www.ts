import http from 'http';

import fastify, {
	FastifyBaseLogger,
	FastifyInstance,
	FastifyTypeProviderDefault,
} from 'fastify';

import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyCompress from '@fastify/compress';

import { NAME, VERSION, PORT, ENVIRONMENT } from './config';
import { Routering } from './router';

export type FastifyApplication = FastifyInstance<
	http.Server,
	http.IncomingMessage,
	http.ServerResponse,
	FastifyBaseLogger,
	FastifyTypeProviderDefault
> &
	PromiseLike<
		FastifyInstance<
			http.Server,
			http.IncomingMessage,
			http.ServerResponse,
			FastifyBaseLogger,
			FastifyTypeProviderDefault
		>
	>;

export type ApiServerOptions = {
	router: Routering;
};

export class ApiServer {
	app: FastifyApplication;
	router: Routering;

	name: string;
	version: string;
	port: number;
	environment: string;

	constructor(options: ApiServerOptions) {
		this.name = NAME ?? 'api-server';
		this.version = VERSION ?? '0.1.0';
		this.port = parseInt(PORT ?? '80');
		this.environment = ENVIRONMENT;

		this.app = fastify({
			logger: true,
			trustProxy: true,
		});

		this.router = options.router;
	}

	public async bootstrap(): Promise<Server> {
		await this.init();
		return new Server(this.app, this);
	}

	protected async init() {
		// Prevent against vulnerabilities
		await this.app.register(fastifyHelmet);

		// Prevent too many calls
		await this.app.register(fastifyRateLimit, {
			max: 100,
			timeWindow: '1 minute',
		});

		// Compress response
		await this.app.register(fastifyCompress, { global: true });

		this.router.apply(this.app, this);

		// Default not found handler
		this.app.setNotFoundHandler((request, reply) => {
			reply.status(404).send({
				status: 404,
				name: 'NotFound',
				message: 'The resource you are looking for is not found.',
			});
		});

		// Default global error handler
		this.app.setErrorHandler((error, request, reply) => {
			const { name = 'UnknownError', message = 'Unknown error' } = error;

			this.app.log.error(error);

			reply.status(parseInt(error.code ?? '500')).send({
				status: error.code ?? 500,
				name: name,
				message: message,
			});
		});
	}
}

export class Server {
	app: FastifyApplication;
	api: ApiServer;
	running: boolean = false;

	port: number;

	constructor(app: FastifyApplication, api: ApiServer) {
		this.port = parseInt(PORT ?? '80');

		this.app = app;
		this.api = api;
	}

	public async start() {
		this.running = await this.listen();
	}

	public async restart() {
		await this.stop();
		await this.start();
	}

	public async stop() {
		console.log('Stopping server');

		const response = await new Promise<boolean>((res, rej) => {
			if (!this.isRunning()) return res(true);

			this.app
				.close()
				.then(
					() => {
						console.error('⚡️[server]: Server successfully closed');
						res(true);
					},
					err => {
						console.error(
							'⚡️[server]: An error happened while closing server',
							err
						);
						rej(false);
					}
				)
				.catch(err => {
					console.error(
						'⚡️[server]: An error happened while closing server',
						err
					);
					rej(false);
				});
		});

		this.running = !response;
	}

	public isRunning(): boolean {
		return this.running;
	}

	protected listen(): Promise<boolean> {
		if (this.isRunning()) {
			console.error('⚡️[server]: Server is already running');
			return new Promise(res => res(false));
		}

		return new Promise(async (res, rej) => {
			this.app.listen(
				{ port: this.port, host: '0.0.0.0' },
				(err, address) => {
					if (err) {
						// Should notify administrators
						this.app.log.error(err);
						rej(false);
					}

					console.log(`⚡️[server]: Server is running at ${address}`);

					res(true);
				}
			);
		});
	}
}
