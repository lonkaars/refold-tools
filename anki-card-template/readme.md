# anki sentence mining template

work in progress

this is an anki card template for sentence mining. it has fields for a foreign
sentence, foreign word, translated word and an optional translated sentence. it
supports a markdown-like [syntax](#syntax) for adding furigana that is visible
on either both sides or only on the back side.

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

## syntax

html is passed through, so inline styling (should) still work.

|input|html output|example|
|-|-|-|
|`[kanji](furigana)`|`<ruby>kanji<rt>furigana</rt></ruby>`<br>(furigana visible on back side only)|<ruby>kanji<rt>furigana</rt></ruby>|
|`{kanji}(furigana)`|`<ruby>kanji<rt>furigana</rt></ruby>`<br>(furigana visible on both sides)|<ruby>kanji<rt>furigana</rt></ruby>|
|`*text*`|`<b>text</b>` (bold)|<b>text</b>|
|`a\nb`|`a<br>b` (line break)|a<br>b|
|`\\`|`\` (backslash)|\\|
|`\[escaped](this)`|`[escaped](this)` (escaped furigana)|\[escaped](this)|

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
4. You can add any custom styles you want in the Styling tab, but I recommend
   you remove the default CSS.
5. Profit

This card template is also compatible with AnkiDroid, but you need to add
`.night_mode { }` to the Styling tab for this to work. For some reason
AnkiDroid checks if the card has dark mode 'support' by checking if the Styling
tab CSS contains the literal string `.night_mode`. [The
documentation](https://docs.ankiweb.net/templates/styling.html#night-mode)
suggests that the night mode CSS class is called `nightMode` instead of
`night_mode`, but `night_mode` works fine on desktop too, so is used in this
card template.

