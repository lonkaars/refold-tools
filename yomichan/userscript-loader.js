(async () => {
	if (window.location.protocol != "chrome-extension:") return; // only run on yomichan pages
	if (window.location.pathname != "/search.html") return; // only run on search page
	eval((await yomichan.api.getSettings([{
		scope: "profile",
		optionsContext: { current: true },
		path: 'general.userScript'
	}]))[0].result);
})();

