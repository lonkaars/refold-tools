.PHONY: clean

all: yomichan-user.js yomichan-user.css

user.js: conf.d/lib.js
user.js: conf.d/sentence-export.js
user.css: conf.d/sentence-export.css
user.css: conf.d/custom.css
user.js: conf.d/word-export.js
user.css: conf.d/word-export.css
user.js: conf.d/shortcuts.js

include ../common.mk

copy.svg.b64: copy.svg
copy-bitmap.svg.b64: copy-bitmap.svg

conf.d/sentence-export.css: copy.svg.b64
conf.d/sentence-export.css: conf.d/sentence-export.css.m4

conf.d/word-export.css: copy-bitmap.svg.b64

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

