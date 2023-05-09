M4FLAGS += -I..

JSMIN ?= ../scripts/js2min
CSSMIN ?= ../scripts/css2min

%.min.js: %.js
	$(JSMIN) $< > $@

%.min.css: %.css
	$(CSSMIN) $< > $@

%: %.m4
	m4 $(M4FLAGS) $< > $@

%.b64: %
	base64 -w0 $< > $@

