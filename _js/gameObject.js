var Game = {};
Game.tileSize = 10;
Game.areaSize = Game.tileSize * 20;
Game.tileRowSize = Game.areaSize / Game.tileSize;
Game.areaTiles = Game.tileRowSize * Game.tileRowSize;

//Initialise entity array.
//Initialise specific component arrays after defining they prototype.name
Game.EntityComponents = {};

//Add every updateable in here in the right order.
//Input should be before update and physics after update.
//The last thing is always rendering, but that is in a different loop.
Game.updateCycle = [
	'playerInput',
	'update',
	'physics'];

//Object containing { id: room }. Add by Game.room[room.id] = room;
Game.room = {};

Game.getRoomArray = function()
{
	var arr = [];
	for (var key in Game.room)
	{
		arr.push(Game.room[key]);
	}
	return arr;
};

//Contains the ID of the rooms.
Game.startRoom = 0;
Game.endRoom = 0;
Game.currentRoom = 0;

// PointArray function, should be a width/height component in the far future
Game.getPointArray = function(width, height)
{
	this.width = width;
	this.height = height;
	var pointArray = [];

	pointArray.push(Game.Math.Vector.newVector2(this.width/2, this.height/2));
	pointArray.push(Game.Math.Vector.newVector2(this.width/2, -this.height/2));
	pointArray.push(Game.Math.Vector.newVector2(-this.width/2, -this.height/2));
	pointArray.push(Game.Math.Vector.newVector2(-this.width/2, this.height/2));

	return pointArray;
};
