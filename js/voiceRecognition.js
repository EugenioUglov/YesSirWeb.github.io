//  dropBoxMenu.addItem(element, textDropDownMenu, textRightDropDownMenu);

const voiceRecognition = {};

let final_speech_text = "";
let continuos_speech_text = "";

const langs =
[
	['English',         ['en-US', 'United States'],
						['en-AU', 'Australia'],
						['en-CA', 'Canada'],
						['en-IN', 'India'],
						['en-NZ', 'New Zealand'],
						['en-ZA', 'South Africa'],
						['en-GB', 'United Kingdom']],
	['Italiano',        ['it-IT', 'Italia'],
						['it-CH', 'Svizzera']],
	['Español',         ['es-AR', 'Argentina'],
						['es-BO', 'Bolivia'],
						['es-CL', 'Chile'],
						['es-CO', 'Colombia'],
						['es-CR', 'Costa Rica'],
						['es-EC', 'Ecuador'],
						['es-SV', 'El Salvador'],
						['es-ES', 'España'],
						['es-US', 'Estados Unidos'],
						['es-GT', 'Guatemala'],
						['es-HN', 'Honduras'],
						['es-MX', 'México'],
						['es-NI', 'Nicaragua'],
						['es-PA', 'Panamá'],
						['es-PY', 'Paraguay'],
						['es-PE', 'Perú'],
						['es-PR', 'Puerto Rico'],
						['es-DO', 'República Dominicana'],
						['es-UY', 'Uruguay'],
						['es-VE', 'Venezuela']],
	['Pусский',         ['ru-RU']],
];


const colors_ru = {
	белый: 'white',
	черный: 'black',
	красный: 'red',
	оранжевый: 'orange',
	желтый: 'yellow',
	зеленый: 'green',
	голубой: 'blue',
	синий: 'darkblue',
	фиолетовый: 'violet'
};

// colors in rus language
const colors_keyList_ru = Object.keys(colors_ru);
const colors_list_en = ['white', 'black', 'red', 'orange', 'yellow', 'green', 'blue', 'darkblue', 'violet'];

let is_continuous_speech_on = false;
let dropdown_select_language = document.getElementById("dropdown_select_language");

let inputTextField;
let create_email = false;
let final_transcript = '';
let recognizing = false;
let ignore_onend;
let start_timestamp;

dropdown_select_language.addEventListener("click", function(e) {
	updateDialect();
});

for (let i = 0; i < langs.length; i++) {
	dropdown_select_language.options[i] = new Option(langs[i][0], i);
}



updateDialect();
//select_dialect.selectedIndex = 6;
//showInfo('info_start');

if(localStorage.getItem('i_language') != undefined) {
	console.log("LOAD from local storage: the last used language is: " + dropdown_select_language[localStorage.getItem('i_language')].text);
	dropdown_select_language.selectedIndex = localStorage.getItem('i_language');
}

// retrieve the jQuery wrapped dom object identified by the selector '#mySel'
let sel = $('#dropdown_select_language');
// assign a change listener to it
sel.change(function(){ //inside the listener
	// retrieve the value of the object firing the event (referenced by this)
	let i_language = $(this).val();
	// print it in the logs
	console.log(i_language); // crashes in IE, if console not open
	
	console.log("SAVE to local storage: the last used language is: " + dropdown_select_language[i_language].text);
	localStorage.setItem('i_language', i_language);
}); // close the change listener


function updateDialect() {
	for (let i = select_dialect.options.length - 1; i >= 0; i--) {
		select_dialect.remove(i);
	}
	
	let list = langs[dropdown_select_language.selectedIndex];

	for (let i = 1; i < list.length; i++) {
		select_dialect.options.add(new Option(list[i][1], list[i][0]));
	}
	
	select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}



function onload() { 
	inputTextField = document.getElementById('inputText');
}



if (!('webkitSpeechRecognition' in window)) {
	upgrade();
} else {
	btn_voice_recognition.style.display = 'inline-block';
	recognition = new webkitSpeechRecognition();

	recognition.continuous = true;
	recognition.interimResults = true;

	recognition.onstart = function() {
		recognizing = true;
		//showInfo('info_speak_now');
		label_help.innerText = "Speak recognition: Speak now";
		img_voice_recognition.src = './icons/mic-animate.gif';
	};

	recognition.onerror = function(event) {
		if (event.error == 'no-speech') {
			img_voice_recognition.src = './icons/mic.gif';
			//showInfo('info_no_speech');
			label_help.innerText = "Speak recognition: Speech error";
			ignore_onend = true;
		}
		if (event.error == 'audio-capture') {
			img_voice_recognition.src = './icons/mic.gif';
			// showInfo('info_no_microphone');
			label_help.innerText = "Speak recognition: No microphone";
			ignore_onend = true;
		}
		if (event.error == 'not-allowed') {
		if (event.timeStamp - start_timestamp < 100) {
			//showInfo('info_blocked');
			label_help.innerText = "Speak recognition: info blocked";
		} else {
			//showInfo('info_denied');
			label_help.innerText = "Speak recognition: info denied";
		}
		ignore_onend = true;
		}
	};

	recognition.onend = function() {
		recognizing = false;
		if (ignore_onend) {
			return;
		}
		img_voice_recognition.src = './icons/mic.gif';
		if ( ! final_transcript) {
			//showInfo('info_start');
			label_help.innerText = "Speak recognition: Speak start";
			return;
		}
		//showInfo('');
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
			let range = document.createRange();
			range.selectNode(document.getElementById('final_span'));
			window.getSelection().addRange(range);
		}

	};

	recognition.onresult = function(event) {
		let input_field_request = document.getElementById("input_field_request");
		let interim_transcript = '';
		for (let i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				final_transcript += event.results[i][0].transcript;
				onSpeechResult(final_transcript);
			} else {
				//input_field_request.value += event.results[i][0].transcript;
				interim_transcript += event.results[i][0].transcript;
				onContinousResult(interim_transcript);
			}
		}
		final_transcript = capitalize(final_transcript);
		//console.log("final_transcript: " + final_transcript);
		
		// Paste text to big speech field
		//final_span.innerHTML = linebreak(final_transcript);
		//interim_span.innerHTML = linebreak(interim_transcript);
		continuos_speech_text = interim_transcript;

		final_speech_text = final_transcript;

		// Set text final
		input_field_request.value = final_speech_text;


		// if coninous speech
		if (interim_transcript) {
			console.log("interim_transcript:", interim_transcript);
			// Set text continous
			input_field_request.value = continuos_speech_text;
			// Set color for text
			input_field_request.style.color = "gray";
			
			if(interim_transcript.includes("ok") || interim_transcript.includes("okay") || interim_transcript.includes("enter") || interim_transcript.includes("accept") || interim_transcript.includes("finish") || interim_transcript.includes("stop") || interim_transcript.includes("принять") || interim_transcript.includes("finito")) {
				recognition.stop();
			}

			//$("#input_field_request").focus();
			//let input = document.querySelector("input");
		}
		// if finish speech
		else if(final_transcript) {
			console.log(final_transcript);
		//	autocomplete.set_focus_last_symbol();
			console.log("finish speech");
			input_field_request.style.color = "black";
			infoBlockSearcher.searchByCommand(input_field_request.value);
		}
	};
}

// Android works just with this result. PC works with this (final result) and continuos speech result
function onSpeechResult(speech_text) {	
	//autocomplete.set_focus_last_symbol();
	doWithSpeechMainFunc(speech_text);
}

function onContinousResult(speech_text) {
}

updateDialect();

function doWithSpeechMainFunc(speech_text) {
	

	let language = "en";

	console.log("user phrase: ", speech_text)
	//document.body.innerHTML += "finish";
	let selected_language_user = dropdown_select_language.options[dropdown_select_language.selectedIndex].text;
	

	// ENGLISH
	if(selected_language_user === "English"){
		console.log("selected_language_user: " + selected_language_user);
		// Execute action on get phrase
		
		language = "en";

		if(speech_text.includes("stop")) {
			if (recognizing) {
				recognition.stop();
				return;
			}
		}

	}

	// RUSSIAN
	else if(selected_language_user === "Pусский") {
		console.log("selected_language_user: " + selected_language_user);

		language = "ru";

		if(speech_text.includes("стоп")) {
			if (recognizing) {
				recognition.stop();
				return;
			}
		}
	}
	
	else if(selected_language_user === "Italiano") {
		language = "it";
		
		if(speech_text.includes("ferma")) {
			if (recognizing) {
				recognition.stop();
				return;
			}
		}
	}
	
	//system.onGetPhrase(speech_text, language);
}

function upgrade() {
	btn_voice_recognition.style.visibility = 'hidden';
	//showInfo('info_upgrade');
}


function linebreak(s) {
	let two_line = /\n\n/g;
	let one_line = /\n/g;

	return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}


function capitalize(s) {
	let first_char = /\S/;
	
	return s.replace(first_char, function(m) { return m.toUpperCase(); });
}




function startButton(event) {
	if (recognizing) {
		recognition.stop();
		return;
	}
	final_transcript = '';
	recognition.lang = select_dialect.value;
	recognition.start();
	ignore_onend = false;
	//final_span.innerHTML = '';
	//interim_span.innerHTML = '';
	img_voice_recognition.src = './icons/mic-slash.gif';
	//showInfo('info_allow');
	label_help.innerText = "Speak recognition: Speak now";
	start_timestamp = event.timeStamp;
}

function showInfo(s) {
	/*
	if (s) {
		for (let child = info.firstChild; child; child = child.nextSibling) {
			if (child.style) {
				child.style.display = child.id == s ? 'inline' : 'none';
			}
		}
		info.style.visibility = 'visible';
	} else {
		info.style.visibility = 'hidden';
	}
	*/
}



voiceRecognition.stop = function() {
	if (recognizing) {
		recognition.stop();
	}
}


function onValueChangedInfoDropDown(selected) {
	let selectedValue = selected.value;
	alert(selectedValue);

	// set value in combobox: None Film
	info_dropdownList.selectedIndex = 0;

	//let selectIndex=selectObj.selectedIndex;
	//let selectValue=selectObj.options[selectIndex].text;
	//let output=document.getElementById("output");
	//alert(selected_film.value);
	//output.innerHTML=selectValue;
}
