import 'module-alias/register';
import { commonRouter } from '@/core/common.router';
import { ApiServer } from '@/server/www';
import { Routering } from '@/server/router';

new ApiServer({
	router: new Routering(commonRouter),
})
	.bootstrap()
	.then(server =>
		server
			.start()
			.then(() => console.log(`⚡️ Server is ready.`))
			.catch(err => {
				console.error('❌ Server failed to start...');
				console.error(err);
				process.exit(1);
			})
	)
	.catch(err => {
		console.error('❌ Server failed to start...');
		console.error(err);
		process.exit(1);
	});
