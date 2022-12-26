# anki sentence mining template

work in progress

## example

### input

|Field|Value|
|-|-|
|Complete sentence|`[家](うち)の{主}(あるじ)を*なめるなよ*…`|
|Target word reading|`舐める【なめる】`|
|Target word translation|`To underestimate`|
|Complete sentence translation|`Don't underestimate the master of the house...`|

### front

<div class="card front" align="center" style="border: solid 2px gray; padding: 10px;">
<span class="sentence parsed">家の<ruby>主<rt class="visible">あるじ</rt></ruby>を<b>なめるなよ</b>…</span>
</div>

### back

<div class="card back" align="center" style="border: solid 2px gray; padding: 10px;">
<span class="sentence parsed"><ruby>家<rt class="hidden">うち</rt></ruby>の<ruby>主<rt class="visible">あるじ</rt></ruby>を<b>なめるなよ</b>…</span>
<hr class="split">
<span class="target-word-reading">舐める【なめる】</span><br>
<span class="target-word-translation">To underestimate</span><br>
<span class="sentence-translation">Don't underestimate the master of the house...</span>
</div>

## set-up

i don't know how to create a teplate deck (if that's even a thing), so these
are instructions to apply to an empty deck.

1. run `make` to generate files
2. Under Tools > Manage note types > (note type here) > Fields, make sure the
   following fields exist (might be case-sensitive):
   | |name|description|
   |-|----|-----------|
   |1|Complete sentence|Complete sentence with furigana and target word in bold|
   |2|Target word reading|Dictionary reading of word (with word type)|
   |3|Target word translation|(In context) translation of target word|
   |4|Complete sentence translation|Complete sentence translation|
3. In the 'Browse' view, click on Cards... (you might need to create a
   temporary card in a deck) and paste the contents of front-template.html and
   back-template.html in the front template and back template of the card type.
   Make sure the Styling tab doesn't contain any code as this will override the
   built-in styles.
4. Profit

