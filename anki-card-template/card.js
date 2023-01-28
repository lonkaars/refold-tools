function charNotLatin(input) {
	var code = input.charCodeAt(0);
	if (0x0000 <= code && code <= 0x007f) return false; // basic latin
	return true;
}

function charNotJapanese(input) {
	var code = input.charCodeAt(0);
	if (0x3000 <= code && code <= 0x303f) return false; // japanese punctuation
	if (0x3040 <= code && code <= 0x309f) return false; // hiragana
	if (0x30a0 <= code && code <= 0x30ff) return false; // katakana
	if (0xff00 <= code && code <= 0xffef) return false; // full-width latin + half-width katakana
	if (0x4e00 <= code && code <= 0x9faf) return false; // kanji
	return true;
}

function calculateTagHue(input) {
	var out = 0;
	for (var i = 0; i < input.length; i++)
		out ^= input.charCodeAt(i);
	return Math.floor((out * 12) % 360);
}

function HTMLtoParseArr(input) {
	var out = [];
	var node = { data: "", type: "text" };
	var tag_open = false;
	var new_node = false;

	var clear = () => {
		out.push(node);
		node = { data: "", type: "text" };
	};

	for (var i = 0; i < input.length; i++) {
		new_node = false;
		if (input[i] == "<") {
			clear();
			tag_open = true;
			node.type = "html";
		}
		if (input[i] == ">" && tag_open == true) {
			tag_open = false;
			node.data += input[i];
			clear();
			continue;
		}

		node.data += input[i];
	}
	if (new_node == false) out.push(node);

	return out;
}

function parseOnTextOnly(nodes, parseFn) {
	for (var node of nodes) {
		if (node.type == "html") continue;
		node.data = parseFn(node.data);
	}
	return HTMLtoParseArr(nodes.map(n => n.data).join("")); // re-parse for newly created html
}

function parseFormat(nodes) {
	return parseOnTextOnly(nodes, input => {
		var bold = false; // currently bold
		var italic = false; // currently italic
		var out = "";
		for (var i = 0; i < input.length; i++) {
			// escape characters preceded by \
			if (input[i] == "\\") {
				var escaped = input[i+1];
				if (escaped == "n") { out += "<br>"; i++; continue; } // newline
				if (escaped == "t") { out += "\t"; i++; continue; } // tab
				if (escaped == "*") { out += "*"; i++; continue; } // bold
				if (escaped == "_") { out += "_"; i++; continue; } // italic
				if (escaped == "\\") { out += "\\"; i++; continue; } // literal backslash
			}
			// parse *test* into <b>test</b>
			if (input[i] == "*") { bold = !bold; out += `<${bold ? "" : "/"}b>`; continue; }
			// parse _test_ into <i>test</i>
			if (input[i] == "_") { italic = !italic; out += `<${italic ? "" : "/"}i>`; continue; }

			out += input[i];
		}
		return out;
	});
}

function parseIndicators(nodes) {
	return parseOnTextOnly(nodes, input => {
		var indicator = false; // indicator is open
		var content = ""; // indicator content
		var stamp = ""; // filled if indicator has stamp
		var out = "";
		for (var i = 0; i < input.length; i++) {
			// escape characters preceded by \
			if (input[i] == "\\") {
				var escaped = input[i+1];
				if (escaped == "[") { out += "["; i++; continue; }
				if (escaped == "]") { out += "]"; i++; continue; }
				if (escaped == "-" && indicator) { content += "-"; i++; continue; }
				if (escaped == "\\") { out += "\\"; i++; continue; }
			}

			if (input[i] == "[") { indicator = true; out += `<span class="indicator">`; continue; }
			if (input[i] == "]" && indicator) {
				indicator = false;
				if (stamp) out += `<span class="stamp">${stamp}</span>`;
				out += `<span class="content">${content}</span></span>`;
				content = "";
				stamp = "";
				continue;
			}
			if (input[i] == "-" && indicator) { stamp = content; content = ""; continue; }

			if (indicator) content += input[i];
			else out += input[i];
		}
		return out;
	});
}

function parseFurigana(nodes) {
	return parseOnTextOnly(nodes, input => {
		var mode = "normal"; // normal, kanji, reading
		var out = ""; // output html
		var alwaysvisisble = false; // if furigana is always visible (on front of card)
		var kanji = ""; // current kanji
		var reading = ""; // current kanji reading
		var normal = ""; // normal text
		var flush_normal = () => { out += `<span class="normal">${normal}</span>`; normal = ""; };

		for (var i = 0; i < input.length; i++, lastmode = mode) {
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
				flush_normal();
				mode = "normal";
				out += `<ruby>${kanji}<rt class="${alwaysvisisble ? 'visible' : 'hidden'}">${reading}</rt></ruby>`;
				continue;
			}

			// add current character to selected mode buffer
			if (mode == "normal") normal += input[i];
			if (mode == "kanji") kanji += input[i];
			if (mode == "reading") reading += input[i];
		}
		flush_normal();
		return out;
	});
}

function parseReading(nodes) {
	return parseOnTextOnly(nodes, input => {
		var note_head = 0;
		var note_tail = 0;
		var out = ""; // output html

		for (var i = 0; i < input.length; i++) {
			if (i == 0) {
				// start kanji reading
				out += `<span class="kanji">`;

				var match = input.match(/\((.+?)\)/);
				// display "(note)" before kanji
				if (match) {
					out += `<span class="note subtile">${match[1]}</span>`;
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

			out += input[i];
		}
		return out;
	});
}

function parseTags(nodes) {
	var out = "";
	for (var tag of nodes.map(n => n.data).join("").split(" "))
		out += `<span class="tag" style="--tag-hue: ${calculateTagHue(tag)};"><span class="inner">${tag}</span></span>`;
	return HTMLtoParseArr(out);
}

function parseDefinitions(nodes) {
	out = `<ul class="definitions"><li class="definition">`;
	var subtile = false; // current text is subtile
	var parenthesis = false; // current text is surrounded by parenthesis

	for (var node of nodes) {
		if (node.type == "html") {
			out += node.data;
			continue;
		}

		var input = node.data;
		for (var i = 0; i < input.length; i++) {
			// escape characters preceded by \
			if (input[i] == "\\") {
				var escaped = input[i+1];
				if (escaped == "{") { out += "{"; i++; continue; }
				if (escaped == "}") { out += "}"; i++; continue; }
				if (escaped == ",") { out += ","; i++; continue; }
				if (escaped == "(") { out += "("; i++; continue; }
				if (escaped == ")") { out += ")"; i++; continue; }
				if (escaped == "\\") { out += "\\"; i++; continue; }
			}

			// subtile brackets
			if (input[i] == "{") { subtile = true; out += `<span class="subtile">`; continue; }
			if (input[i] == "}" && subtile) { subtile = false; out += `</span>`; continue; }

			// definition separator
			if (input[i] == "," && !subtile && !parenthesis) {
				out += `</li><li class="definition-separator"></li><li class="definition">`;
				continue;
			}

			// ignore comma's starting new definition in parenthesis
			if (input[i] == "(") parenthesis = true;
			if (input[i] == ")") parenthesis = false;

			out += input[i];
		}
	}

	out += `</li></ul>`;
	return HTMLtoParseArr(out);
}

function parseScript(nodes) {
	return parseOnTextOnly(nodes, input => {
		if (input.length == 0) return input;

		var lastScript = "unknown";
		var out = "";
		for (var i = 0; i < input.length; i++) {
			var script = "unknown";
			if (!charNotJapanese(input[i])) script = "japanese";
			if (!charNotLatin(input[i])) script = "latin";

			if (i == 0) out += `<span class="script-${script}">`;
			else if (script != lastScript) out += `</span><span class="script-${script}">`;

			out += input[i];
			lastScript = script;
		}
		return out + "</span>";
	});
}

function setSpoiler(nodes) {
	return HTMLtoParseArr(`<span class="outer"><span class="inner">` + nodes.map(n => n.data).join("") + "</span></span>");
}

HTMLElement.prototype.parse = function() {
	if (this.classList.contains("parsed")) return; // ignore already parsed elements
	var input = this.innerHTML; // get raw data from anki field
	var nodes = HTMLtoParseArr(input); // seperate user text from html formatting (keep html intact)

	// parsers
	if (this.classList.contains("parse-format")) nodes = parseFormat(nodes);
	if (this.classList.contains("parse-furigana")) nodes = parseFurigana(nodes);
	if (this.classList.contains("parse-reading")) nodes = parseReading(nodes);
	if (this.classList.contains("parse-indicators")) nodes = parseIndicators(nodes);
	if (this.classList.contains("parse-tags")) nodes = parseTags(nodes);
	if (this.classList.contains("parse-definitions")) nodes = parseDefinitions(nodes);
	if (this.classList.contains("parse-script")) nodes = parseScript(nodes);
	if (this.classList.contains("spoiler")) nodes = setSpoiler(nodes);

	// join parsed text with unmodified html
	var out = nodes.map(n => n.data).join("");
	this.innerHTML = out;
	this.classList.add("parsed");
	if (nodes.reduce((current, n) => current + (n.type == "text" ? n.data.length : 0), 0) == 0)
		this.classList.add("empty"); // if innerHTML only contains empty html (no 'user' text)
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
	for (var el of document.getElementsByClassName("parse"))
		el.parse();

	// toggle spoiler by clicking
	for (var el of document.getElementsByClassName("spoiler"))
		el.onclick = function () {
			this.classList.toggle("hidden");
			this.classList.toggle("visible");
		};

	// remove spoiler from sentence translation if word reading field is empty
	if(document.getElementById("target-word-reading").classList.contains("empty"))
		document.getElementById("sentence-translation").classList.remove("hidden");

	layout();
}

run();
window.onload = () => run();
window.onresize = () => layout();
window.ondeviceorientation = () => layout();
window.screen.orientation.onchange = () => layout();

