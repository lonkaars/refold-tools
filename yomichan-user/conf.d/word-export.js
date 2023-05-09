{

function exportWord(entry) {
	var wordElement = entry.getElementsByClassName("headword-term")[0];
	var hasKanji = false;

	function addWord(reading) {
		var out = "";
		for (var child of wordElement.childNodes) {
			if (child.nodeName == "#text") out += child.textContent;
			if (child.nodeName == "RUBY") {
				hasKanji = true;
				if (reading && out.length != 0) out += "\u30fb";
				out += rubyHelper(child, reading);
			}
		}
		return out;
	}
	var kanji = addWord(false);
	var reading = addWord(true);
	var result = `${kanji}`;
	if (hasKanji) result += `\u3010${reading}\u3011`;
	else result += " ";

	var tags = [];

	var pitchAccent = "";
	for (var tag of entry.getElementsByClassName("pronunciation-downstep-notation-number")) {
		pitchAccent = tag.innerText.trim();
		break;
	}
	if (pitchAccent) tags.push(`[${pitchAccent}]`);
	
	var usuallyKana = false;
	for (var tag of entry.getElementsByClassName("tag-label-content"))
		if (tag.innerText.trim() == "uk")
			usuallyKana = true;
	if (usuallyKana) tags.push("(uk)");

	result += tags.join(" ");

	escapeYomichanCopy(result);
}

function addWordCopyButtons() {
	var definitions = document.getElementById("dictionary-entries").getElementsByClassName("entry");
	for (var definition of definitions) {
		if (definition.classList.contains("word-export-patched")) continue;
		var actions = definition.getElementsByClassName("actions")[0];

		var button = document.createElement("button");
		button.classList.add("action-button");
		button.onclick = function() { exportWord(this.parentElement.parentElement.parentElement); };
		var icon = document.createElement("span");
		var title = "Copy definition (Alt + C)";
		icon.classList.add("icon");
		icon.classList.add("color-icon");
		icon.classList.add("action-icon");
		icon.setAttribute("data-icon", "copy-bmp");
		icon.setAttribute("title", title);
		icon.setAttribute("data-title-default", title);
		button.appendChild(icon);
		actions.insertBefore(button, actions.childNodes[0]);
		definition.classList.add("word-export-patched");
	}
}

(() => {
	window.addEventListener("message", ev => {
		// gets fired on search results render complete
		if (ev.data.action == "renderMulti.response")
			addWordCopyButtons();
	});
	window.addEventListener("keydown", ev => {
		if (ev.key != "c") return;
		if (ev.altKey != true) return;
		exportWord(document.getElementsByClassName("entry-current")[0]);
	});
})();

}
