function Room(x, y, width, height)
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.oChildRooms = [];
	this.entity = new aEntities.Entity();
	this.entities = {};
	this.hasEntities = false;
	this.paths = [];
	var oPaths = [];
	this.oParent;

	this.create = function()
	{
		var Vector = Game.Math.Vector;
		var pos = new Components.Position(Vector.newVector2(this.x, this.y));

		var pointArray = [];

		pointArray.push(Vector.newVector2(0, 0));
		pointArray.push(Vector.newVector2(this.width, 0));
		pointArray.push(Vector.newVector2(this.width, this.height));
		pointArray.push(Vector.newVector2(0, this.height));

		var render = new Components.Render('yellow', pointArray, pos, 1);
		render.addBorder(7, 'black');

		this.entity.addComponent(pos);
		this.entity.addComponent(render);
	}
	this.create();

	this.addPath = function(path)
	{
		this.paths.push(path);
	}

	this.addComponent = function(component)
	{
		this.entity.addComponent(component);
	}

	this.removeComponent = function(name)
	{
		this.entity.removeComponent(name);
	}

	this.getComponent = function(name)
	{
		return this.entity.getComponent(name);
	}

	this.replace = function(color)
	{
		this.removeComponent('render');

		var Vector = Game.Math.Vector;
		var pos = this.entity.getComponent('position');

		var pointArray = [];

		pointArray.push(Vector.newVector2(0, 0));
		pointArray.push(Vector.newVector2(this.width, 0));
		pointArray.push(Vector.newVector2(this.width, this.height));
		pointArray.push(Vector.newVector2(0, this.height));

		var render = new Components.Render(color, pointArray, pos, 1);
		render.addBorder(7, 'black');

		this.entity.addComponent(render);
	}

	this.getID = function()
	{
		return this.entity.id;
	}

	this.save = function()
	{
		this.hasEntities = true;
		for (var key in this.entities)
		{
			this.entities[key].save();
		}
	}

	this.load = function()
	{
		for (var key in this.entities)
		{
			this.entities[key].load();
		}
	}
}

function Path(position, isHorizontal)
{
	this.position = position;
	this.entity = new aEntities.Entity();
	this.rooms;
	this.create(isHorizontal);
}

Path.prototype.addComponent = function(name) 
{
	this.entity.addComponent(name);
}

Path.prototype.removeComponent = function(name) 
{
	this.entity.removeComponent(name);
}

Path.prototype.getComponent = function(name)
{
	return this.entity.getComponent(name);
}

Path.prototype.create = function(isHorizontal) 
{
	var posComp = new Components.Position(this.position);
	this.entity.addComponent(posComp);

	var pointArray = [];
	var Vector = Game.Math.Vector;
	var x = isHorizontal ? 14 : 3.5;
	var y = isHorizontal ? 3.5 : 14;

	pointArray.push(Vector.newVector2(x, y));
	pointArray.push(Vector.newVector2(x, -y));
	pointArray.push(Vector.newVector2(-x, -y));
	pointArray.push(Vector.newVector2(-x, y));

	this.entity.addComponent(new Components.Render('red', pointArray, posComp, 2));
}

Path.prototype.switchRoom = function()
{
	var currentRoom = Game.room[Game.currentRoom];
	currentRoom.save();
	var otherRoom = currentRoom.getID() == this.rooms[0].getID() ? this.rooms[1] : this.rooms[0]; 
	Game.currentRoom = otherRoom.getID();
	gameRoom.startRoom();
}