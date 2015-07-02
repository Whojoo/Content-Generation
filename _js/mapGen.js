var iLeft = 0, iRight = 1, iTop = 2, iBottom = 3;
var isOverview = false;

function generateLevel(width, height, isOverviewDrawn)
{
	isOverview = isOverviewDrawn;
	var oParentRoom = new Room(0, 0, width, height);
	doBSP(oParentRoom, 0);
	if (!isOverview) oParentRoom.removeComponent('render');
	pather(oParentRoom, isOverview);
	selectSpecialRooms();

	return oParentRoom;
}

//Generates the map layout
function doBSP(oParentRoom, depth)
{
	if (depth > 5)
	{
		Game.room[oParentRoom.getID()] = oParentRoom;
		return;
	}

	var bWidth;
	var bHeight;
	var bHorizontalDivision;

	//Height
	bHeight = oParentRoom.height >= Game.areaSize * 4;
	//Width
	bWidth = oParentRoom.width >= Game.areaSize * 4;

	//XOR or in other words, check if only 1 returns true.
	if (!(bWidth && bHeight) && (bWidth || bHeight))
	{ //Only 1 returned true.
		//Enough height = horizontal division (so true) else not (false).
		bHorizontalDivision = bHeight;
	}
	else 
	{ //Neither or both returned true.
		if (bWidth) //Only need to check if one of them is true.
		{
			bHorizontalDivision = Game.Math.randomBool();
		} 
		else
		{
			Game.room[oParentRoom.getID()] = oParentRoom;
			return;
		}
	}

	//Make sure that all values are within accaptable range.
	var iMin = Math.max(0.2, 
		Game.areaSize * 3 / (bHorizontalDivision ? oParentRoom.height : oParentRoom.width));
	
	//Division border and make sure the room has a minimum and maximum size.
	var iDivisionBorderMultiplier;
	iDivisionBorderMultiplier = Game.Math.random(iMin, 1 - iMin);

	//Correct the division border so end results are multipliers of Game.areaSize.
	iDivisionBorderMultiplier = checkMultiplier(iDivisionBorderMultiplier, 
		bHorizontalDivision ? oParentRoom.height : oParentRoom.width);
	
	var oRooms = [];
	var iBorderAddition;
	if (bHorizontalDivision)
	{
		iBorderAddition = Math.floor(oParentRoom.height * iDivisionBorderMultiplier);
		oRooms[0] = new Room(oParentRoom.x, oParentRoom.y, oParentRoom.width, iBorderAddition);
		oRooms[1] = new Room(oParentRoom.x, oParentRoom.y + iBorderAddition, oParentRoom.width, oParentRoom.height - iBorderAddition);
	}
	else
	{
		iBorderAddition = Math.floor(oParentRoom.width * iDivisionBorderMultiplier);
		oRooms[0] = new Room(oParentRoom.x, oParentRoom.y, iBorderAddition, oParentRoom.height);
		oRooms[1] = new Room(oParentRoom.x + iBorderAddition, oParentRoom.y, oParentRoom.width - iBorderAddition, oParentRoom.height);
	}
	
	oParentRoom.oChildRooms = oRooms;
	oRooms[0].oParent = oParentRoom;
	oRooms[1].oParent = oParentRoom;

	if (isOverview)
	{
		oParentRoom.removeComponent('render');
	}
	else
	{
		oRooms[0].removeComponent('render');
		oRooms[1].removeComponent('render');
	}

	doBSP(oRooms[0], depth + 1);
	doBSP(oRooms[1], depth + 1);
}

function checkMultiplier(multiplier, value)
{
	var val1 = Math.floor(value * multiplier);
	var val2 = value - val1;

	if (val1 % Game.areaSize == 0 && val2 % Game.areaSize == 0)
		return multiplier;

	//If val1 is bigger AND val2 can be made smaller
	//OR if val1 is currently too small to be made smaller -> swap
	//The idea is that we shrink the smaller rooms when possible to
	//create more uneven rooms and different maps.
	if ((val1 > val2 && val2 - (val2 % Game.areaSize) >= Game.areaSize) ||
		val1 - (val1 % Game.areaSize) < Game.areaSize)
	{
		val1 = val1 ^ val2;
		val2 = val1 ^ val2;
		val1 = val1 ^ val2;
	}

	var diff = val1 % Game.areaSize;
	val1 -= diff;
	val2 += diff;

	//console.log(value + '|' + val1 + '|' + val2);

	if (val1 % Game.areaSize == 0 && val2 % Game.areaSize == 0)
		return val1 / value;
	
	//HELP! in case of emergencies.
	alert('seriously, help me!!!');
	return multiplier; //Have to return something.
}

function pather(oRoom)
{
	var left, right;
	var leftDefined = false;
	var rightDefined = false;

	//Check for grandchildren.
	if (oRoom.oChildRooms[0].oChildRooms.length > 0)
	{
		left = pather(oRoom.oChildRooms[0]);
		leftDefined = true;
	}
	if (oRoom.oChildRooms[1].oChildRooms.length > 0)
	{
		right = pather(oRoom.oChildRooms[1]);
		rightDefined = true;
	}

	//Now check which of the 3 situations we're in.
	if (leftDefined && rightDefined)
	{ //AND, do both sides have grandchildren?
		var iOrientation = getRoomOrientation(oRoom.oChildRooms[0], oRoom.oChildRooms[1]);
		var bBool = Game.Math.randomBool();
		var tempArr = bBool ? left : right;
		var arrayWithTarget = bBool ? right : left;
		
		var bHorizontalCheck = iOrientation <= iRight;
		var targets = [];

		for (var i = 0; i < arrayWithTarget.length; i++)
		{
			for (var j = 0; j < tempArr.length; j++)
			{
				if (canConnect(arrayWithTarget[i], tempArr[j]))
					targets.push(arrayWithTarget[i]);
			}
		}

		//Finally pick a random target.
		var rand = Math.round(Game.Math.random(0, targets.length - 1));
		var target = targets[rand];
		generatePathBetweenRoomsLoop(tempArr, target);

		for (var i = arrayWithTarget.length - 1; i >= 0; i--) 
		{
			tempArr.push(arrayWithTarget[i]);
		}

		return tempArr;
	}
	else if (leftDefined || rightDefined)
	{ //XOR, are there grandchildren on one side? (if you get here then !AND is already true so only check for OR)
		var target, array;
		if (leftDefined)
		{
			array = left;
			target = oRoom.oChildRooms[1];
		}
		else
		{
			array = right;
			target = oRoom.oChildRooms[0];
		}
		
		generatePathBetweenRoomsLoop(array, target);
		array.push(target);
		return array;
	}
	else
	{ //No grandchildren.
		generatePathBetweenRooms(oRoom.oChildRooms[0], oRoom.oChildRooms[1])
		return [oRoom.oChildRooms[0], oRoom.oChildRooms[1]];
	}
}

function canConnect(room1, room2)
{
	var bool = true;
	if (room1.x == room2.width + room2.x) bool = false;
	else if (room1.y == room2.height + room2.y) bool = false;
	else if (room1.x + room1.width == room2.x) bool = false;
	else if (room1.y + room1.height == room2.y) bool = false;
	
	//No connection so return.
	if (bool) return false;

	//Ok so the 2 connect, now check for plenty of space.
	if (room1.x == room2.x + room2.width || room1.x + room1.width == room2.x)
	{ //Rooms are Left and Right of eachother, so check Top and Bottom.
		var isTop = room1.y < room2.y;
		var top = isTop ? room1 : room2;
		var bottom = isTop ? room2 : room1;

		return top.y + top.height - bottom.y >= Game.tileSize * 4;
	}
	else if (room1.y == room2.y + room2.height || room1.y + room1.height == room2.y)
	{ //Rooms are Top and Bottom of eachother, so check Left and Right.
		var isLeft = room1.x < room2.x;
		var left = isLeft ? room1 : room2;
		var right = isLeft ? room2 : room1;

		return left.x + left.width - right.x >= Game.tileSize * 4;
	}

	console.log('uh oh');
	//If we reach this, then there is no connection possible.
	return !bool;
}

function combineArrays(arr1, arr2)
{
	var toReturn = [];
	for (var i = arr1.length - 1; i >= 0; i--) {
		toReturn.push(arr1[i]);
	}
	for (var i = arr2.length - 1; i >= 0; i--) {
		toReturn.push(arr2[i]);
	}

	return toReturn;
}

function getRoomOrientation(room1, room2)
{
	if (room1.y == room2.y)
	{ //Horizontal orientation.
		return room1.x == room2.x + room2.width + 1 ? iLeft : iRight;
	}
	else
	{ //Vertical orientation.
		return room1.y == room2.y + room2.height + 1 ? iTop : iBottom;
	}
}

function generatePathBetweenRooms(room1, room2)
{
	var yCoord = 0;
	var xCoord = 0;
	var left, right, top, bottom;
	var isHorizontal = false;

	var isLeft = room1.x < room2.x;
	var isTop = room1.y < room2.y;

	top = isTop ? room1 : room2;
	bottom = isTop ? room2 : room1;
	left = isLeft ? room1 : room2;
	right = isLeft ? room2 : room1;

	//At what side do the rooms collide?
	if (room1.x == room2.x + room2.width || room1.x + room1.width == room2.x)
	{ //Rooms are Left and Right of eachother, so check Top and Bottom.
		//Appearently we are horizontal.
		isHorizontal = true;

		//Check if top's bottom is lower or as low as bottom's bottom.
		if (top.y + top.height >= bottom.y + bottom.height)
		{
			yCoord = bottom.y + bottom.height * 0.5;
		}
		else
		{
			yCoord = bottom.y + (top.y + top.height - bottom.y) * 0.5;	
		}
		
		xCoord = right.x;
	}
	else if (room1.y == room2.y + room2.height || room1.y + room1.height == room2.y)
	{ //Rooms are Top and Bottom of eachother, so check Left and Right
		yCoord = bottom.y;

		//Check if left room's right side is bigger than right rooms's right side.
		if (left.x + left.width >= right.x + right.width)
		{
			xCoord = right.x + right.width * 0.5;
		}
		else
		{
			xCoord = right.x + (left.x + left.width - right.x) * 0.5;
		}
	}

	var path = new Path(Game.Math.Vector.newVector2(xCoord, yCoord), isHorizontal);
	if (!isOverview) path.removeComponent('render');

	room1.addPath(path);
	room2.addPath(path);
	path.rooms = [room1, room2];
}

function generatePathBetweenRoomsLoop(array, loner)
{
	var possibleConnections = [];
	
	for (var i = array.length - 1; i >= 0; i--)
	{
		if (canConnect(array[i], loner))
		{
			possibleConnections.push(array[i]);
		}
	}

	var rand = Math.round(Game.Math.random(0, possibleConnections.length - 1))
	var picked = possibleConnections[rand];

	generatePathBetweenRooms(loner, picked);
}

function selectSpecialRooms()
{
	var arr = Game.getRoomArray();

	var ends = [];
	for (var key in Game.room)
	{
		if (Game.room[key].paths.length == 1) 
			ends.push(Game.room[key]);
	}

	Game.endRoom = Game.Math.randomChoice(ends).getID();
	if (isOverview) Game.room[Game.endRoom].replace('blue');

	//Pick a start, can be any but the end room.
	do
	{
		Game.startRoom = arr[Math.floor(Game.Math.random(0, arr.length - 1))].getID();
	} while (Game.startRoom == Game.endRoom);
	if (isOverview) Game.room[Game.startRoom].replace('green');
	Game.currentRoom = Game.startRoom;
	//Add lock and key later on.
}

function isDefined(value)
{
	return !typeof(value) == 'undefined';
}