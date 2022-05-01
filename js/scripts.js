const _data = {
	gameOn: false,
	timeout: undefined,
	sounds: [],

	strict: false,
	playerCanPlay: false,
	score: 0,
	gameSequence: [],
	playerSequence: []
};

const _gui = {
	counter: document.querySelector(".gui_counter"),
	switch: document.querySelector(".gui_btn-switch"),
	led: document.querySelector(".gui_led"),
	strict: document.querySelector(".gui_btn--strict"),
	start: document.querySelector(".gui_btn--start"),
	pads: document.querySelectorAll(".game_pad")
}

const _soundUrls = [
	"audio/simonSound1.mp3",
	"audio/simonSound2.mp3",
	"audio/simonSound3.mp3",
	"audio/simonSound4.mp3"
];

_soundUrls.forEach(sndPath => {
	const audio = new Audio(sndPath);
	_data.sounds.push(audio);
});

const turnOnGame = () =>{
	_data.gameOn = _gui.switch.classList.toggle("gui_btn-switch--on");
	
	_gui.counter.classList.toggle('gui_counter--on')
	_gui.counter.innerHTML = "--";

	_data.strict = false;
	_data.playerCanPlay = false;
	_data.score = 0;
	_data.gameSequence = [];
	_data.playerSequence = [];
	_gui.led.classList.remove('gui_led--active');

	disablePads();
}

const activateStrictMode = () =>{
	if(!_data.gameOn) return
	
	_data.strict = _gui.led.classList.toggle('gui_led--active');
}

_gui.switch.addEventListener("click", turnOnGame);

_gui.strict.addEventListener("click", activateStrictMode);

_gui.start.addEventListener("click", () => {
	
	startGame();
});

const padListener = (e) => {
	if(!_data.playerCanPlay) return;

	let soundId;
	_gui.pads.forEach((pad, key)=>{
		if (pad === e.target) soundId = key;
	});

	e.target.classList.add("game_pad--active");
	_data.sounds[soundId].play();
	_data.playerSequence.push(soundId);

	e.target.classList.remove("game_pad--active");

	const currentMove = _data.playerSequence.length - 1;

	if(_data.playerSequence[currentMove] !== _data.gameSequence[currentMove]){
		_data.playerCanPlay = false;
		disablePads();
		playSequence();
	}else if(currentMove === _data.gameSequence.length - 1){
		newColor();
		playSequence();
	}

	waitForPlayerClick();
}

_gui.pads.forEach(pad => {
	pad.addEventListener("click", padListener);
});

const startGame = () => {
	blink('--', ()=>{
		newColor();
		playSequence();
	})
}

const setScore = () => {
	const SCORE = _data.score.toString();
	const DISPLAY = "00".substring(0,2 - SCORE.length) + SCORE;

	_gui.counter.innerHTML = DISPLAY;
}

const newColor = () => {
	_data.gameSequence.push(Math.floor(Math.random() * 4));
	_data.score++;

	setScore();
}

const playSequence = () => {
	let counter = 0,
		padOn = true;

	_data.playerSequence = [];
	_data.playerCanPlay = false;
	const INTERVAL = setInterval(()=>{
		if(!_data.gameOn){
			clearInterval(INTERVAL);
			disablePads();
			return
		}
		if(padOn){
			if(counter === _data.gameSequence.length){
				clearInterval(INTERVAL);
				disablePads();
				waitForPlayerClick();
				_data.playerCanPlay = true;
				return
			}
			const sndId = _data.gameSequence[counter];
			const PAD = _gui.pads[sndId];

			_data.sounds[sndId].play();
			PAD.classList.add("game_pad--active");
			counter++;
		}else{
			disablePads();
		}

		padOn = !padOn;
	},750)
}

const blink = (text, callback) => {
	let counter = 0; 
		on = true;
	
	_gui.counter.innerHTML =  text;
	const INTERVAL = setInterval(() =>{
		if(!_data.gameOn) {
			clearInterval(INTERVAL)
			_gui.counter.classList.remove("gui_counter--on")
			return;
		}

		if(on){
			_gui.counter.classList.remove('gui_counter--on')
		}else{
			_gui.counter.classList.add('gui_counter--on')

			if(++counter === 3){
				clearInterval(INTERVAL);
				callback();
			}
		}

		on = !on;
	},250)
		
}

const waitForPlayerClick = () => {

	clearTimeout(_data.timeout);
	_data.timeout = setTimeout(()=>{
		if(!_data.playerCanPlay) return;
		disablePads();
		playSequence();
	}, 5000)
}

const resetOrPlayAgain = () => {

}

const changePadCursor = (cursorType) => {

}

const disablePads = () => {
	_gui.pads.forEach(pad => pad.classList.remove('game_pad--active'));
}