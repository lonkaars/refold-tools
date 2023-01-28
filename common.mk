TO_SINGLE_LINE:=tr '\n' ' '
REMOVE_DOUBLE_SLASH_COMMENTS:=sed 's/\/\/.*$$//g'
REMOVE_SLASH_STAR_COMMENTS:=sed 's/\/\*[^\*]*\*\///g'
REMOVE_TABS:=sed 's/\t//g'
REMOVE_WHITESPACE:=sed 's/  */ /g'
TRIM_WHITESPACE:=sed -E 's/^\s*(.*)\s+$$/\1/g'

%.min.js: %.js
	cat $< | $(REMOVE_DOUBLE_SLASH_COMMENTS) | $(TO_SINGLE_LINE) | $(REMOVE_SLASH_STAR_COMMENTS) | $(REMOVE_TABS) | $(REMOVE_WHITESPACE) | $(TRIM_WHITESPACE) > $@

%.min.css: %.css
	cat $< | $(TO_SINGLE_LINE) | $(REMOVE_SLASH_STAR_COMMENTS) | $(REMOVE_TABS) | $(REMOVE_WHITESPACE) | $(TRIM_WHITESPACE) > $@

%.html: %.m4
	m4 $< > $@
