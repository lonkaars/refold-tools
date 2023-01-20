function calculateTagHue(input) {
	var out = 0;
	for (var i = 0; i < input.length; i++)
		out ^= input.charCodeAt(i);
	return Math.floor((out * 12) % 360);
}

HTMLElement.prototype.parse = function() {
	if (this.classList.contains("parsed")) return; // ignore already parsed elements
	var input = this.innerHTML;
	var bold = false; // currently bold
	var italic = false; // currently italic
	var mode = "normal"; // normal, kanji, reading
	var out = ""; // output html
	var note_head = 0;
	var note_tail = 0;

	var alwaysvisisble = false; // if furigana is always visible (on front of card)
	var kanji = ""; // current kanji
	var reading = ""; // current kanji reading

	for (var i = 0; i < input.length; i++) {
		if (this.classList.contains("parse-format")) {
			// escape characters preceded by \
			if (input[i] == "\\") {
				var escaped = input[i+1];
				if (escaped == "n") escaped = "<br>"; // newline
				if (escaped == "t") escaped = "\t"; // tab
				out += escaped; i++; continue;
			}
			// parse *test* into <b>test</b>
			if (input[i] == "*") { bold = !bold; out += `<${bold ? "" : "/"}b>`; continue; }
			// parse _test_ into <i>test</i>
			if (input[i] == "_") { italic = !italic; out += `<${italic ? "" : "/"}i>`; continue; }
		}

		if (this.classList.contains("parse-furigana")) {
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
		}

		if (this.classList.contains("parse-brackets")) {
			if (i == 0) {
				// start kanji reading
				out += `<span class="kanji">`;

				var match = input.match(/\((.+?)\)/);
				// display "(note)" before kanji
				if (match) {
					out += `<span class="note">${match[1]}</span>`;
					note_head = match.index;
					note_tail = note_head + match[0].length;
				}
			}
			// ignore note if parsed
			else if (i == note_head) { i = note_tail - 1; continue; }
			// reading open bracket
			if (input[i] == '\u3010') { out += `</span><span class="reading"><span class="bracket">${input[i]}</span><span class="syllable">`; continue; }
			// reading closing bracket
			if (input[i] == '\u3011') { out += `</span><span class="bracket">${input[i]}</span></span>`; continue; }
			// interpunct (syllable separator)
			if (input[i] == '\u30fb') { out += `</span><span class="syllable-separator">${input[i]}</span><span class="syllable">`; continue; }
		}

		if (this.classList.contains("parse-tags")) {
			for (var tag of input.split(" "))
				out += `<span class="tag" style="--tag-hue: ${calculateTagHue(tag)};"><span class="inner">${tag}</span></span>`;
			break;
		}

		// add current character to selected mode buffer
		if (mode == "normal") out += input[i];
		if (mode == "kanji") kanji += input[i];
		if (mode == "reading") reading += input[i];
	}

	this.innerHTML = out;
	this.classList.add("parsed");
	if (input.length == 0) this.classList.add("empty");
};

function layout() {
	// set vertical layout on vertical displays (primarily mobile screens)
	var el = document.getElementById("card");
	if (screen.orientation.type.startsWith("landscape") && el.classList.contains("vertical-layout")) {
		el.classList.remove("vertical-layout");
		el.classList.add("horizontal-layout");
	} else if (screen.orientation.type.startsWith("portrait") && el.classList.contains("horizontal-layout")) {
		el.classList.remove("horizontal-layout");
		el.classList.add("vertical-layout");
	}
}

function run() {
	for (var el of document.getElementsByClassName("parse")) el.parse();

	// toggle spoiler by clicking
	for (var el of document.getElementsByClassName("spoiler")) {
		el.onclick = function () {
			this.classList.toggle("hidden");
			this.classList.toggle("visible");
		};
	}

	// remove spoiler from sentence translation if word reading field is empty
	if(document.getElementById("target-word-reading").classList.contains("empty")) {
		document.getElementById("sentence-translation").classList.remove("hidden");
	}

	layout();
}

run();
window.onload = () => run();
window.onresize = () => layout();
window.ondeviceorientation = () => layout();
