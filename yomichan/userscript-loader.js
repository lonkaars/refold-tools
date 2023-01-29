(async () => eval((await yomichan.api.getSettings([{
	scope: "profile",
	optionsContext: { current: true },
	path: 'general.userScript'
}]))[0].result))();

