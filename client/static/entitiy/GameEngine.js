class GameEngine {
	constructor() {
		this.entList = [];
		this.addEntList = [];
	}

	update() {
		for(int i = 0; i < this.addEntList.length; i++) {
			this.entList.push(new EntityFactory[this.addEntList[i]]);
		}

		this.entList.sort(function(a, b) {
			return a.zIndex < b.zIndex;
		});

		for(int i = 0; i < this.entList.length; i++) {
			this.entList[i].update();
		}
	}

	draw() {
		for(int i = 0; i < entList.length; i++) {
			this.entList[i].draw();
		}
	}
}

gGameEngine = new GameEngine();