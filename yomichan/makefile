all:

.PHONY: clean patch update

include ../common.mk

yomichan/js/user.js: sentence-export.min.js yomichan
	ln -sf ../../$< $@

yomichan-chrome.zip:
	curl https://github.com/FooSoft/yomichan/releases/latest/download/$@ -Lso- > $@

yomichan: yomichan-chrome.zip
	unzip -qo yomichan-chrome.zip -d yomichan

yomichan/manifest.json.bak: yomichan/manifest.json
	mv $< $@
	jq '.content_scripts[0].js[.content_scripts[0].js | length] |= .+ "js/user.js"' $@ > $<

yomichan/search.html.bak: yomichan/search.html
	mv $< $@
	sed 's#</body>#<script defer src="/js/user.js"></script>\n</body>#' $@ > $<

patch: yomichan yomichan/search.html.bak yomichan/manifest.json.bak

update: yomichan

clean:
	$(RM) sentence-export.min.js sentence-export.src

