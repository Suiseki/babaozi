

var current_word = document.querySelector('#chinese_char');
var current_pron = document.querySelector('#pronunciation');
var current_transl = document.querySelector('#translations');

console.log("test", data, current_transl);


current_transl.innerHTML = 'test';
current_word.innerHTML = data.glossary.items[1].characters;
current_pron.innerHTML = data.glossary.items[1].pron;

