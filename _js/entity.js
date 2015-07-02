var aEntities = {};

aEntities.Entity = function Entity()
{
	var date = new Date;
	var newDate = date.getSeconds() + date.getMinutes() + date.getHours();

	// first give the entity a random id (with time, random, and # of entities)
	this.id = (+newDate).toString(16) + 
		(Math.random * 100000000 | 0).toString(16) + 
			aEntities.Entity.prototype.count;

	//increment total number of entities
	aEntities.Entity.prototype.count++;

	//Add to a global list.
	aEntities[this.id] = this;

	// add a component data container to this object
	this.components = {};
}

// keep track of created entities
aEntities.Entity.prototype.count = 0;

aEntities.Entity.prototype.addComponent = function addComponent(component)
{
	// add component data to the entity
	this.components[component.name] = component;
	Game.EntityComponents[component.name].push(component);
	return this;
}

aEntities.Entity.prototype.savedComponents = {};
aEntities.Entity.prototype.save = function()
{
	for (var key in this.components)
	{
		this.savedComponents[key] = this.components[key];
		this.removeComponent(key);
	}
}

aEntities.Entity.prototype.load = function()
{
	for (var key in this.savedComponents)
	{
		this.addComponent(this.savedComponents[key]);
		this.removeComponent(key, true);
	}
}

aEntities.Entity.prototype.removeComponent = function removeComponent(componentName, fromSaved)
{
	// remove component data y removing its reference
	var name = componentName;

	if(typeof componentName === 'function')
	{
		// get the name of the function if a component function has been passed
		name = componentName.prototype.name;
	}

	if (!fromSaved)
	{
		// remove the reference to the component
		Game.EntityComponents[name].splice(Game.EntityComponents[name].indexOf(this.components[name]), 1);
		delete this.components[name];
	}
	else
	{
		delete this.savedComponents[name];
	}
}

aEntities.Entity.prototype.removeEntity = function()
{
	for (var key in this.components)
	{
		this.removeComponent(key);
	}

	delete aEntities[this.id];
}

aEntities.Entity.prototype.getComponent = function getComponent(componentName)
{
	var name = componentName;
	return this.components[name];
}

aEntities.Entity.prototype.print = function print()
{
	// prints entity data to the console, can be used for saving
	console.log(JSON.stringify(this, null, 4));
}