class Intro extends Phaser.Scene {

	constructor() {
		super({key: 'Intro'});
	}

	preload() {
		this.load.audio('car-door-sound','assets/car-door.mp3');
		this.load.audio('start-car-sound','assets/start-car.mp3');
	}

	create() {
		this.textChunks = [
		"YHuang Lee?", 
		"HUncle Yiu!" 
		// "HFancy seeing you parked here outside Liberty City Prison on my first day of freedom [GRINS]",
		// "YIt’s no coincidence, Huang.", 
		// "YI’m here to pick you up before you have a chance to get into trouble.",
		// "HHold up. [WINKS] you’re NOT here to take me to a strip club?",
		// "Y[FROWNS] Real funny. Have you any idea of the trouble you’ve caused us?",
		// "YOur family honour is besmirched!",
		// "H[LAUGHS] Besmirched? Uncle, it’s 2019, not 1403",
		// "HLook, if you’re not going to let me party, at least let me get behind the wheel",
		// "H[SMILES] Remember teaching me to drive when I was a kid, all those years ago?",
		// "Y[RELUCTANTLY SMILES] I remember, Huang",
		// "YFine. you drive. Head to your father’s house.",
		// "YAnd try not to get us into trouble, ok?"
		]
		this.textChunksCounter = 0;
		this.letterCounter = 0;
		this.text = "";
		this.textSplit = [];
		this.textToDisplay = "";
		this.textBeingWritten = false;
		this.keyA = this.input.keyboard.addKey('A');
		this.prevKeyA = false;
		this.textFinished = false;

		this.carDoorSound = this.sound.add('car-door-sound');
		this.carDoorSoundStarted = false;
		
	}

	update() {
		//This only allows a key to be registered if it is down, and it has not been down before and text is not being written
		if (this.keyA.isDown && !this.prevKeyA && !this.textBeingWritten && this.textFinished == false) {
			if (this.textChunksCounter == this.textChunks.length - 1) { this.textFinished = true }
			this.textToDisplay = ""
			this.startTextEvent();
			this.textBeingWritten = true;
			this.letterCounter = 0;
			this.prevKeyA = true;
		} else if (this.keyA.isUp) {
			this.prevKeyA = false;
		}
		if (this.keyA.isDown && this.textFinished && this.textBeingWritten == false ) {
			if (this.line) { this.line.destroy() };
			this.carDoorSound.play();
			this.carDoorSoundStarted = true;
		}
		if (this.carDoorSoundStarted && !this.carDoorSound.isPlaying) {
			this.startCarSound = this.sound.add('start-car-sound');
			this.startCarSound.play();
			this.time.addEvent({ delay: 5000000000, callback: this.scene.start('LevelOne'), callbackScope: this});	
		}
		


	}
	
	startTextEvent() {
		this.text = this.textChunks[this.textChunksCounter];
		this.textChunksCounter += 1;
		this.textSplit = this.text.split("");
		this.foobar = this.time.addEvent({ delay: 10, callback: this.displayText, callbackScope: this, repeat: this.textSplit.length - 1 });
		
	};

	displayText() {
		if (this.line) { this.line.destroy() };
		this.textToDisplay = this.textToDisplay.concat(this.textSplit[this.letterCounter]);
		this.letterCounter += 1;
		if (this.textToDisplay.split("")[0] == 'H') {
			this.line = this.add.text(100, 400, this.textToDisplay.substr(1), { fontFamily: 'font1', fontSize: 25, fill: 'black', wordWrap: { width: 300} });	
		} else {
			this.line = this.add.text(100, 100, this.textToDisplay.substr(1), { fontFamily: 'font1', fontSize: 25, wordWrap: { width: 300} });	
		}
		if (this.textToDisplay == this.text) {this.textBeingWritten = false}
	};

}