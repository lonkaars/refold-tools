include(`common.m4')dnl
<!-- lonkaars anki card template version VERSION()
     generated at TIMESTAMP()
     https://git.pipeframe.xyz/lonkaars/refold-tools -->

<div id="card" class="CARD_SIDE() vertical-layout">
<div id="front">
<span id="sentence" class="parse parse-furigana parse-format parse-script foreign">{{Complete sentence}}</span>
</div>
<hr id="separator">
<div id="back">
<span class="flex-line">
<span id="target-word-reading" class="parse parse-format parse-reading parse-indicators parse-script foreign">{{Target word reading}}</span>
<span id="audio">{{ Audio }}</span>
</span>
<span id="target-word-translation" class="parse parse-format parse-definitions parse-indicators parse-script native">{{Target word translation}}</span>
<span id="sentence-translation" class="parse parse-format native spoiler parse-script hidden">{{Complete sentence translation}}</span>
<span id="tags" class="parse parse-tags">{{Tags}}</span>
</div>
</div>

<svg id="play-icon" class="display-none" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/></svg>

<style>undivert(`card.min.css')</style>
<script defer>undivert(`card.min.js')</script>
