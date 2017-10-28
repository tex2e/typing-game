#!/usr/bin/env python3

import csv
import json
import requests
import itertools
from lxml import html
from pprint import pprint

def main():
    words = retrieve()
    with open("words.csv", "w") as f:
        writer = csv.writer(f)
        writer.writerows(words)

def retrieve():
    words = [['level', 'kanji', 'hiragana']]

    # http://kanken.jitenon.jp/mondai1/yomi01.html
    # http://kanken.jitenon.jp/mondai1/yomi90.html

    # http://kanken.jitenon.jp/mondai1z/yomi01.html
    # http://kanken.jitenon.jp/mondai1z/yomi50.html

    # http://kanken.jitenon.jp/mondai-yomi02-01.html
    # http://kanken.jitenon.jp/mondai-yomi02-50.html

    for i in range(1, 90):
        url = 'http://kanken.jitenon.jp/mondai1/yomi{:02}.html'.format(i)
        page = requests.get(url)
        tree = html.fromstring(page.content)
        level = itertools.cycle(['1'])
        kanji = tree.xpath('//td[@class="yomi1td01"]/text()')
        hiragana = tree.xpath('//td[@class="yomi1td03"]/span/text()')
        words += list(zip(level, kanji, hiragana))

    for i in range(1, 50):
        url = 'http://kanken.jitenon.jp/mondai1z/yomi{:02}.html'.format(i)
        page = requests.get(url)
        tree = html.fromstring(page.content)
        level = itertools.cycle(['1z'])
        kanji = tree.xpath('//td[@class="yomi1ztd01"]/text()')
        hiragana = tree.xpath('//td[@class="yomi1ztd03"]/span/text()')
        words += list(zip(level, kanji, hiragana))

    for i in range(1, 50):
        url = 'http://kanken.jitenon.jp/mondai-yomi02-{:02}.html'.format(i)
        page = requests.get(url)
        tree = html.fromstring(page.content)
        level = itertools.cycle(['2'])
        kanji = tree.xpath('//th[@class="left"]/span/text()')
        hiragana = tree.xpath('//td[@class="font-futozi00"]/span/text()')
        words += list(zip(level, kanji, hiragana))

    return words


if __name__ == '__main__':
    main()
