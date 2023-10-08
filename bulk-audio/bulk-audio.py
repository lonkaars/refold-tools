#!/bin/python3

import sys
import subprocess
import hashlib
import os
import re
import argparse
from math import floor, log10
import aqt

# this function only works for refold-tools sentence mining card template
pattern = re.compile("^([^[、 【]+)[^【]*(【(.+)】)?")
def note2kanji_kana(note):
  word = note["Target word reading"]
  result = pattern.search(word)
  if result == None: return (None, None)
  kanji = result.group(1)
  kana = result.group(3)
  if kanji == None: return (None, None)
  if kana == None: kana = kanji
  kana = kana.replace("・", "")
  return (kanji, kana)

def parse_args(argv):
  parser = argparse.ArgumentParser(
    description="Bulk Japanese audio downloader (refold-tools)",
    epilog="""This program calls Anki internally, so any CLI options supported
    by Anki are forwarded. Run `anki -h` to see available options""",
    formatter_class=argparse.ArgumentDefaultsHelpFormatter,
  )
  parser.usage = f"{argv[0]} [options] [anki options]"
  parser.add_argument("-n", "--note-type", help="note type to add audio to", default="Sentence mining")
  parser.add_argument("-a", "--audio-field", help="field name to modify with audio", default="Audio")
  parser.add_argument("-f", "--filename-prefix", help="download filename prefix", default="refold-tools-")
  return parser.parse_known_args(argv[1:])

def main():
  options, args = parse_args(sys.argv)
  args.insert(0, sys.argv[0]) # restore first index of argv (QT crashes if argv[] is empty)

  # forward remaining CLI parameters to Anki
  app = aqt._run(args, False)
  # load last open profile if no profile was specified on command line (option parsed by Anki)
  if not aqt.mw.pm.name:
    aqt.mw.pm.load(aqt.mw.pm.last_loaded_profile_name())
  col = aqt.Collection(aqt.mw.pm.collectionPath())
  media_dir = col.media.dir()

  model = col.models.by_name(options.note_type)
  note_ids = col.models.nids(model)

  edited_notes = 0

  for note_index, note_id in enumerate(note_ids):
    note = col.get_note(note_id)
    note_index_format = ("{:0" + str(floor(log10(len(note_ids))) + 1) + "d}/{:d}").format(note_index + 1, len(note_ids))
    print(f"[nid:{note_id}] ({note_index_format}) ", end="")

    # bulk clear audio field (dev only)
    # note[options.audio_field] = ""
    # note.flush()
    # print(f"cleared \"{options.audio_field}\" field!")
    # continue

    # autosave deck every 20 cards
    if note_index % 20 == 0: col.save()

    # skip any notes that already have audio
    if len(note[options.audio_field]) > 0:
      print("skipped -> audio field not empty")
      continue

    # parse kanji and kana info from note
    kanji, kana = note2kanji_kana(note)
    if kanji == None or kana == None:
      print("skipped -> can't parse kanji/kana from card")
      continue
    print(f"{kanji} ({kana}) ", end="")

    # attempt to download audio
    exit_code, data = get(kanji, kana)
    if exit_code != 0:
      note[options.audio_field] = "noaudio"
      note.flush()
      print("skipped -> no recording available, marked as 'noaudio'")
      continue

    # save audio if download was succesful
    digest = hashlib.sha1(data).hexdigest()
    filename = f"{options.filename_prefix}{digest}.mp3"
    output_path = os.path.join(media_dir, filename)
    with open(output_path, "wb+") as f:
      f.write(data)
      f.close()

    # set audio field to audio filename
    audio_str = f"[sound:{filename}]"
    note[options.audio_field] = audio_str
    note.flush()
    print(f"written audio as {audio_str}")
    edited_notes += 1

  # save collection (and exit)
  col.save()
  if edited_notes == 0:
    print("-- Done: no edits --")
  else:
    print(f"-- Done: succesfully edited {edited_notes} note{'' if edited_notes == 1 else 's'} --")
  print("TODO: circumvent below error message (anki python api problems, notes were edited succesfully though):")

# run ./get to get audio data from stdout
# returns (exit_code, stdout_data)
def get(kanji, kana):
  p = subprocess.run(["./get", kanji, kana], capture_output=True)
  if p.returncode != 0:
    return (1, None)
  return (0, p.stdout)

if __name__ == "__main__":
  main()

