class Intro extends Phaser.Scene {

	constructor() {
		super({key: 'Intro'});
	}

	preload() {

	}

	create() {
		this.textChunks = ["Hello", "\nworld"];
		this.textChunksCounter = 0;
		this.letterCounter = 0;
		this.text = "";
		this.textSplit = [];
		this.textToDisplay = "";
		this.textBeingWritten = false;
		this.keyA = this.input.keyboard.addKey('A');
		this.prevKeyA = false;
		//this.scene.start('LevelOne'); TO START NEXT SCENE!
	}

	update() {
		//This only allows a key to be registered if it is down, and it has not been down before and text is not being written
		if (this.keyA.isDown && !this.prevKeyA && !this.textBeingWritten) {
			this.startTextEvent();
			this.textBeingWritten = true;
			this.letterCounter = 0;
			this.prevKeyA = true;
		} else if (this.keyA.isUp) {
			this.prevKeyA = false;
		}
		


	}
	
	startTextEvent() {
		this.text = this.textChunks[this.textChunksCounter];
		this.textChunksCounter += 1;
		this.textSplit = this.text.split("");
		this.foobar = this.time.addEvent({ delay: 100, callback: this.displayText, callbackScope: this, repeat: this.textSplit.length - 1 });
		
	};

	displayText() {
		if (this.line) { this.line.destroy() };
		this.textToDisplay = this.textToDisplay.concat(this.textSplit[this.letterCounter]);
		this.letterCounter += 1;
		this.line = this.add.text(256, 256, this.textToDisplay, { fontFamily: 'font1', fontSize: 30 });
		if (this.textToDisplay == this.text) {this.textBeingWritten = false}
	};

}