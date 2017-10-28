#!/usr/bin/env python3

import csv
import json

csvfile  = open('words.csv', 'r')
jsonfile = open('words.json', 'w')

fieldnames = ("level", "kanji", "hiragana")
reader = csv.DictReader(csvfile, fieldnames)
jsonfile.write('[\n')
for row in reader:
    jsonfile.write('  ')
    json.dump(row, jsonfile)
    jsonfile.write(',\n')
jsonfile.write(']\n')
