function parseSentence(input) {
	var bold = false; // currently bold
	var mode = "normal"; // normal, kanji, reading
	var out = ""; // output html

	var kanji = ""; // current kanji
	var reading = ""; // current kanji reading

	for (var i = 0; i < input.length; i++) {
		// escape all characters preceded by \
		if (input[i] == "\\") { out += input[i+1]; i++; continue; }
		// parse *test* into <b>test</b>
		if (input[i] == "*") { bold = !bold; out += `<${bold ? "" : "/"}b>`; continue; }

		// parse [kanji](reading) into ruby text
		if (mode == "normal" && input[i] == "[") { kanji = ""; mode = "kanji"; continue; }
		if (mode == "kanji" && input[i] == "]") { mode = "normal"; continue; }
		if (mode == "normal" && kanji.length > 0 && input[i-1] == "]" && input[i] == "(") { reading = ""; mode = "reading"; continue; }
		if (mode == "reading" && input[i] == ")") { mode = "normal"; out += `<ruby>${kanji}<rt>${reading}</rt></ruby>`; continue; }

		// add current character to selected mode buffer
		if (mode == "normal") out += input[i];
		if (mode == "kanji") kanji += input[i];
		if (mode == "reading") reading += input[i];
	}

	return out;
}

function run() {
	var sentences = document.getElementsByClassName("sentence");

	for (var sentence of sentences)
		sentence.innerHTML = parseSentence(sentence.innerText);
}

run();
