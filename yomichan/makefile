all: sentence-export.min.js

.PHONY: clean patch

include ../common.mk

yomichan/js/user.js: yomichan sentence-export.min.js
	ln -sf ../../sentence-export.min.js $@

yomichan-chrome.zip:
	curl https://github.com/FooSoft/yomichan/releases/latest/download/$@ -Lso- > $@

yomichan: yomichan-chrome.zip
	unzip -qo yomichan-chrome.zip -d yomichan

yomichan/manifest.json.bak:
	cp yomichan/manifest.json $@

yomichan/search.html.bak:
	cp yomichan/search.html $@

yomichan/manifest-patched.json: yomichan/manifest.json.bak
	jq '.content_scripts[0].js[.content_scripts[0].js | length] |= .+ "js/user.js"' $< > $@

yomichan/search-patched.html: yomichan/search.html.bak
	sed 's#</body>#<script defer src="/js/user.js"></script>\n</body>#' $< > $@

yomichan/images/%.svg: %.svg
	ln -sf ../../copy.svg $@

yomichan/css/%.css: %.css
	ln -sf ../../$< $@

patch: yomichan
patch: yomichan/search-patched.html
patch: yomichan/manifest-patched.json
patch: yomichan/js/user.js
patch: yomichan/images/copy.svg
patch: yomichan/css/sentence-export.css
patch:
	ln -sf search-patched.html yomichan/search.html
	ln -sf manifest-patched.json yomichan/manifest.json

clean:
	$(RM) -r sentence-export.min.js yomichan yomichan-chrome.zip

