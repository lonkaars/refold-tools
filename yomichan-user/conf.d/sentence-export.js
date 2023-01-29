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

async function exportSentence() {
	var inputHTML = document.getElementById("query-parser-content");
	var output = "";

	for (var child of inputHTML.children) {
		for (var subchild of child.childNodes) {
			if (subchild.nodeName == '#text') {
				output += subchild.textContent;
				continue;
			}
			if (subchild.nodeName == 'RUBY') {
				output += `[${subchild.childNodes[0].innerText}](${subchild.childNodes[1].innerText})`;
				continue;
			}
		}
	}

	var userClipboardSettings = await getClipboardSettings();
	var tempSettings = {
		enableBackgroundMonitor: false,
		enableSearchPageMonitor: false,
		autoSearchContent: false,
		maximumSearchLength: userClipboardSettings.maximumSearchLength,
	};
	await setClipboardSettings(tempSettings);

	navigator.clipboard.writeText(output);

	// execute on next JS event loop
	setTimeout(async () => await setClipboardSettings(userClipboardSettings), 0);

	return output;
}

function patchSearchBar() {
	var searchBarOuter = document.getElementsByClassName("search-textbox-container")[0];
	var button = document.createElement("button");
	button.id = "anki-sentence-export-button";
	button.classList.add("search-button");
	button.onclick = exportSentence;
	var icon = document.createElement("span");
	icon.classList.add("icon");
	icon.setAttribute("data-icon", "copy");
	button.appendChild(icon);
	searchBarOuter.insertBefore(button, searchBarOuter.childNodes[2]);
}

function run() {
	if (document.body.classList.contains("patched")) return;

	patchSearchBar();

	document.body.classList.add("patched");
}

run();

