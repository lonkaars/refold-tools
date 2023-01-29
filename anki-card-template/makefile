all: back-template.html front-template.html

.PRECIOUS: card.min.js card.min.css
.PHONY: clean release

include ../common.mk

back-template.html: card.min.js card.min.css template.html.m4
front-template.html: card.min.js card.min.css template.html.m4

clean:
	$(RM) back-template.html front-template.html card.min.js card.min.css

