var PIXELSPERMETER = 20;

function drawAxes(ctx) {
    ctx.strokeStyle = 'rgb(192,0,0)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(1, 0);
    ctx.stroke();
    ctx.strokeStyle = 'rgb(0,192,0)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 1);
    ctx.stroke();
}

function setColorFromDebugDrawCallback(color) {            
    var col = Box2D.wrapPointer(color, Box2D.b2Color);
    var red = (col.get_r() * 255)|0;
    var green = (col.get_g() * 255)|0;
    var blue = (col.get_b() * 255)|0;
    var colStr = red+","+green+","+blue;
    ctx.fillStyle = "rgba("+colStr+",0.5)";
    ctx.strokeStyle = "rgb("+colStr+")";
}

function drawSegment(vert1, vert2) {
    var vert1V = Box2D.wrapPointer(vert1, Box2D.b2Vec2);
    var vert2V = Box2D.wrapPointer(vert2, Box2D.b2Vec2);

    ctx.beginPath();
    ctx.moveTo(vert1V.get_x()*PIXELSPERMETER,vert1V.get_y()*PIXELSPERMETER);
    ctx.lineTo(vert2V.get_x()*PIXELSPERMETER,vert2V.get_y()*PIXELSPERMETER);
    ctx.stroke();
}

function drawPolygon(vertices, vertexCount, fill) {
    ctx.beginPath();
    for(tmpI=0;tmpI<vertexCount;tmpI++) {
        var vert = Box2D.wrapPointer(vertices+(tmpI*8), Box2D.b2Vec2);
        if ( tmpI == 0 )
            ctx.moveTo(vert.get_x()*PIXELSPERMETER,vert.get_y()*PIXELSPERMETER);
        else
            ctx.lineTo(vert.get_x()*PIXELSPERMETER,vert.get_y()*PIXELSPERMETER);
    }
    ctx.closePath();
    if (fill)
        ctx.fill();
    ctx.stroke();
}

function drawCircle(center, radius, axis, fill) {                    
    var centerV = Box2D.wrapPointer(center, Box2D.b2Vec2);
    var axisV = Box2D.wrapPointer(axis, Box2D.b2Vec2);
    
    ctx.beginPath();
    ctx.arc(centerV.get_x()*PIXELSPERMETER,centerV.get_y()*PIXELSPERMETER, radius*PIXELSPERMETER, 0, 2 * Math.PI, false);
    if (fill)
        ctx.fill();
    ctx.stroke();
    
    if (fill) {
        //render axis marker
        var vert2V = copyVec2(centerV);
        vert2V.op_add( scaledVec2(axisV, radius) );
        ctx.beginPath();
        ctx.moveTo(centerV.get_x()*PIXELSPERMETER,centerV.get_y()*PIXELSPERMETER);
        ctx.lineTo(vert2V.get_x()*PIXELSPERMETER,vert2V.get_y()*PIXELSPERMETER);
        ctx.stroke();
    }
}

function drawTransform(transform) {
    var trans = Box2D.wrapPointer(transform,Box2D.b2Transform);
    var pos = trans.get_p();
    var rot = trans.get_q();
    
    ctx.save();
    ctx.translate(pos.get_x()*PIXELSPERMETER, pos.get_y()*PIXELSPERMETER);
    ctx.scale(0.5,0.5);
    ctx.rotate(rot.GetAngle());
    ctx.lineWidth *= 2;
    drawAxes(ctx);
    ctx.restore();
}

function getCanvasDebugDraw() {
    var debugDraw = new Box2D.JSDraw();

    debugDraw.DrawSegment = function(vert1, vert2, color) {
        setColorFromDebugDrawCallback(color);
        drawSegment(vert1, vert2);
    };

    debugDraw.DrawPolygon = function(vertices, vertexCount, color) {
        setColorFromDebugDrawCallback(color);
        drawPolygon(vertices, vertexCount, false);
    };

    debugDraw.DrawSolidPolygon = function(vertices, vertexCount, color) {
        setColorFromDebugDrawCallback(color);
        drawPolygon(vertices, vertexCount, true);
    };

    debugDraw.DrawCircle = function(center, radius, color) {
        setColorFromDebugDrawCallback(color);
        var dummyAxis = Box2D.b2Vec2(0,0);
        drawCircle(center, radius, dummyAxis, false);
    };

    debugDraw.DrawSolidCircle = function(center, radius, axis, color) {
        setColorFromDebugDrawCallback(color);
        drawCircle(center, radius, axis, true);
    };

    debugDraw.DrawTransform = function(transform) {
        drawTransform(transform);
    };

    return debugDraw;
}