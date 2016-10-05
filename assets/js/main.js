

var current_word = document.querySelector('#chinese_char');
var current_pron = document.querySelector('#pronunciation');
var current_transl = document.querySelector('#translations');
var current_itemid = document.querySelector('.word-item_id');
var prev_btn = document.querySelector('.prev_btn');
var first_btn = document.querySelector('.first_btn ');
var next_btn = document.querySelector('.next_btn');
var char = document.querySelector('.char_btn');
var draw_pron = document.querySelector('.pron_btn');
var draw_transl = document.querySelector('.transl_btn');
var answer = document.querySelector('.answer_btn');
var words_count = Object.keys(data.glossary.items).length;
var current_id =0;
//manage word range selector
var starting_word = 0;
var last_word = words_count;

var menu_trigger = false;

var later_answer;
var data_pairs = {
	"cword": [current_word, 'characters'],
	"cpron": [current_pron, 'pron'],
	"ctransl": [current_transl, 'translation']
};

// console.log("test", words_count, current_transl);

var fill_output = function (fill_type) {
	clearTimeout(later_answer);

	if(fill_type === 'char'){
		current_word.innerHTML = data.glossary.items[current_id].characters;
		current_pron.innerHTML = '';
		current_transl.innerHTML = '<hr class="progress">';
		postpone_answer();
		
	} else if (fill_type === 'transl') {
		current_word.innerHTML = '';
		current_pron.innerHTML = '<hr class="progress">';
		current_transl.innerHTML = data.glossary.items[current_id].translation;
		postpone_answer();
		
	} else if (fill_type === 0) {
		current_word.innerHTML = data.glossary.items[0].characters;
		current_pron.innerHTML = data.glossary.items[current_id].pron;
		current_transl.innerHTML = '<hr class="progress">';
		postpone_answer();
	} else {
		current_word.innerHTML = '';
		current_pron.innerHTML = data.glossary.items[current_id].pron;
		current_transl.innerHTML = '<hr class="progress">';
		postpone_answer();
	}
		current_itemid.innerHTML = '';


}

var draw_element = function (btn_hit) {
	console.log("zasięg: " + starting_word, last_word);
	var rand_last = Math.random() * 99;
	current_id = btn_hit !== 0 ? Math.floor( starting_word + rand_last) : 0;
	fill_output(btn_hit);
	console.log("crnt: " + rand_last, current_id);
};

var postpone_answer = function () {
	later_answer = window.setTimeout(function(){
		show_answer();

	},6000);
}


var show_answer = function () {
	current_word.innerHTML = data.glossary.items[current_id].characters;
	current_pron.innerHTML = data.glossary.items[current_id].pron;
	current_transl.innerHTML = data.glossary.items[current_id].translation;
	current_itemid.innerHTML = data.glossary.items[current_id].item_id;
	// console.log("word: " + data.glossary.items[current_id].item_id, current_itemid);
	clearTimeout(later_answer);

}

var make_step = function (step) {
	//step +1 means forwards, -1 means backwards
	current_id += (current_id < words_count) ? step : 0;
	if (current_id<0){
		current_id = words_count-1;
	} else {
		if (current_id===words_count) {
		current_id = 0;
		}
	}
	fill_output('char');
}

fill_output('char');
char.addEventListener('click', draw_element.bind(null,'char'), false);
draw_pron.addEventListener('click', draw_element.bind(null,'pron'), false);
draw_transl.addEventListener('click', draw_element.bind(null,'transl'), false);
answer.addEventListener('click', show_answer, false);
prev_btn.addEventListener('click', make_step.bind(null,-1), false);
first_btn.addEventListener('click', draw_element.bind(null,0), false);
next_btn.addEventListener('click', make_step.bind(null,1), false);

// range select
var range_btns = document.querySelectorAll('aside li');
// todo
//let is not supported in all browsers, provide polyfill
for (let i = 0; i<range_btns.length; i++) {
	console.log("opis elementu: ", i);
	range_btns[i].addEventListener('click', function range_contract (){
		console.log("kliknięto range: ", i*100, i*100+99);
		starting_word = i*100;
		last_word = i*100+99;
		draw_element(null,'char');
		menu_trigger = false;
		sbr_nav.className += " sideMenuOut";
		sbr_nav.classList.remove("sideMenuIn");
	}, false);
}


//ux - modyfikacjie wyglądu
var hamburger_icon = document.querySelector('#hamburger-side');
var sbr_nav = document.querySelector('.sidebar-nav');
hamburger_icon.addEventListener('click', animateSidebar, false);

function animateSidebar () {

		if(menu_trigger === false){
			sbr_nav.className += " sideMenuIn";
			sbr_nav.classList.remove("sideMenuOut")
			menu_trigger = true;
			console.log("klasy: " + sbr_nav.classList);
		} else {
			menu_trigger = false;
			sbr_nav.className += " sideMenuOut";
			sbr_nav.classList.remove("sideMenuIn")

		}
}