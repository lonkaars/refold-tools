function exportSentence() {
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
	navigator.clipboard.writeText(output);
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

function patchCSS() {
	var csslink = document.createElement("link");
	csslink.setAttribute("rel", "stylesheet");
	csslink.setAttribute("type", "text/css");
	csslink.setAttribute("href", "/css/sentence-export.css");
	document.head.appendChild(csslink);
}

function run() {
	if (document.body.classList.contains("patched")) return;

	patchSearchBar();
	patchCSS();

	document.body.classList.add("patched");
}

run();
window.onload = () => run();

