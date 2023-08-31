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


let dropdown_select_language = document.getElementById("dropdown_select_language");

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

if(localStorage.getItem('i_language') != undefined) {
	// console.log("LOAD from local storage: the last used language is: " + dropdown_select_language[localStorage.getItem('i_language')].text);
	dropdown_select_language.selectedIndex = localStorage.getItem('i_language');
}

// retrieve the jQuery wrapped dom object identified by the selector '#mySel'
let sel = $('#dropdown_select_language');
// assign a change listener to it
sel.change(function(){ //inside the listener
	// retrieve the value of the object firing the event (referenced by this)
	let i_language = $(this).val();
	
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




if (!('webkitSpeechRecognition' in window)) {
	btn_voice_recognition.style.visibility = 'hidden';
} else {
	btn_voice_recognition.style.display = 'inline-block';
	recognition = new webkitSpeechRecognition();

	recognition.continuous = true;
	recognition.interimResults = true;

	recognition.onstart = function() {
		recognizing = true;
		label_help.innerText = "Speak recognition: Speak now";
		img_voice_recognition.src = './icons/mic-animate.gif';
	};

	recognition.onerror = function(event) {
		if (event.error == 'no-speech') {
			img_voice_recognition.src = './icons/mic.gif';
			label_help.innerText = "Speak recognition: Speech error";
			ignore_onend = true;
		}
		if (event.error == 'audio-capture') {
			img_voice_recognition.src = './icons/mic.gif';
			label_help.innerText = "Speak recognition: No microphone";
			ignore_onend = true;
		}
		if (event.error == 'not-allowed') {
		if (event.timeStamp - start_timestamp < 100) {
			label_help.innerText = "Speak recognition: info blocked";
		} else {
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
			label_help.innerText = "Speak recognition: Speak start";
			return;
		}
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
			} else {
				//input_field_request.value += event.results[i][0].transcript;
				interim_transcript += event.results[i][0].transcript;
			}
		}

		final_transcript = capitalize(final_transcript);
		
		// Paste text to big speech field
		//final_span.innerHTML = linebreak(final_transcript);
		//interim_span.innerHTML = linebreak(interim_transcript);
		continuos_speech_text = interim_transcript;
	};
}

updateDialect();


// let selected_language_user = dropdown_select_language.options[dropdown_select_language.selectedIndex].text;


function linebreak(s) {
	let two_line = /\n\n/g;
	let one_line = /\n/g;

	return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}


function capitalize(s) {
	let first_char = /\S/;
	
	return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function onClickSpeakButton(event) {
	if (recognizing) {
		recognition.stop();
		return;
	}
	final_transcript = '';
	recognition.lang = select_dialect.value;
	recognition.start();
	ignore_onend = false;
	img_voice_recognition.src = './icons/mic-slash.gif';
	label_help.innerText = "Speak recognition: Speak now";
	start_timestamp = event.timeStamp;
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
