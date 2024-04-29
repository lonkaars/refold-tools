#!/bin/python3
import sys
import subprocess
import hashlib
import os
import re
import io
import argparse
from math import floor, log10
from time import sleep
from pathlib import Path

real_stdout = sys.stdout
class TrashFileIO(object):
  def write(self, x): pass
  def flush(self): pass
trash_out = TrashFileIO()

# replace stderr file descriptor with /dev/null
os.dup2(os.open(os.devnull, os.O_WRONLY), 2)
# this is the lowest level hack i could find that silences QT errors for
# subprocesses too

sys.stdout = trash_out
import aqt
sys.stdout = real_stdout

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
  parser.add_argument("-t", "--note-type", help="note type to add audio to", default="Sentence mining")
  parser.add_argument("-a", "--audio-field", help="field name to modify with audio", default="Audio")
  parser.add_argument("-f", "--filename-prefix", help="download filename prefix", default="refold-tools-")
  parser.add_argument("-s", "--source-list", help="set source list (see `./get -h`)", default=None)
  parser.add_argument("-O", "--force-override", help="force override audio field, even if it is not empty", action='store_true')
  parser.add_argument("-C", "--clear-audio", help="CLEARS ALL AUDIO FIELDS REGARDLESS OF VALUE", action='store_true')
  parser.add_argument("-n", "--noaudio", help="only modify notes that have \"noaudio\" as AUDIO_FIELD value", action='store_true')
  parser.add_argument("-i", "--note-id", help="select specific note (specify multiple times to select multiple notes)", action='append', nargs=1, default=[])
  parser.add_argument("-d", "--dry-run", help="print only, do not edit anything", action='store_true')
  parser.add_argument("-q", "--query", help="filter notes by search query", default=None)
  return parser.parse_known_args(argv[1:])

def main():
  options, args = parse_args(sys.argv)
  args.insert(0, sys.argv[0]) # restore first index of argv (QT crashes if argv[] is empty)

  if options.clear_audio:
    print("Safety delay of 3 seconds (are you sure you want to clear ALL audio fields?)...")
    print("Press Ctrl+C to cancel")
    sleep(3)

  # forward remaining CLI parameters to Anki
  sys.stdout = trash_out
  app = aqt._run(args, False)
  sys.stdout = real_stdout
  if aqt.mw == None:
    print("Please close any open Anki windows before running this script!")
    sys.stdout = trash_out
    exit(1)

  # load last open profile if no profile was specified on command line (option parsed by Anki)
  if not aqt.mw.pm.name:
    aqt.mw.pm.load(aqt.mw.pm.last_loaded_profile_name())
  col = aqt.Collection(aqt.mw.pm.collectionPath())
  media_dir = col.media.dir()

  model = col.models.by_name(options.note_type)
  note_ids = col.models.nids(model)

  # filter list if note ids were specified
  if len(options.note_id) > 0:
    filtered_note_ids = [int(arg[0]) for arg in options.note_id]
    note_ids = [nid for nid in note_ids if nid in filtered_note_ids]

  # filter only "noaudio" cards
  if options.noaudio:
    note_ids = [nid for nid in note_ids if col.get_note(nid)[options.audio_field] == "noaudio"]

  # filter flagged notes
  if options.query != None:
    filtered_note_ids = col.find_notes(options.query)
    note_ids = [nid for nid in note_ids if nid in filtered_note_ids]

  if len(note_ids) == 0:
    print("-- No notes found! (check your filters or note type?) --")
    sys.stdout = trash_out
    exit(1)

  edited_notes = 0

  note_index_format = ("{:0" + str(floor(log10(len(note_ids))) + 1) + "d}/{:d}")
  for note_index, note_id in enumerate(note_ids):
    note = col.get_note(note_id)
    print(f"[nid:{note_id}] ({note_index_format.format(note_index + 1, len(note_ids))}) ", end="")

    if options.clear_audio:
      if not options.dry_run:
        note[options.audio_field] = ""
        col.update_note(note)
      print(f"cleared \"{options.audio_field}\" field!")
      continue

    # skip any notes that already have audio
    if not options.force_override and len(note[options.audio_field]) > 0:
      print("skipped -> audio field not empty")
      continue

    # parse kanji and kana info from note
    kanji, kana = note2kanji_kana(note)
    if kanji == None or kana == None:
      print("skipped -> can't parse kanji/kana from card")
      continue
    print(f"{kanji} ({kana}) ", end="")

    # attempt to download audio
    exit_code, data = get(kanji, kana, options.source_list)
    if exit_code != 0:
      if not options.dry_run:
        note[options.audio_field] = "noaudio"
        col.update_note(note)
      edited_notes += 1
      print("skipped -> no recording available, marked as 'noaudio'")
      continue

    # save audio if download was succesful
    digest = hashlib.sha1(data).hexdigest()
    filename = f"{options.filename_prefix}{digest}.mp3"
    output_path = os.path.join(media_dir, filename)
    if not options.dry_run:
      with open(output_path, "wb+") as f:
        f.write(data)
        f.close()

    # set audio field to audio filename
    audio_str = f"[sound:{filename}]"
    if not options.dry_run:
      note[options.audio_field] = audio_str
      col.update_note(note)
    print(f"written audio as {audio_str}")
    edited_notes += 1

  if edited_notes == 0:
    print("-- Done: no edits --")
  else:
    print(f"-- Done: succesfully edited {edited_notes} note{'' if edited_notes == 1 else 's'} --")
  # circumvent "Exception ignored in atexit callbackException ignored in sys.unraisablehook"
  sys.stdout = trash_out

# run ./get to get audio data from stdout
# returns (exit_code, stdout_data)
def get(kanji, kana, source_list):
  args = [Path(__file__).resolve().parent.joinpath("get")]
  if source_list != None:
    args.append("-s")
    args.append(source_list)
  args.append(kanji)
  args.append(kana)
  p = subprocess.run(args, capture_output=True)
  if p.returncode != 0:
    return (1, None)
  return (0, p.stdout)

if __name__ == "__main__":
  main()

