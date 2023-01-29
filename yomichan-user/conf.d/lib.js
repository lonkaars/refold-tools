async function getClipboardSettings() {
	return (await yomichan.api.getSettings([{
		scope: "profile",
		optionsContext: { current: true },
		path: 'clipboard'
	}]))[0].result;
}

async function setClipboardSettings(settings) {
	await yomichan.api.modifySettings([{
		scope: "profile",
		optionsContext: { current: true },
		path: 'clipboard',
		action: 'set',
		value: settings
	}]);
}

async function escapeYomichanCopy(text) {
	var userClipboardSettings = await getClipboardSettings();
	var tempSettings = {
		enableBackgroundMonitor: false,
		enableSearchPageMonitor: false,
		autoSearchContent: false,
		maximumSearchLength: userClipboardSettings.maximumSearchLength,
	};
	await setClipboardSettings(tempSettings);

	navigator.clipboard.writeText(text);

	// execute on next JS event loop
	setTimeout(async () => await setClipboardSettings(userClipboardSettings), 0);
}

function rubyHelper(element, reading) {
	var out = "";
	for (var child of element.childNodes) {
		if (reading && child.nodeName != "RT") continue;
		if (!reading && child.nodeName == "RT") continue;
		out += child.innerText;
	}
	return out;
}

