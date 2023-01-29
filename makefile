ARTIFACTS := yomichan/yomichan-chrome-patched.zip \
	yomichan-user/yomichan-user.css \
	yomichan-user/yomichan-user.js \
	anki-card-template/back-template.html \
	anki-card-template/front-template.html

all: $(ARTIFACTS)

yomichan/yomichan-chrome-patched.zip:
	make -BC yomichan yomichan-chrome-patched.zip

anki-card-template/back-template.html anki-card-template/front-template.html:
	make -BC anki-card-template

yomichan-user/yomichan-user.css yomichan-user/yomichan-user.js:
	make -BC yomichan-user

release: $(ARTIFACTS)
	gh release create --latest -t "`git describe --tags`" `git describe --tags` $^
