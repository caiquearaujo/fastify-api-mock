import { FastifyApplication, ApiServer } from './www';

export abstract class Router {
	abstract apply(app: FastifyApplication, server: ApiServer): void;
}

export class Routering {
	protected routers: Array<Router> = [];

	constructor(...args: Array<Router>) {
		this.routers = args;
	}

	public apply(app: FastifyApplication, server: ApiServer): void {
		for (let router of this.routers) {
			router.apply(app, server);
		}
	}
}
