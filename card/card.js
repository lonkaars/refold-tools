function parseSentence(input) {
	var bold = false; // currently bold
	var mode = "normal"; // normal, kanji, reading
	var out = ""; // output html

	var alwaysvisisble = false; // if furigana is always visible (on front of card)
	var kanji = ""; // current kanji
	var reading = ""; // current kanji reading

	for (var i = 0; i < input.length; i++) {
		// escape characters preceded by \
		if (input[i] == "\\") {
			var escaped = input[i+1];
			if (escaped == "n") escaped = "<br>"; // newline
			out += escaped; i++; continue;
		}
		// parse *test* into <b>test</b>
		if (input[i] == "*") { bold = !bold; out += `<${bold ? "" : "/"}b>`; continue; }

		// parse [kanji](reading) into ruby text
		// [kanji](reading) is only visible on card back
		// {kanji}(reading) is always visible
		if (mode == "normal" && input[i] == "[") // hidden reading kanji open
			{ kanji = ""; mode = "kanji"; alwaysvisisble = false; continue; }
		if (mode == "normal" && input[i] == "{") // always visible reading kanji open
			{ kanji = ""; mode = "kanji"; alwaysvisisble = true; continue; }
		if (mode == "kanji" && input[i] == "]") continue; // hidden reading kanji close
		if (mode == "kanji" && input[i] == "}") continue; // always visible reading kanji close
		if (mode == "kanji" && kanji.length > 0 && input[i] == "(") // reading open
			{ reading = ""; mode = "reading"; continue; }
		if (mode == "reading" && input[i] == ")") { // reading close
			mode = "normal";
			out += `<ruby>${kanji}<rt class="${alwaysvisisble ? 'visible' : 'hidden'}">${reading}</rt></ruby>`;
			continue;
		}

		// add current character to selected mode buffer
		if (mode == "normal") out += input[i];
		if (mode == "kanji") kanji += input[i];
		if (mode == "reading") reading += input[i];
	}

	return out;
}

function run() {
	var input = document.getElementsByClassName("parse");

	for (var el of input) {
		if (el.classList.contains("parsed")) continue;
		el.innerHTML = parseSentence(el.innerHTML);
		el.classList.remove("parse");
		el.classList.add("parsed");
	}
}

run();
window.onload = () => run();
