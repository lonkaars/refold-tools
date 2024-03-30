(() => {
	window.addEventListener("keydown", ev => {
		if (ev.altKey != true) return;
		if (ev.code == "KeyJ" || ev.code == "KeyK") {
			// alt j/k for moving up/down entries
			var currentEntry = document.getElementsByClassName("entry-current")[0];
			var sibling = currentEntry[ev.code == "KeyJ" ? "nextSibling" : "previousSibling"];
			if (sibling == null) return;
			currentEntry.classList.remove("entry-current");
			sibling.classList.add("entry-current");
			sibling.scrollIntoView({ behavior: "smooth", block: "center" });
		}
		else if (ev.code == "KeyG") {
			// g for going back to top
			document.getElementById("content-scroll").scrollTo({ top: 0, behavior: "smooth" });
		}
	});
})();
