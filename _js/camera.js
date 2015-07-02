Game.Camera = {
	viewMatrix: Game.Math.Matrix.newMatrix(),
	position: Game.Math.Vector.newVector2(),
	screenSize: Game.Math.Vector.newVector2(),
	worldSize: Game.Math.Vector.newVector2(),
	fRotation: 0, 
	fScale: 1,
	iUpperZoomLimit: 1, 
	iLowerZoomLimit: 1,

	create: function(screenVector, worldVector)
	{
		this.screenSize = screenVector;
		this.worldSize = worldVector;

		this.position = Game.Math.Vector.multiply(screenVector, 0.5);
		this.setViewMatrix();
	},

	move: function(velocity)
	{
		this.position = this.adjustToBarriers(Game.Math.Vector.add(this.position, velocity));
	},

	moveTo: function(end)
	{
		this.position = this.adjustToBarriers(end);
	},

	adjustToBarriers: function(vec)
	{
		/*
		 * Calculate the barriers. Keep in mind that the scale can change the barriers. That's why you have to
		 * divide the screensize with the scale to compensate for the scale. Besides of that, the position of the screen is in the 
		 * center of the screen. Which means the position is at the screens's halfsizes. So you have to divide the screensize by 2.
		 * Since we're already dividing by scale, lets just divide by (scale * 2).
		 * Put the divided screensize in a new instance so we don't have to calculate over and over again.
		 */
		var tempScreen = Game.Math.Vector.divide(this.screenSize, this.fScale * 2);
		var left = tempScreen.x;
		var right = this.worldSize.x - tempScreen.x;
		var top = tempScreen.y;
		var bottom = this.worldSize.y - tempScreen.y;
		var toCorrect = Game.Math.Vector.clone(vec);

		//Correct if neccesary.
		if (toCorrect.x < left) 
			toCorrect.x = left;
		else if (toCorrect.x > right) 
			toCorrect.x = right;

		if (toCorrect.y < top) 
			toCorrect.y = top;
		else if (toCorrect.y > bottom) 
			toCorrect.y = bottom;

		return toCorrect;
	},

	setViewMatrix: function()
	{
		var Matrix = Game.Math.Matrix;
		var Vector = Game.Math.Vector;
		var transformMatrix = Matrix.newMatrix();
		
		transformMatrix = Matrix.translate(Vector.inverse(this.position), transformMatrix);			//Translate to (0, 0).
		transformMatrix = Matrix.scaleByNumber(this.fScale, transformMatrix);						//Scale.
		transformMatrix = Matrix.rotate(this.fRotation, transformMatrix);							//Rotate in center.
		transformMatrix = Matrix.translate(Vector.multiply(this.screenSize, 0.5 * this.fScale), transformMatrix);	//Translate to screen center.

		this.viewMatrix = transformMatrix;
	},

	update: function()
	{
		this.setViewMatrix();
	},

	rotate: function(rotationInRadians)
	{
		this.fRotation += rotationInRadians;

		var twoPI = Math.PI * 2;

		if (fRotation > twoPI)
			fRotation -= twoPI;
		else if (fRotation < 0)
			fRotation += twoPI;
	}
}