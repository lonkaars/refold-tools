{

function patchSearchBar() {
	var searchBarOuter = document.getElementsByClassName("search-textbox-container")[0];
	var button = document.createElement("button");
	button.id = "handwriting-input-toggle";
	button.classList.add("search-button");
	button.onclick = () => console.log("AAAA");
	var icon = document.createElement("span");
	icon.classList.add("icon");
	icon.setAttribute("data-icon", "draw");
	button.appendChild(icon);
	searchBarOuter.insertBefore(button, searchBarOuter.childNodes[2]);
}

(() => {
	if (document.body.classList.contains("handwriting-patched")) return;

	patchSearchBar();

	document.body.classList.add("handwriting-patched");
})();

}
