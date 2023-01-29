all:

.PHONY: clean patch download backup

include ../common.mk

yomichan/images/%.svg: %.svg
	cp $< $@

yomichan/css/%.css: %.css
	cp $< $@

yomichan/js/%.js: %.js
	cp $< $@

yomichan/%.patched: %.diff
	patch -so - $(@:.patched=) < $< > $@

yomichan/%.bak: yomichan/%
	cp $< $@

yomichan-chrome.zip:
	curl https://github.com/FooSoft/yomichan/releases/latest/download/$@ -Lso- > $@

yomichan: yomichan-chrome.zip
	unzip -qo yomichan-chrome.zip -d yomichan

yomichan/manifest.json.bak:
	cp yomichan/manifest.json $@

yomichan/search.html.bak:
	cp yomichan/search.html $@

yomichan/search.html.patched: search.html.diff
yomichan/settings.html.patched: settings.html.diff
yomichan/manifest.json.patched: yomichan/manifest.json.bak
	jq '.content_scripts[0].js[.content_scripts[0].js | length] |= .+ "js/userscript-loader.js"' $< |\
	jq '.content_security_policy |= .+ "'"; script-src 'self' 'unsafe-eval'"'"' |\
	jq '.content_security_policy |= sub("img-src";"img-src data:")' > $@

download: yomichan
backup: download
backup: yomichan/manifest.json.bak
backup: yomichan/search.html.bak
backup: yomichan/settings.html.bak
patch: backup
patch: yomichan/js/userscript-loader.js
patch: yomichan/images/script.svg
patch: yomichan/css/userscript-settings.css
patch: yomichan/search.html.patched
patch: yomichan/settings.html.patched
patch: yomichan/manifest.json.patched
patch:
	mv yomichan/search.html.patched yomichan/search.html
	mv yomichan/settings.html.patched yomichan/settings.html
	mv yomichan/manifest.json.patched yomichan/manifest.json

yomichan-chrome-patched.zip: patch
	zip -qr $@ $<

clean:
	$(RM) -r sentence-export.min.js yomichan yomichan-chrome.zip yomichan-chrome-patched.zip

