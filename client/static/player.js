var Player = {
	body: null,
	init: function() {
		var fallingObject = new Box2D.b2BodyDef();
		fallingObject.set_fixedRotation(true);
		fallingObject.set_type(Box2D.b2_dynamicBody);
		fallingObject.set_position(new Box2D.b2Vec2(12, 15));
		var shape = new Box2D.b2PolygonShape;
		shape.SetAsBox(1.5, 1.5);
		var fixtureDef = new Box2D.b2FixtureDef();
		fixtureDef.set_density( 2.5 );
		fixtureDef.set_friction( 0.6 );
		fixtureDef.set_restitution( 1 );
		fixtureDef.set_shape( shape );
		this.body = world.CreateBody(fallingObject);
		fixtureDef.set_userData(1);
		this.body.CreateFixture(fixtureDef);
		this.body.SetLinearDamping(0.1);
	},
	jump: function() {
		var force = new Box2D.b2Vec2(0.0, 150.0);
		this.body.ApplyLinearImpulse(force, this.body.GetWorldCenter());
	},
	update: function() {
		var position = this.body.GetPosition();
	
		if(position.get_x() < 0) this.body.SetTransform(new Box2D.b2Vec2(25, position.get_y()), 0);
		if(position.get_x() > 25) this.body.SetTransform(new Box2D.b2Vec2(0, position.get_y()), 0);

		var force = new Box2D.b2Vec2(0.0, 0.0);

		if(Input.isKeyLeft()) {
			force.set_x(-500);
		}

		if(Input.isKeyRight()) {
			force.set_x(500);
		}

		this.body.ApplyForceToCenter(force, true);
	}
};
