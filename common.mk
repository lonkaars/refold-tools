%.min.js: %.js
	sed 's/\/\/.*$$//g' $< | tr '\n' ' ' | sed 's/\t//g' | sed 's/  */ /g' > $@

%.min.css: %.css
	cat $< | tr '\n' ' ' | sed 's/\t//g' | sed 's/  */ /g' > $@

%.html: %.m4
	m4 $< > $@
