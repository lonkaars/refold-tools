# Bulk audio adder

This is a Python and POSIX shell script that downloads native speaker audio for
words from the same sources as Yomichan:

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

