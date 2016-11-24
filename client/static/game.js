var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

ctx.translate(0, canvas.height);
ctx.scale(1, -1);

var gravity = new Box2D.b2Vec2(0.0, -10.0);
var world = new Box2D.b2World(gravity);

var fallingObject = new Box2D.b2BodyDef();
fallingObject.set_type(Box2D.b2_dynamicBody);
var verts = [];
verts.push( new Box2D.b2Vec2( 10,10 ) );
verts.push( new Box2D.b2Vec2( 10,15 ) );
verts.push( new Box2D.b2Vec2( 15, 15 ) );
verts.push( new Box2D.b2Vec2( 15, 10 ) );
var shape = createPolygonShape( verts );
var fixtureDef = new Box2D.b2FixtureDef();
fixtureDef.set_density( 2.5 );
fixtureDef.set_friction( 0.6 );
fixtureDef.set_restitution( 1 );
fixtureDef.set_shape( shape );
world.CreateBody(fallingObject).CreateFixture(fixtureDef);

var ground = new Box2D.b2BodyDef();
var shape1 = new Box2D.b2EdgeShape();
shape1.Set(new Box2D.b2Vec2(0.0, 5.0), new Box2D.b2Vec2(25.0, 5.0));
world.CreateBody(ground).CreateFixture(shape1, 0.0);

debugDraw = getCanvasDebugDraw();
debugDraw.SetFlags(0x0001);
world.SetDebugDraw(debugDraw);

function gameLoop() {
	world.Step(1/60, 10, 10);

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgb(255,255,0)';
    world.DrawDebugData();

	requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);