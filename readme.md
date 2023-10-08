# refold tools

this is a repo with refold language learning stuff (primarily japanese):

- [anki sentence mining card template](anki-card-template/)
- [bulk audio adder](bulk-audio/)
- [yomichan user.js patch](yomichan/)  
- [yomichan stuff](yomichan-user/)  
  (custom theme, sentence export/copy button plugin)

## todo

- yomichan handwriting popup/input like in google translate using
  [handwriting.js](https://github.com/ChenYuHo/handwriting.js)
- edit(/add?) generated readings in yomichan
- add dictionary items to yomichan
- blacklist dictionary items from affecting generated readings
- standalone yomichan server/api (yomichan is deprecated and will stop working
  once manifest v2 support is removed from chromium)

i'm not sure if i'll find the motivation or time to work on a standalone
yomichan-type server, but if i do, it's the first thing on this list i'll
likely attempt to implement as yomichan is being deprecated. existing hacks in
this repo are focused primarily on improving my sentence mining workflow, but
yomichan is primarily a lookup dictionary, with automatic anki card generation
kind of shoehorned in. a rewritten frontend with separate modes for popup
dictionary lookups, full dictionary lookups and sentence mining would be
better.

