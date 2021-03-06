//subproject to rewrite webapp in various javascript styles
//Revealing  Module Pattern

"use strict";
var baoapp = (function(){


			var last_word, words_count;
			var current_id =0;
				//manage word range selector
			var starting_word = 0;

			var menu_trigger = false;
			var later_answer;

			var body = document.querySelector('body');

			// navigation button
			var prev_btn = document.querySelector('.prev_btn');
			var first_btn = document.querySelector('.first_btn ');
			var next_btn = document.querySelector('.next_btn');
			var answer = document.querySelector('.answer_btn');
			
			//output
			var progress = document.querySelector('.progress-container');
			var word = document.querySelector('#chinese_char');
			var current_pron = document.querySelector('#pronunciation');
			var current_transl = document.querySelector('#translations');
			var current_itemid = document.querySelector('.word-item_id');
			//var buttons = buttons = document.querySelectorAll('.container > button');
			
			//draw buttons
			var char = document.querySelector('.char_btn');
			var draw_pron = document.querySelector('.pron_btn');
			var draw_transl = document.querySelector('.transl_btn');

			//search form elements
			var search_form = document.querySelector('#search');
			var word_to_search = document.querySelector('input[name=word_request]');
			var search_button = document.querySelector('input[type=button]');
			var modal = document.querySelector('.modal-wrapper');
			var srch_res = document.querySelector(".search-results");

			//side menu
			var hamburger_icon = document.querySelector('#hamburger-side');
			var sbr_nav = document.querySelector('.sidebar-nav');
			var range_btns = document.querySelectorAll('aside li');
			var data_local;

			var bindEvents = function (data) {
				words_count = Object.keys(data.glossary.items).length;
				last_word = words_count;
				data_local = data;

				char.addEventListener('click', function (){draw_element("char", data)}, false);
				draw_pron.addEventListener('click', function (){draw_element('pron', data)}, false);
				draw_transl.addEventListener('click', function (){draw_element('transl', data)}, false);
				answer.addEventListener('click', function (){
					fill_output('show_answer', data)
				}, false);
				prev_btn.addEventListener('click', function (){make_step(-1, data)}, false);
				first_btn.addEventListener('click', function (){draw_element(0, data)}, false);
				next_btn.addEventListener('click', function (){make_step(1, data)}, false);
				modal.addEventListener('click', function (){closeModal()}, false);

				word_to_search.addEventListener('keyup', function (e){
					if (e.which === 13 || e.keyCode === 13) {
						e.preventDefault();
						processQuery();
						word_to_search.blur();
					}
				});


				search_form.addEventListener('submit', function (e) {
					e.preventDefault();
				});

				search_button.addEventListener('click', processQuery.bind(this, null));
				hamburger_icon.addEventListener('click', animateSidebar, false);
				
				sbr_nav.addEventListener('click', function(e){
					var range_extracted = e.target.innerHTML.split('-');
					starting_word = parseInt(range_extracted[0]);
					last_word = parseInt(range_extracted[1]);
					console.log("range sidebar: ",starting_word,last_word);
					draw_element('char', data);
					menu_trigger = false;
					sbr_nav.className += " sideMenuOut";
					sbr_nav.classList.remove("sideMenuIn");
				}.bind(this), false);
				fill_output('char', data);
			}

			var make_step = function (step, data) {
				current_id += (current_id < words_count) ? step : 0;
				if (current_id < 0){
					current_id = words_count-1;
				} else {
					if (current_id === words_count) {
						current_id = 0;
					}
				};
				fill_output('char', data);
			}

			var draw_element = function (btn_hit, data) {
				last_word = last_word === words_count ? last_word : 99;
				var rand_last = Math.random() * last_word;
				current_id = btn_hit !== 0 ? Math.floor( starting_word + rand_last) : 0;
				console.log("draw current_id: ", current_id);
				fill_output(btn_hit, data);
			}

			var fill_output = function (fill_type, data) {
				clearTimeout(later_answer);
				var ctrl = {
					'char': [true, false, false],
					'pron': [false, true, false, false],
					'transl': [false, false, true, false],
					'show_answer': [true, true, true, true],
					'0': [true, false, false, false]
				};

				word.innerHTML = (ctrl[fill_type][0]) ? data.glossary.items[current_id].characters : "";
				current_pron.innerHTML = ctrl[fill_type][1] ? data.glossary.items[current_id].pron : "";
				current_transl.innerHTML = ctrl[fill_type][2] ? data.glossary.items[current_id].translation : "";
				current_itemid.innerHTML = ctrl[fill_type][3] ? data.glossary.items[current_id].item_id : "";

				if (fill_type !== "show_answer") {
					progress.innerHTML = '<hr class="progress">';
				}

				postpone_answer();
			}

		var postpone_answer = function () {
			later_answer = window.setTimeout(function(){
				fill_output('show_answer', data_local);
			},6000);

		}

		var animateSidebar = function () {

				if( menu_trigger === false ) {
					sbr_nav.className += " sideMenuIn";
					menu_trigger = true;
				} else {
					menu_trigger = false;
					sbr_nav.classList.remove("sideMenuIn")
					starting_word = 0;
					last_word = words_count;
				}
		}

		var processQuery = function (s_value) {
			var search_val =  s_value || word_to_search.value;
			if (isNaN(search_val) || search_val.length === 0) {
				// find among chinese character range of unicode 
				if (search_val.match(/[\u3400-\u9FBF]/)) {
					var results_array = [];
					
					//search whole characters base
					for (var i=0; i < data_local.glossary.items.length; i++) {
						if (data_local.glossary.items[i].characters.indexOf(search_val) !== -1) {
							results_array.push(i);
						}
					}

					console.log("wyszukano elementów: " + results_array.length);
					body.classList.add("modalized");



					var result_characters = results_array.forEach(function(el){
						srch_res.innerHTML += '<div id="'+el+'"">' +
						 data_local.glossary.items[el].characters +
						  '</div>';
						//console.log("el: " + data_local.glossary.items[el].characters);
					}.bind(this));


					srch_res.addEventListener('click', analyseFound.bind(this), false);


				}
			} else {
				//items is an array, subtract 1 to get first element
				current_id = Number(search_val)-1;
				fill_output('show_answer', data_local);
				// console.log("pobrany: ", data_local.glossary.items[current_id].pron);
				
			}

		}

		var closeModal = function () {
			while(srch_res.firstChild){
				srch_res.removeChild(srch_res.firstChild);
			}
			body.classList.remove("modalized");
		}

		var analyseFound = function (e) {
			//if clicked element is not the same as element with event attached
			if (e.target !== e.currentTarget) {
				processQuery(Number(e.target.id)+1);
			}
		}



	return {
		init: bindEvents,
		draw: draw_element
	};

})();


function getJsonDict (file, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', file);

	xhr.onreadystatechange = function() {

		if(xhr.readyState == 4){
			if(callback) {
				var data = JSON.parse(xhr.responseText);
				callback(data)
			}
		}
	};

	xhr.send(); 
}

getJsonDict('./data/hsk-test.json', function(data){

	baoapp.init(data);
	baoapp.draw("transl", data);
})