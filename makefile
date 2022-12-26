all: back-template.html front-template.html

.PRECIOUS: card.min.js

card.min.js: card/card.js
	sed 's/\/\/.*$$//g' $< | tr '\n' ' ' | sed 's/\t//g' | sed 's/  */ /g' > $@

%.html: %.m4
	m4 $< > $@

back-template.html: card.min.js card/card.css
front-template.html: card.min.js card/card.css

clean:
	$(RM) back-template.html front-template.html card.min.js
