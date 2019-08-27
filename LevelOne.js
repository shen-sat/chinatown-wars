class LevelOne extends Phaser.Scene {

	constructor() {
		super({key: 'LevelOne'});
	}

	preload() {
		this.load.image('car', 'assets/car.png');
		this.load.image('road-bg', 'assets/road-bg.png');
		this.load.image('shen-presents', 'assets/shen-presents.png');
		this.load.image('de-make', 'assets/a-de-make-production.png');
		this.load.image('logo', 'assets/logo.png');
		this.load.image('coming-soon', 'assets/coming-soon.png');
		this.load.audio('theme','assets/theme-short.mp3');
		
		
	}

	create() {
		
		
		this.road = this.add.tileSprite(128, 256, 32, 128, "road-bg");
		// this.physics.add.existing(this.road, true);
		this.roadScaleFactor = 4;
		this.road.setScale(this.roadScaleFactor);
		//create static borders for the road
		this.roadBorders = this.physics.add.staticGroup();
		this.roadBorders.create(this.road.x - this.road.displayWidth/2, this.road.displayHeight/2).setSize(1, this.road.displayHeight).setAlpha(0);
		this.roadBorders.create(this.road.x + this.road.displayWidth/2, this.road.displayHeight/2).setSize(1, this.road.displayHeight).setAlpha(0);

		this.car = this.physics.add.image(120, 448.0, 'car');
		this.car.body.isCircle = true;
		this.car.setScale(2);

		this.ghost = this.physics.add.sprite(350, 448.0, '').setAlpha(0);


		this.keys = this.input.keyboard.createCursorKeys();
		
		this.speed = 0;
		this.acceleration = 5;
		this.drag = 3;
		this.speedUpperLimit = 150;
		this.speedLowerLimit = -this.speedUpperLimit;
		this.carIsMovingForward = false;
		this.carAtScreenHalfway = false;
		this.startPosY = this.ghost.y;
		this.startPosX = this.ghost.x;

		this.gameWindowHeight = this.sys.game.config.height;

		this.physics.add.collider(this.car, this.roadBorders);

		this.music = this.sound.add('theme');
		this.musicVolume = 0.2;
		this.music.setVolume(this.musicVolume);
		

		
		this.music.play();

		this.music.mute = true;
		this.music.seek = 15;
		this.shenPresentsDone = false;
		this.demakeDone = false;
		this.logoDone = false;
		this.comingSoonDone = false;
		this.prevKeyW = false;
		this.finished = false;
		this.soundDecreaser = 0.005



		

		
	}

	update() {
		// this.line = this.add.text(256, 256, this.counter.toString(), { fontFamily: 'font1', fontSize: 30 });
		if (this.car.y < this.gameWindowHeight/2) { this.carAtScreenHalfway = true }; 
		//Moving forward and backwards
		if (this.keys.up.isDown) {
			this.speed = Math.min(this.speedUpperLimit, this.speed + this.acceleration); 
		} else if (this.keys.down.isDown) {
			this.speed = Math.max(this.speedLowerLimit, this.speed - this.acceleration); 
		} else {
			this.speed = this.speed > 0 ? Math.max(0, this.speed -= this.drag) : Math.min(0, this.speed += this.drag);	
		}
		//Turning
		if (this.speed != 0) {
			if (this.keys.right.isDown) {
				this.speed > 0 ? this.car.angle += 2 : this.car.angle -= 2;
				this.speed > 0 ? this.ghost.angle += 2 : this.ghost.angle -= 2;
			} else if (this.keys.left.isDown) {
				this.speed > 0 ? this.car.angle -= 2 : this.car.angle += 2;
				this.speed > 0 ? this.ghost.angle -= 2 : this.ghost.angle += 2;
			}	
		}
		//Applying velocity, based on speed
		if (this.carAtScreenHalfway == false) {
			this.physics.velocityFromAngle(this.car.angle + 90, -this.speed, this.car.body.velocity);
		} else {
			this.physics.velocityFromAngle(this.car.angle + 90, -this.speed, this.car.body.velocity);
			//set forward/backwards velocity to zero if car reaches middle of window 
			this.car.setVelocity(this.car.body.velocity.x, 0);
			//set velocity on ghost
			this.physics.velocityFromAngle(this.ghost.angle + 90, -this.speed, this.ghost.body.velocity);
			//work out how far ghost has travelled since last update loop
			this.travel = this.startPosY - this.ghost.y;
			//reset ghost Y position so the game doesn't have to calculate its position beyond window
			this.ghost.y = this.startPosY;
			//reset ghost X position so the game doesn't have to calculate its position beyond window
			this.ghost.x = this.startPosX;
			//set road scroll speed depending on how far ghost has travelled
			this.road._tilePosition.y -= this.travel/this.roadScaleFactor;
			
		}	
		if (this.speed > 0) {
			this.music.mute = false;
			this.music.resume();
			this.music.rate = this.speed/150;
		} else {
			this.reversePlayback = this.speed/150
			this.music.pause();
		}
		// console.log(this.music.seek);
		
		if (this.music.seek > 20 && this.shenPresentsDone == false) {
			this.shenPresents = this.add.image(350, 256, 'shen-presents');
			this.shenPresentsDone = true;
		}
		if (this.music.seek > 23) {
			if (this.shenPresents) { this.shenPresents.destroy() }; 
		}

		if (this.music.seek > 25 && this.demakeDone == false) {
			this.demake = this.add.image(350, 256, 'de-make');
			this.demakeDone = true;
		}
		if (this.music.seek > 28) {
			if (this.demake) { this.demake.destroy() };  
		}
		if (this.music.seek > 30 && this.logoDone == false) {
			this.logo = this.add.image(350, 256, 'logo');
			this.logo.setScale(0.75);
			this.logoDone = true;
		}
		if (this.music.seek > 35.5) {
			if (this.logo) { this.logo.destroy() };  
		}
		if (this.music.seek > 35.5 && this.comingSoonDone == false) {
			this.comingSoon = this.add.image(350, 256, 'coming-soon');
			this.comingSoonDone = true;
		}
		if (this.music.seek > 35.5 && this.finished == false) {
			this.fadeOutEverything();
			this.finished = true;
		}
		
		// if (this.music.config.volume > 0) {this.music.stop()}
		if (this.music.seek > 10) {
			this.musicVolume = this.musicVolume - 0.0005;
			this.music.setVolume(this.musicVolume);
			console.log(this.music.config.volume);
			
		}
		if (this.music.config.volume < 0) {this.music.stop()}
		//30 logo appears, 35 coming soon appears and fade to black and volume decreases

	}

	fadeOutEverything() {
		this.cameras.main.fadeOut(5000);
	}
	

}