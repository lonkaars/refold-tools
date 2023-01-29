include(`common.m4')dnl
<!-- lonkaars anki card template version VERSION()
     generated at TIMESTAMP()
     https://git.pipeframe.xyz/lonkaars/refold-tools -->

<div id="card" class="CARD_SIDE() vertical-layout">
<div id="front">
<span id="sentence" class="parse parse-furigana parse-format foreign">{{Complete sentence}}</span>
</div>
<hr id="separator">
<div id="back">
<span id="target-word-reading" class="parse parse-format parse-reading parse-indicators parse-script foreign">{{Target word reading}}</span>
<span id="target-word-translation" class="parse parse-format parse-definitions parse-indicators parse-script native">{{Target word translation}}</span>
<span id="sentence-translation" class="parse parse-format native spoiler parse-script hidden">{{Complete sentence translation}}</span>
<span id="tags" class="parse parse-tags">{{Tags}}</span>
</div>
</div>

<style>undivert(`card.min.css')</style>
<script defer>undivert(`card.min.js')</script>
