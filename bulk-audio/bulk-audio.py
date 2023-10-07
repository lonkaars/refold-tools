#!/bin/python3

import sys
import subprocess
import hashlib
import os
import re
from math import floor, log10

import aqt

# change these variables
AUDIO_FILENAME_PREFIX = "refold-tools-"
# the anki user to which notes of type NOTE_TYPE belong
ANKI_USER = "ルーク"
# the note type name of notes that should get audio fields filled in (see Tools > Manage note types)
NOTE_TYPE = "Sentence mining"
# field name to be filled with "[audio:...]" or "noaudio"
AUDIO_FIELD_NAME = "Audio"

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

def main():
  ANKI_PATH = os.path.join(os.environ["XDG_DATA_HOME"], "Anki2", ANKI_USER)
  ANKI_COLLECTION = os.path.join(ANKI_PATH, "collection.anki2")
  ANKI_MEDIA = os.path.join(ANKI_PATH, "collection.media")
  col = aqt.Collection(ANKI_COLLECTION)

  model = col.models.by_name(NOTE_TYPE)
  note_ids = col.models.nids(model)

  for note_index, note_id in enumerate(note_ids):
    note = col.get_note(note_id)
    note_index_format = ("{:0" + str(floor(log10(len(note_ids))) + 1) + "d}/{:d}").format(note_index + 1, len(note_ids))
    print(f"[{note_index_format}] ", end="")

    # bulk clear audio field (dev only)
    # note[AUDIO_FIELD_NAME] = ""
    # note.flush()
    # print(f"cleared \"{AUDIO_FIELD_NAME}\" field!")
    # continue

    # autosave deck every 20 cards
    if note_index % 20 == 0: col.save()

    # skip any notes that already have audio
    if len(note[AUDIO_FIELD_NAME]) > 0:
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
      note[AUDIO_FIELD_NAME] = "noaudio"
      note.flush()
      print("skipped -> no recording available, marked as 'noaudio'")
      continue

    # save audio if download was succesful
    digest = hashlib.sha1(data).hexdigest()
    filename = f"{AUDIO_FILENAME_PREFIX}{digest}.mp3"
    output_path = os.path.join(ANKI_MEDIA, filename)
    with open(output_path, "wb+") as f:
      f.write(data)
      f.close()

    # set audio field to audio filename
    audio_str = f"[sound:{filename}]"
    note[AUDIO_FIELD_NAME] = audio_str
    note.flush()
    print(f"written audio as {audio_str}")

  # save collection (and exit)
  col.save()

# run ./get to get audio data from stdout
# returns (exit_code, stdout_data)
def get(kanji, kana):
  p = subprocess.run(["./get", kanji, kana], capture_output=True)
  if p.returncode != 0:
    return (1, None)
  return (0, p.stdout)

if __name__ == "__main__":
  main()

