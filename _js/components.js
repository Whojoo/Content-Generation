var Components = {};

// create a position component
Components.Position = function componentPosition(Vector2)
{
	this.Vector2 = Game.Math.Vector.newVector2();
	// sets position, if no position is given the default is set to 0, 0.
	var params = Vector2 || {};

	this.Vector2.x = Vector2.x || 0;
	this.Vector2.y = Vector2.y || 0;

	this.getPosition = function()
	{
		return Game.Math.Vector.clone(this.Vector2);
	}

	this.setPosition = function(Vector)
	{
		this.Vector2.x = Vector.x;
		this.Vector2.y = Vector.y;
	}

}
Components.Position.prototype.name = 'position';
Game.EntityComponents[Components.Position.prototype.name] = [];

////////////////////////////Player Input Component///////////////////////////////////////
Game.keys = [];
Components.PlayerInput = function componentPlayerInput(positionComponent)
{
	this.posComp = positionComponent;

	this.keyUp = function(e)
	{
		Game.keys[e.keyCode] = false;
	}

	this.keyDown = function(e)
	{
		Game.keys[e.keyCode] = true;
	}

	window.addEventListener("keydown", this.keyDown);
	window.addEventListener("keyup", this.keyUp);

	this.update = function(dt) 
	{
		var Vec = this.posComp.getPosition();
		var speed = 1;

		if (Vec.y > 0 && Game.keys[87]) 
		{
			Vec.y -= speed;
		}
		if (Vec.x > 0 && Game.keys[65]) 
		{
			Vec.x -= speed;
		}
		if (Game.keys[83]) 
		{
			Vec.y += speed;
		}
		if (Game.keys[68]) 
		{
			Vec.x += speed;
		}
		this.posComp.setPosition(Vec);
	}
}
Components.PlayerInput.prototype.name = 'playerInput';
Game.EntityComponents[Components.PlayerInput.prototype.name] = [];
Game.EntityComponents['update'] = [];
Game.EntityComponents['physics'] = [];

////////////////////////////Render Component///////////////////////////////////////
Components.Render = function componentRender(color, pointArray, positionComponent, depth, rotate_scaleComponent)
{
	this.color = color;
	this.pointArray = pointArray;
	this.posComp = positionComponent;
	this.rotscaleComp = rotate_scaleComponent;
	this.depth = depth || 1;
	this.lineWidth = 0;
	this.lineColor = '';

	this.getPersonalMatrix = function()
	{
		var Matrix = Game.Math.Matrix;
		var toReturn = Matrix.newMatrix();

		var pos = this.posComp.getPosition();
		var rot, scale;
		if (typeof(rotscaleComp) != 'undefined')
		{
			rot = rotscaleComp.getRotation();
			scale = rotscaleComp.getScale();
		}
		else
		{
			rot = 0;
			scale = 1;
		}

		toReturn = Matrix.scaleByNumber(scale, toReturn);
		toReturn = Matrix.rotate(rot, toReturn);
		toReturn = Matrix.translate(pos, toReturn);

		return toReturn;
	}

	this.render = function(iDT, oContext)
	{
		var mat = Game.Math.Matrix.multiplyTwoMatrices(
			Game.Camera.viewMatrix, this.getPersonalMatrix());
		var drawArray = [];

		for (var i = 0; i < this.pointArray.length; i++) 
		{
			drawArray.push(Game.Math.Matrix.transformVector(
				this.pointArray[i], mat));
		}

		oContext.beginPath();
		oContext.moveTo(drawArray[drawArray.length - 1].x, drawArray[drawArray.length - 1].y);
		for (var i = 0; i < drawArray.length; i++)
		{
			oContext.lineTo(drawArray[i].x, drawArray[i].y);
		}
		oContext.fillStyle = this.color;
		oContext.fill();

		if (this.lineWidth > 0)
		{
			oContext.lineWidth = this.lineWidth;
			oContext.strokeStyle = this.lineColor;
			oContext.stroke();
		}
	}

	this.addBorder = function(width, color)
	{
		this.lineWidth = width;
		this.lineColor = color;
	}
}

Components.Render.prototype.name = 'render';
Game.EntityComponents[Components.Render.prototype.name] = [];

/////////////////////////////////////Health component////////////////////////////////
Components.Health = function componentHealth(ownerID, max)
{
	this.value = max;
	this.max = max;
	this.ownerID = ownerID;

	this.dropHealth = function(value)
	{
		this.value -= value;
		if (this.value <= 0)
		{
			aEntities[this.ownerID].removeEntity();
		}
	}

	this.addHealth = function(value)
	{
		this.value += value;
		if (this.value > this.max)
			this.value = this.max;
	}
}

Components.Health.prototype.name = 'health';
Game.EntityComponents[Components.Health.prototype.name] = [];
