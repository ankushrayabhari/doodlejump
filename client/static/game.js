var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

ctx.translate(0, canvas.height);
ctx.scale(1, -1);

var gravity = new Box2D.b2Vec2(0.0, -10.0);
var world = new Box2D.b2World(gravity);

var fallingObject = new Box2D.b2BodyDef();
fallingObject.set_fixedRotation(true);
fallingObject.set_type(Box2D.b2_dynamicBody);
var verts = [];
verts.push( new Box2D.b2Vec2( 12,12 ) );
verts.push( new Box2D.b2Vec2( 12,15 ) );
verts.push( new Box2D.b2Vec2( 15, 15 ) );
verts.push( new Box2D.b2Vec2( 15, 12 ) );
var shape = createPolygonShape( verts );
var fixtureDef = new Box2D.b2FixtureDef();
fixtureDef.set_density( 2.5 );
fixtureDef.set_friction( 0.6 );
fixtureDef.set_restitution( 1 );
fixtureDef.set_shape( shape );
var Player = world.CreateBody(fallingObject);
Player.CreateFixture(fixtureDef);

var ground = new Box2D.b2BodyDef();
var shape1 = new Box2D.b2EdgeShape();
shape1.Set(new Box2D.b2Vec2(0.0, 5.0), new Box2D.b2Vec2(25.0, 5.0));
world.CreateBody(ground).CreateFixture(shape1, 0.0);

debugDraw = getCanvasDebugDraw();
debugDraw.SetFlags(0x0001);
world.SetDebugDraw(debugDraw);

var force = new Box2D.b2Vec2(0.0, 0.0);

function gameLoop() {
	world.Step(1/60, 10, 10);
	world.ClearForces();

	var position = Player.GetPosition();
	
	if(position.get_x() < -15) Player.SetTransform(new Box2D.b2Vec2(12, position.get_y()), 0);
	if(position.get_x() > 13) Player.SetTransform(new Box2D.b2Vec2(-14, position.get_y()), 0);

	var force = new Box2D.b2Vec2(0.0, 0.0);

	if(Input.isKeyLeft()) {
		force.set_x(-500);
	}

	if(Input.isKeyRight()) {
		force.set_x(500);
	}

	Player.ApplyForceToCenter(force, true);






	ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgb(255,255,0)';
    world.DrawDebugData();

	requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);