.PHONY: clean patch download backup yomichan
all: patch
download: yomichan
backup: download
patch: backup

# template rules in this file do not have explicit dependencies, this is to
# allow dependencies regardless of subdirectory. the dependencies are commented
# out instead for readability

include ../common.mk

yomichan-chrome.zip:
	curl https://github.com/FooSoft/yomichan/releases/latest/download/$@ -Lso- > $@

yomichan/images/%.svg: # %.svg
	cp $< $@

yomichan/css/%.css: # %.css
	cp $< $@

yomichan/js/%.js: # %.js
	cp $< $@

yomichan/%.patched: # %.bak %.diff
	patch -so - $(@:.patched=.bak) < $< > $@

# this rule must not depend on the original file, or the .bak will be made from
# an already patched file
yomichan/%.bak: # %
	cp $(@:.bak=) $@

yomichan: yomichan-chrome.zip
	unzip -qo $< -d $@


info.html.diff: info.html.diff.m4

# .diff patches
backup: yomichan/search.html.bak
yomichan/search.html.patched: search.html.diff
backup: yomichan/settings.html.bak
yomichan/settings.html.patched: settings.html.diff
backup: yomichan/info.html.bak
yomichan/info.html.patched: info.html.diff
backup: yomichan/css/action-popup.css.bak
yomichan/css/action-popup.css.patched: action-popup.css.diff

# updated extension manifest (allow userscript loading)
backup: yomichan/manifest.json.bak
yomichan/manifest.json.patched: yomichan/manifest.json.bak
	jq '.content_scripts[0].js[.content_scripts[0].js | length] |= .+ "js/userscript-loader.js"' $< |\
	jq '.content_security_policy |= .+ "'"; script-src 'self' 'unsafe-eval'"'"' |\
	jq '.content_security_policy |= sub("img-src";"img-src data:")' > $@
# userscript loader files
yomichan/js/userscript-loader.js: userscript-loader.js
yomichan/images/script.svg: script.svg
yomichan/css/userscript-settings.css: userscript-settings.css


# install userscript loader
patch: yomichan/js/userscript-loader.js
patch: yomichan/images/script.svg
patch: yomichan/css/userscript-settings.css
# .diff patches
patch: yomichan/search.html.patched
patch: yomichan/settings.html.patched
patch: yomichan/manifest.json.patched
patch: yomichan/info.html.patched
patch: yomichan/css/action-popup.css.patched
# move .patched to original filenames
patch:
	mv yomichan/search.html.patched yomichan/search.html
	mv yomichan/settings.html.patched yomichan/settings.html
	mv yomichan/info.html.patched yomichan/info.html
	mv yomichan/manifest.json.patched yomichan/manifest.json
	mv yomichan/css/action-popup.css.patched yomichan/css/action-popup.css

yomichan-chrome-patched.zip: clean patch
	zip -qr $@ yomichan

clean:
	$(RM) -r sentence-export.min.js yomichan yomichan-chrome.zip yomichan-chrome-patched.zip info.html.diff

