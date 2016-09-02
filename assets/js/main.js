

var current_word = document.querySelector('#chinese_char');
var current_pron = document.querySelector('#pronunciation');
var current_transl = document.querySelector('#translations');
var char = document.querySelector('.char_btn');
var draw_pron = document.querySelector('.pron_btn');
var answer = document.querySelector('.answer_btn');
var words_count = Object.keys(data.glossary.items).length;
var current_id;

// console.log("test", words_count, current_transl);

var draw_element = function () {
	current_id = Math.floor(Math.random() * words_count);
	console.log("current id: " + current_id);
	current_transl.innerHTML = "…";
	hide_answer(current_transl);
	current_word.innerHTML = data.glossary.items[current_id].characters;
	current_pron.innerHTML = data.glossary.items[current_id].pron;
};

var hide_answer = function (part) {
	window.setTimeout(function(){
		part.innerHTML = data.glossary.items[current_id].translation;
	},6000);
};

var show_answer = function () {
	current_transl.innerHTML = data.glossary.items[current_id].translation;

}

char.addEventListener('click', draw_element, false);
draw_pron.addEventListener('click', draw_element, false);
answer.addEventListener('click', show_answer, false);

