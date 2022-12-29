# yomichan stuff

## custom css

this is just a custom theme, and can be easily installed by pasting the
contents of [custom.css](custom.css) into yomichan's settings.

## sentence export

this patches the yomichan plugin files to add an export button to the search
bar for copying a sentence with furigana into my custom anki card template.

![new copy button in yomichan search bar](../assets/copy-button-yomichan.png)
![copied sentence in anki](../assets/copy-button-anki.png)

### set-up

to download the latest yomichan version and patch it, leaving all files exposed
for later updating (unpacked extension), run the following command:

```
make patch
```

to patch yomichan and convert it back to a zip (packed extension, non-signed,
for use with kiwi browser), run:

```
make yomichan-chrome-patched.zip
```

if you want to update the patch or zip, replace `make` with `make -B`.
