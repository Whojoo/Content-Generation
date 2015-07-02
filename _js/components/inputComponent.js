// THIS CLASS WILL BE CHANGED SOON
var keys = [];

function enableKeyboard()
{
	window.addEventListener("keydown", function (e) 
	{
	  keys[e.keyCode] = true;
	});
	window.addEventListener("keyup", function (e) 
	{
	  keys[e.keyCode] = false;
	});
};

function playerInputComponent(vector)
{
	if (vector.y > 0 && keys[87]) 
	{
		vector.y -= 2;
	}
	if (vector.x > 0 && keys[65]) 
	{
		vector.x -= 2;
	}
	if (keys[83]) 
	{
		vector.y += 2;
	}
	if (keys[68]) 
	{
		vector.x += 2;
	}
};