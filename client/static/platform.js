var Platform = function(x, y) {
	this.position = new Box2D.b2Vec2(x,y);

	var objectDef = new Box2D.b2BodyDef();
	objectDef.set_fixedRotation(true);
	objectDef.set_type(Box2D.b2_dynamicBody);
	objectDef.set_position(new Box2D.b2Vec2(x, y));
	var shape = new Box2D.b2PolygonShape;
	shape.SetAsBox(1, 0.5);
	var fixtureDef = new Box2D.b2FixtureDef();
	fixtureDef.set_density( 2.5 );
	fixtureDef.set_friction( 0.6 );
	fixtureDef.set_restitution( 1 );
	fixtureDef.set_shape( shape );

	this.body = world.CreateBody(objectDef);

	fixtureDef.set_userData(2);

	this.body.CreateFixture(fixtureDef);
}

Platform.prototype.update = function() {
	this.body.SetTransform(this.position, 0);
};