.PHONY: clean all

M4FLAGS += -I./assets/

all: yomichan-user.js yomichan-user.css

user.js: conf.d/lib.js
user.js: conf.d/sentence-export.js
user.css: conf.d/sentence-export.css
user.css: conf.d/custom.css
user.js: conf.d/word-export.js
user.css: conf.d/word-export.css
user.js: conf.d/shortcuts.js

include ../common.mk

assets/copy.svg.b64: assets/copy.svg
assets/copy-bitmap.svg.b64: assets/copy-bitmap.svg
GARBAGE += assets/copy.svg.b64
GARBAGE += assets/copy-bitmap.svg.b64

# extra dependencies
conf.d/sentence-export.css: assets/copy.svg.b64
conf.d/sentence-export.css: conf.d/sentence-export.css.m4
conf.d/word-export.css: assets/copy-bitmap.svg.b64

user.js:
	cat $^ > $@

user.css:
	cat $^ > $@

header.txt: header.txt.m4
header.txt: ../.git/HEAD

yomichan-user.js: header.txt user.min.js
	cat $^ > $@
yomichan-user.css: header.txt user.min.css
	cat $^ > $@

clean:
	$(RM) user.js user.css user.min.js user.min.css header.txt yomichan-user.css yomichan-user.js
	$(RM) $(GARBAGE)

