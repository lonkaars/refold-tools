# Bulk audio adder

This is a Python and POSIX shell script that downloads native speaker audio for
words from the same sources as Yomichan by default. The `./get` script is
responsible for actually downloading the audio for a word, and can easily be
modified to work for languages other than Japanese. The default sources are:

- JapanesePod101
- JapanesePod101 (Alternate)
- Jisho\.org

No Python dependencies should have to be installed, as this script only relies
on built-in Python libraries and the `aqt` library, which should get installed
alongside Anki.

The `./get` script (should) also work on Windows under Git Bash or Msys2, but
uses `pup` to parse HTML for the `lp101_alt` source. Disabling this source, or
installing `pup` should work.

## Usage

See `./bulk-audio.py -h` for all options. The default options add audio to
notes with an empty Audio field. If a clip can't be found for the note, the
Audio field will be set to "noaudio". This script can be customized to work
with other note types, but works with [my custom anki card
template](../anki-card-template) by default.

|command|action|
|-|-|
|`./bulk-audio.py`|Download audio for all notes with empty Audio field|
|`./bulk-audio.py -nO`|Try to download audio again for notes with "noaudio" Audio field|
|`./bulk-audio.py -C`|Clear all Audio fields|
|`./bulk-audio.py -q flag:1 -O -s lp101_alt`|Override audio of all notes with red flag with audio from JapanesePod101 (Alternate)|

## `./bulk-audio.py -h`

```
usage: ./bulk-audio.py [options] [anki options]

Bulk Japanese audio downloader (refold-tools)

options:
  -h, --help            show this help message and exit
  -t NOTE_TYPE, --note-type NOTE_TYPE
                        note type to add audio to (default: Sentence mining)
  -a AUDIO_FIELD, --audio-field AUDIO_FIELD
                        field name to modify with audio (default: Audio)
  -f FILENAME_PREFIX, --filename-prefix FILENAME_PREFIX
                        download filename prefix (default: refold-tools-)
  -s SOURCE_LIST, --source-list SOURCE_LIST
                        set source list (see `./get -h`) (default: None)
  -O, --force-override  force override audio field, even if it is not empty
                        (default: False)
  -C, --clear-audio     CLEARS ALL AUDIO FIELDS REGARDLESS OF VALUE (default:
                        False)
  -n, --noaudio         only modify notes that have "noaudio" as AUDIO_FIELD
                        value (default: False)
  -i NOTE_ID, --note-id NOTE_ID
                        select specific note (specify multiple times to select
                        multiple notes) (default: [])
  -d, --dry-run         print only, do not edit anything (default: False)
  -q QUERY, --query QUERY
                        filter notes by search query (default: None)

This program calls Anki internally, so any CLI options supported by Anki are
forwarded. Run `anki -h` to see available options
```

## `./get -h`

```
usage: ./get [OPTIONS] <KANJI> <KANA> > <OUTPUT>

attempt to download a native Japanese recording of word written as KANJI and
read as KANA. outputs mp3 to stdout. return value is 0 if OUTPUT was written
(clip was found), and 1 if no clip could be found.

options:
	-s <source1[,source2,...]>    set source order (default: lp101,lp101_alt,jisho)
	-h                            show help

sources:
	lp101        JapanesePod101
	lp101_alt    JapanesePod101 (Alternate)
	jisho        Jisho.org

```
