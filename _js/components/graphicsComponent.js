// THIS CLASS WILL BE CHANGED SOON
function roomRenderComponent ()
{
	// rendering code for rooms
	
}

function playerRenderComponent (IDT, Context, position, size, color)
{
	//rendering code for player
	oContext.beginPath();
	oContext.rect(position.x, position.y, size.x, size.y);
	oContext.fillStyle = color;
	oContext.fill();
}