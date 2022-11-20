export const uniApiPromisify = (fn, params = {}, options = { alawayResolve: false }) => {
	return new Promise((success, fail) => {
		if (options.alawayResolve) {
			params.complete = success;
		} else {
			params.fail = fail;
			params.success = success;
		}
		fn.call(this, params);
	});
};
