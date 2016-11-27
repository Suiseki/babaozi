//subproject to rewrite webapp in various javascript styles
//Objest Literal Pattern

(function(){
	var baoapp = {
		init: function () {
			this.cacheDom();

			this.words_count = Object.keys(data.glossary.items).length;
			this.current_id =0;
			//manage word range selector
			this.starting_word = 0;
			this.last_word = this.words_count;
			this.menu_trigger = false;
			this.later_answer;
			this.data_pairs = {
				"cword": [this.word, 'characters'],
				"cpron": [this.current_pron, 'pron'],
				"ctransl": [this.current_transl, 'translation']
			};

			this.bindEvents();
			this.fill_output('char');

		},
		cacheDom: function () {
			// navigation button
			this.prev_btn = document.querySelector('.prev_btn');
			this.first_btn = document.querySelector('.first_btn ');
			this.next_btn = document.querySelector('.next_btn');
			this.answer = document.querySelector('.answer_btn');
			
			//output
			this.word = document.querySelector('#chinese_char');
			this.current_pron = document.querySelector('#pronunciation');
			this.current_transl = document.querySelector('#translations');
			this.current_itemid = document.querySelector('.word-item_id');
			//this.buttons = buttons = document.querySelectorAll('.container > button');
			
			//draw buttons
			this.char = document.querySelector('.char_btn');
			this.draw_pron = document.querySelector('.pron_btn');
			this.draw_transl = document.querySelector('.transl_btn');

			//search form elements
			this.search_form = document.querySelector('#search');
			this.word_to_search = document.querySelector('input[name=word_request]');
			this.search_button = document.querySelector('input[type=button]');
			
			//side menu
			this.hamburger_icon = document.querySelector('#hamburger-side');
			this.sbr_nav = document.querySelector('.sidebar-nav');
			this.range_btns = document.querySelectorAll('aside li');

		},
		bindEvents: function () {
			this.char.addEventListener('click', this.draw_element.bind(this,'char'), false);
			this.draw_pron.addEventListener('click', this.draw_element.bind(this,'pron'), false);
			this.draw_transl.addEventListener('click', this.draw_element.bind(this,'transl'), false);
			this.answer.addEventListener('click', this.show_answer.bind(this), false);
			this.prev_btn.addEventListener('click', this.make_step.bind(this,-1), false);
			this.first_btn.addEventListener('click', this.draw_element.bind(this,0), false);
			this.next_btn.addEventListener('click', this.make_step.bind(this,1), false);

			this.word_to_search.addEventListener('keyup', function (e){
				if (e.which === 13 || e.keyCode === 13) {
					e.preventDefault();
					this.processQuery();
					this.word_to_search.blur();
				}
			}.bind(this));

			this.search_form.addEventListener('submit', function (e) {
				e.preventDefault();
			});

			this.search_button.addEventListener('click', this.processQuery.bind(this));
			this.hamburger_icon.addEventListener('click', this.animateSidebar.bind(this), false);
			
			//in ES6 ver change var to let - this make closure
			for (var i = 0; i < this.range_btns.length; i++) {
				(function iteration_var_fix(obj_side, j){

							obj_side.range_btns[j].addEventListener('click', function range_contract (){
								// console.log("kliknięto range: ", i*100, i*100+99);
								obj_side.starting_word = j*100;
								obj_side.last_word = j*100+99;
								obj_side.draw_element('char');
								obj_side.menu_trigger = false;
								obj_side.sbr_nav.className += " sideMenuOut";
								obj_side.sbr_nav.classList.remove("sideMenuIn");
							}.bind(obj_side), false);
					})(this, i);
			}
		},
		fill_output: function (fill_type) {
			clearTimeout(this.later_answer);
			if(fill_type === 'char'){
				this.word.innerHTML = data.glossary.items[this.current_id].characters;
				this.current_pron.innerHTML = '';
				this.current_transl.innerHTML = '<hr class="progress">';
				this.postpone_answer();

			} else if (fill_type === 'transl') {
				this.word.innerHTML = '';
				this.current_pron.innerHTML = '<hr class="progress">';
				this.current_transl.innerHTML = data.glossary.items[this.current_id].translation;
				this.postpone_answer();
			} else if (fill_type === 0) {
				this.word.innerHTML = data.glossary.items[0].characters;
				this.current_pron.innerHTML = data.glossary.items[this.current_id].pron;
				this.current_transl.innerHTML = '<hr class="progress">';
				this.postpone_answer();
			} else {
				this.word.innerHTML = '';
				this.current_pron.innerHTML = data.glossary.items[this.current_id].pron;
				this.current_transl.innerHTML = '<hr class="progress">';
				this.postpone_answer();
			}

		},		
		make_step: function (step) {
			this.current_id += (this.current_id < this.words_count) ? step : 0;
			if (this.current_id < 0){
				this.current_id = this.words_count-1;
			} else {
				if (this.current_id === this.words_count) {
					this.current_id = 0;
				}
			};
			this.fill_output('char');
		},
		draw_element: function (btn_hit) {

			// console.log("draw zasięg: " + this.starting_word, this.last_word);
			this.last_word = this.last_word === this.words_count ? this.last_word : 99;
			var rand_last = Math.random() * this.last_word;

			this.current_id = btn_hit !== 0 ? Math.floor( this.starting_word + rand_last) : 0;
			this.fill_output(btn_hit);
			// return "testresult";
		},
		postpone_answer: function () {
			this.later_answer = window.setTimeout(function(){
				this.show_answer();

			}.bind(this),6000);
		},
		show_answer: function () {
			this.word.innerHTML = data.glossary.items[this.current_id].characters;
			this.current_pron.innerHTML = data.glossary.items[this.current_id].pron;
			this.current_transl.innerHTML = data.glossary.items[this.current_id].translation;
			this.current_itemid.innerHTML = data.glossary.items[this.current_id].item_id;
			clearTimeout(this.later_answer);

		},
		animateSidebar: function () {

				if( this.menu_trigger === false ) {
					this.sbr_nav.className += " sideMenuIn";
					this.menu_trigger = true;
				} else {
					this.menu_trigger = false;
					this.sbr_nav.classList.remove("sideMenuIn")
					this.starting_word = 0;
					this.last_word = this.words_count;
				}
		},
		processQuery: function () {
			var search_val = this.word_to_search.value;
			if (isNaN(search_val)) {

				if (search_val.match(/[\u3400-\u9FBF]/)) {
					// found among chinese character range of unicode 
					for (var i=0; i < data.glossary.items.length; i++) {
						// if (data.glossary.items[i].characters === search_val) {
						if (data.glossary.items[i].characters.indexOf(search_val) !== -1) {
							//find first occurance in dictionary
							this.current_id = i;
							this.show_answer();
							this.word_to_search.value = '';
						}
					}
				}
			} else {
				//items is an array, subtract 1 to get first element
				this.current_id = Number(search_val)-1;
				this.show_answer();
				// console.log("pobrany: ", data.glossary.items[current_id].pron);
				
			}

		}

	}
	baoapp.init();
})();