

var current_word = document.querySelector('#chinese_char');
var current_pron = document.querySelector('#pronunciation');
var current_transl = document.querySelector('#translations');
var prev_btn = document.querySelector('.prev_btn');
var next_btn = document.querySelector('.next_btn');
var char = document.querySelector('.char_btn');
var draw_pron = document.querySelector('.pron_btn');
var answer = document.querySelector('.answer_btn');
var words_count = Object.keys(data.glossary.items).length;
var current_id =0;

// console.log("test", words_count, current_transl);

var fill_output = function (fill_type) {


	current_transl.innerHTML = '<hr class="progress">';
	current_pron.innerHTML = '';
	hide_answer(current_transl,current_pron);
	current_word.innerHTML = data.glossary.items[current_id].characters;

}

var draw_element = function () {
	current_id = Math.floor(Math.random() * words_count);
	console.log("current id: " + current_id);
	fill_output();
};

var hide_answer = function (part, partb) {
	window.setTimeout(function(){
		part.innerHTML = data.glossary.items[current_id].translation;
		partb.innerHTML = data.glossary.items[current_id].pron;
	},7000);
};

var show_answer = function () {
	current_pron.innerHTML = data.glossary.items[current_id].pron;
	current_transl.innerHTML = data.glossary.items[current_id].translation;

}

var make_step = function (step) {
	current_id += (current_id < words_count) ? step : 0;
	if (current_id<0){
		current_id = words_count-1;
	} else {
		if (current_id===words_count) {
		current_id = 0;
		}
	}
	console.log('next current_id: ',current_id);
	fill_output();
}

fill_output();
char.addEventListener('click', draw_element, false);
draw_pron.addEventListener('click', draw_element, false);
answer.addEventListener('click', show_answer, false);
next_btn.addEventListener('click', make_step.bind(null,1), false);
prev_btn.addEventListener('click', make_step.bind(null,-1), false);

