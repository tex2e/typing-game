
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';

import './main.html';
import data from './words.js';
var words = shuffle(data.words);

Template.game.onCreated(function () {
  this.currentWordIndex = new ReactiveVar(0);
  this.currentWordLocation = new ReactiveVar(0);
  this.currentWordRomaji = new ReactiveVar('');
  this.score = new ReactiveVar(0);
  this.miss = new ReactiveVar(0);
});

Template.game.helpers({
  currentWordKanji() {
    var index = Template.instance().currentWordIndex.get() || 0;
    return words[index].kanji;
  },
  currentWordHiragana() {
    var index = Template.instance().currentWordIndex.get() || 0;
    return words[index].hiragana;
  },
  currentWordRomaji() {
    var index = Template.instance().currentWordIndex.get() || 0;
    var romaji = hiragana2romaji(words[index].hiragana);
    Template.instance().currentWordRomaji.set(romaji);
    var location = Template.instance().currentWordLocation.get() || 0;
    var displayedRomaji = romaji.slice(0, location).replace(/./g, '_') + romaji.slice(location);
    return displayedRomaji;
  },
  currentScore() {
    return Template.instance().score.get();
  },
  currentMiss() {
    return Template.instance().miss.get();
  },
})

Template.game.events({
  'keydown input'(event, instance) {
    if (event.key === instance.currentWordRomaji.get().charAt(instance.currentWordLocation.get())) {
      // update cursor position
      instance.currentWordLocation.set(instance.currentWordLocation.get() + 1);
      // update score
      instance.score.set(instance.score.get() + 1);

      if (instance.currentWordLocation.get() >= instance.currentWordRomaji.get().length) {
        // Set next word
        // update word index
        var nextIndex = instance.currentWordIndex.get() + 1;
        if (nextIndex < words.length) {
          instance.currentWordIndex.set(nextIndex);
        } else {
          instance.currentWordIndex.set(0);
        }
        // reset cursor position
        instance.currentWordLocation.set(0);
      }
    }
    else {
      // update miss count
      instance.miss.set(instance.miss.get() + 1);
    }
  }
});

function rand(min, max) {
  if (max === undefined) { max = min; min = 0; }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  var sample = array.slice(0);
  var length = sample.length;
  var last = length - 1;
  for (var index = 0; index < length; index++) {
    var rnd = rand(index, last);
    var temp = sample[index];
    sample[index] = sample[rnd];
    sample[rnd] = temp;
  }
  return sample;
}

function csv2obj(csv_str) {
  var result = [];
  var lines = csv_str.split("\n");
  var headers = lines[0].split(",");

  for (var i = 1; i < lines.length; i++){
    var obj = {};
    var currentline = lines[i].split(",");

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }

  return result;
}

function hiragana2romaji(hiragana) {
  hiragana2romaji.mapping = {
    'あ': 'a' , 'い': 'i' , 'う': 'u' , 'え': 'e' , 'お': 'o' ,
    'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
    'さ': 'sa', 'し': 'si', 'す': 'su', 'せ': 'se', 'そ': 'so',
    'た': 'ta', 'ち': 'ti', 'つ': 'tu', 'て': 'te', 'と': 'to',
    'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
    'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
    'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
    'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
    'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
    'わ': 'wa', 'を': 'wo', 'ん': 'n' ,
    'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
    'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
    'だ': 'da', 'ぢ': 'di', 'づ': 'du', 'で': 'de', 'ど': 'do',
    'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
    'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',

    'きゃ': 'kya', 'きぃ': 'kyi', 'きゅ': 'kyu', 'きぇ': 'kye', 'きょ': 'kyo',
    'ぎゃ': 'gya', 'ぎぃ': 'gyi', 'ぎゅ': 'gyu', 'ぎぇ': 'gye', 'ぎょ': 'gyo',
    'しゃ': 'sya',               'しゅ': 'syu', 'しぇ': 'sye', 'しょ': 'syo',
    'じゃ': 'ja' ,               'じゅ': 'ju' , 'じぇ': 'je' , 'じょ': 'jo' ,
    'ちゃ': 'tya',               'ちゅ': 'tyu', 'ちぇ': 'tye', 'ちょ': 'tyo',
    'にゃ': 'nya', 'にぃ': 'nyi', 'にゅ': 'nyu', 'にぇ': 'nye', 'にょ': 'nyo',
    'ひゃ': 'hya', 'ひぃ': 'hyi', 'ひゅ': 'hyu', 'ひぇ': 'hye', 'ひょ': 'hyo',
    'びゃ': 'bya', 'びぃ': 'byi', 'びゅ': 'byu', 'びぇ': 'bye', 'びょ': 'byo',
    'ぴゃ': 'pya', 'ぴぃ': 'pyi', 'ぴゅ': 'pyu', 'ぴぇ': 'pye', 'ぴょ': 'pyo',
    'みゃ': 'mya', 'みぃ': 'myi', 'みゅ': 'myu', 'みぇ': 'mye', 'みょ': 'myo',
    'りゃ': 'rya', 'りぃ': 'ryi', 'りゅ': 'ryu', 'りぇ': 'rye', 'りょ': 'ryo',
    'ふぁ': 'fa' , 'ふぃ': 'fi' ,               'ふぇ': 'fe' , 'ふぉ': 'fo' ,
    'うぃ': 'wi' , 'うぇ': 'we' ,

    'っ': 'xtu',
  }
  return hiragana
    .split(/(?![ゃゅょぁぃぅぇぉ])/)
    .map(e => hiragana2romaji.mapping[e])
    .join("")
    .replace(/xtu(.)/g, '$1$1')
}
