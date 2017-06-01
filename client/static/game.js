var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

ctx.translate(0, canvas.height);
ctx.scale(1, -1);

var gravity = new Box2D.b2Vec2(0.0, -10.0);
var world = new Box2D.b2World(gravity);

var listener = new Box2D.JSContactListener();


listener.BeginContact = function(contactPtr) {
	var contact = Box2D.wrapPointer( contactPtr, Box2D.b2Contact );
	var fixA = contact.GetFixtureA();
	var fixB = contact.GetFixtureB();

	if(fixA.GetUserData() == 1 && fixB.GetUserData() == 2) {
		var platformBody = fixB.GetBody();
		var playerBody = fixA.GetBody();

		var manifold = new Box2D.b2WorldManifold;
		contact.GetWorldManifold(manifold);

		var points = contact.GetManifold().get_pointCount();

		for(var i = 0; i < points; i++) {
			var pointVel = playerBody.GetLinearVelocityFromWorldPoint(manifold.get_points(i));
			if(pointVel.get_y() < 0) return;
		}

		contact.SetEnabled(false);
	}
	else if(fixB.GetUserData() == 1 && fixA.GetUserData() == 2) {
		var platformBody = fixA.GetBody();
		var playerBody = fixB.GetBody();

		var manifold = new Box2D.b2WorldManifold;
		contact.GetWorldManifold(manifold);
		
		var points = contact.GetManifold().get_pointCount();

		for(var i = 0; i < points; i++) {
			var pointVel = playerBody.GetLinearVelocityFromWorldPoint(manifold.get_points(i));
			if(pointVel.get_y() < 0) return;
		}

		contact.SetEnabled(false);
	}
}

listener.EndContact = function(contactPtr) {
	var contact = Box2D.wrapPointer( contactPtr, Box2D.b2Contact );
	contact.SetEnabled(true);
}

listener.PostSolve = function(contactPtr) {
	var contact = Box2D.wrapPointer( contactPtr, Box2D.b2Contact );
	var fixA = contact.GetFixtureA();
	var fixB = contact.GetFixtureB();
	if(fixA.GetUserData() == 1 && fixB.GetUserData() == 2) {
		Player.jump();
	}
	else if(fixB.GetUserData() == 1 && fixA.GetUserData() == 2) {
		Player.jump();
	}
}

listener.PreSolve = function(contact) {}

world.SetContactListener(listener);

Player.init();

var ground = new Box2D.b2BodyDef();
var shape1 = new Box2D.b2EdgeShape();
shape1.Set(new Box2D.b2Vec2(0.0, 2.0), new Box2D.b2Vec2(25.0, 2.0));
world.CreateBody(ground).CreateFixture(shape1, 0.0);

var Camera = {
	y: 0
};




debugDraw = getCanvasDebugDraw();
debugDraw.SetFlags(0x0001);
world.SetDebugDraw(debugDraw);

var platforms = [];
platforms.push(new Platform(5,10));

function gameLoop() {
	world.Step(1/60, 10, 10);
	world.ClearForces();
	
	Player.update();

	for(var i = 0; i < platforms.length; i++) {
		platforms[i].update();
	}
	

	Camera.y = -Player.body.GetPosition().get_y()+10;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgb(255,255,0)';

    ctx.save();
    ctx.translate(0, Camera.y*20);
    world.DrawDebugData();
    ctx.restore();

	requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);