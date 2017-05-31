var Input = {
	keyLeft: false, 
	keyRight: false,
	keyShoot: false,
	isKeyLeft: function() {
		return this.keyLeft;
	},
	isKeyRight: function() {
		return this.keyRight;
	},
	isKeyShoot: function() {
		return this.keyShoot;
	}
};

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 65) {
        Input.keyLeft = true;
    }
    else if(event.keyCode == 68) {
        Input.keyRight = true;
    }
});

document.addEventListener('keyup', function(event) {
    if(event.keyCode == 65) {
        Input.keyLeft = false;
    }
    else if(event.keyCode == 68) {
        Input.keyRight = false;
    }
});
