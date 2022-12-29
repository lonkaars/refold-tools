all: back-template.html front-template.html

.PRECIOUS: card.min.js card.min.css
.PHONY: clean

include ../common.mk

back-template.html: card.min.js card.min.css
front-template.html: card.min.js card.min.css

clean:
	$(RM) back-template.html front-template.html card.min.js card.min.css
