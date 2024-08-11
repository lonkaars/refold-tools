#!/bin/python3
import sys
import os
import re
import io
from math import floor, log10
from time import sleep
from pathlib import Path
from bs4 import BeautifulSoup

real_stdout = sys.stdout
class TrashFileIO(object):
  def write(self, x): pass
  def flush(self): pass
trash_out = TrashFileIO()

# replace stderr file descriptor with /dev/null
os.dup2(os.open(os.devnull, os.O_WRONLY), 2)

sys.stdout = trash_out
import aqt
sys.stdout = real_stdout

def escape(plain):
  plain = plain.replace("*", "\\*")
  plain = plain.replace("(", "\\(")
  plain = plain.replace(")", "\\)")
  plain = plain.replace("[", "\\[")
  plain = plain.replace("]", "\\]")
  plain = plain.replace("{", "\\{")
  plain = plain.replace("}", "\\}")
  return plain

def recurseplainify(soup):
  output = ""
  for el in soup.children:
    if el.string:
      output += escape(el.string)
      continue

    if el.name == 'b':
      output += f"*{recurseplainify(el)}*"
      continue

    if el.name == 'ruby':
      output += f'[{el.text}]({el.rt.text})'
      continue
    
    output += recurseplainify(el)

  return output

def html2cardtemplate(html):
  soup = BeautifulSoup(html)
  return recurseplainify(soup)

def main():
  sys.stdout = trash_out
  app = aqt._run(sys.argv, False)
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

  model = col.models.by_name("Sentence mining")
  note_ids = col.models.nids(model)

  edited_notes = 0

  note_index_format = ("{:0" + str(floor(log10(len(note_ids))) + 1) + "d}/{:d}")
  for note_index, note_id in enumerate(note_ids):
    edited = False
    note = col.get_note(note_id)
    print(f"[nid:{note_id}] ({note_index_format.format(note_index + 1, len(note_ids))})", end="")

    if note['Complete sentence'].find('<') >= 0:
      print(" -> sentence HTML to plain", end="")
      note['Complete sentence'] = html2cardtemplate(note['Complete sentence'])
      edited = True

    if note['Target word reading'].find('<') >= 0:
      soup = BeautifulSoup(note['Target word reading'])
      note['Target word reading'] = soup.get_text()
      print(" -> stripped HTML from TW reading", end="")
      edited = True

    if not edited:
      print("unmodified", end="\r")
    else:
      print("", end="\n") # flush line
      col.update_note(note)
      edited_notes += 1

  if edited_notes == 0:
    print("-- Done: no edits --")
  else:
    print(f"-- Done: succesfully edited {edited_notes} note{'' if edited_notes == 1 else 's'} --")
  # circumvent "Exception ignored in atexit callbackException ignored in sys.unraisablehook"
  sys.stdout = trash_out

if __name__ == "__main__":
  main()

