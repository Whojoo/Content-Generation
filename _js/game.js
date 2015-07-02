var oCanvas;
var oContext;
var oGame;
var oRooms;
var preSize = Game.tileSize * 10;
var iWidth = preSize * 16 * 2;
var iHeight = preSize * 9 * 2;
var isOverview = true;

function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

//60 fps as target.
var iStep = 1 / 60;
var iNow, iDeltaTime, iLast = timestamp();

function loop()
{
	iNow = timestamp();
	//Maximum delta of 1 second.
	iDeltaTime = Math.min(1, (iNow - iLast) * 0.001);

	while (iDeltaTime > iStep)
	{
		iDeltaTime -= iStep;
		update(iStep);
	}

	//Send the remainder of delta time to the render.
	render(iDeltaTime);

	iLast = iNow;

	requestAnimationFrame(loop);
}

function update(iDT)
{
	//Update cycle here.
	oContext.clearRect(0, 0, iWidth, iHeight);

	for (var i = 0; i < Game.updateCycle.length; i++)
	{
		var key = Game.updateCycle[i];
		for (var j = Game.EntityComponents[key].length - 1; j >= 0; j--)
		{
			Game.EntityComponents[key][j].update(iDT);
		}
	}

	//Lastly update the camera so values sync.
	Game.Camera.update();
}

function render(iDT)
{
	//Render cycle here.
	oContext.clearRect(0, 0, iWidth, iHeight);

	//Get the array.
	var renderables = Game.EntityComponents['render'];
	
	//Now render everything.
	for (var i = 0; i < renderables.length; i++)
	{
		renderables[i].render(iDT, oContext);
	}
}

function startGame()
{
	//Generate the level.
	oRooms = generateLevel(iWidth, iHeight, isOverview);

	Game.Camera.create(Game.Math.Vector.newVector2(1280, 720), Game.Math.Vector.newVector2(iWidth, iHeight));
	if (isOverview)
	{
		Game.Camera.fScale = 1280 / iWidth;
	}

	requestAnimationFrame(loop);

}

window.onload = function() {
	oCanvas = document.getElementById("canvas");
	oContext = oCanvas.getContext("2d");

	startGame();
};