Game.Math.Vector = {
	
	/**
	 * Creates a new instance of Vector2.
	 * @param	x The x value for this vector.
	 * @param	y The y value for this vector.
	 */
	newVector2: function(xcoord, ycoord) 
	{
		var obj = {
			x: typeof(xcoord) == 'undefined' ? 0 : xcoord,
			y: typeof(ycoord) == 'undefined' ? 0 : ycoord,

			stringify: function()
			{
				return '( ' + this.x + ' | ' + this.y + ' )';
			}
		}
		
		return obj;
	},
	
	/**
	 * Adds to vector to eachother.
	 * @param	v1 The first vector.
	 * @param	v2 The second vector.
	 * @return A new instance of Vector2 which is the sum of the 2 given vectors.
	 */
	add: function(v1, v2)
	{
		var newX = v1.x + v2.x;
		var newY = v1.y + v2.y;
		return this.newVector2(newX, newY);
	},
	
	/**
	 * Clones this vector.
	 * @return A newVector2 instance with the same values as this one.
	 */
	clone: function(vector)
	{
		return this.newVector2(vector.x, vector.y);
	},
	
	/**
	 * Calculates the distance between 2 vectors.
	 * @param	vec1 The first vector.
	 * @param	vec2 The second vector.
	 * @return The distance between the vectors as a Number.
	 */
	dist: function(vec1, vec2)
	{
		return this.subtract(vec1, vec2).length();
	},
	
	/**
	 * Calculates the squared distance between 2 vectors. This method skips the square root. This method can be usefull 2 compare 2
	 * distances with eachother.
	 * @param	vec1 The first vector.
	 * @param	vec2 The second vector.
	 * @return The squared distance between the 2 vectors as a Number.
	 */
	distSQ: function(vec1, vec2)
	{
		return this.lengthSQ(subtract(vec1, vec2));
	},
	
	/**
	 * Divides the given vector by a number.
	 * @param	vec The vector you wish to divide.
	 * @param	numb The number to divide the vector with.
	 * @return A new instance of Vector2.
	 */
	divide: function(vec, numb)
	{
		var newX = vec.x / numb;
		var newY = vec.y / numb;
		return this.newVector2(newX, newY);
	},
	
	/**
	 * Calculates the dot product between 2 vectors.
	 * @param	vec1 The first vector.
	 * @param	vec2 The second vector.
	 * @return The dot product as a Number.
	 */
	dot: function(vec1, vec2)
	{
		return vec1.x * vec2.x + vec1.y * vec2.y;
	},
	
	/**
	 * Creates a new instance of Vector2 which is the inverse of this Vector2.
	 * @return The inverse of this Vector2 as a newVector2 instance.
	 */
	inverse: function(vector)
	{
		return this.newVector2(-vector.x, -vector.y);
	},
	
	/**
	 * Calculates this vector's length. If you want to compare 2 lengths, than use the lengthSQ function.
	 * @return This vector's length as a Number.
	 */
	length: function(vector)
	{
		return Math.sqrt(this.lengthSQ(vector));
	},
	
	/**
	 * Calculates this vector's length squared. This function is faster than the length function.
	 * @return
	 */
	lengthSQ: function(vector)
	{
		return this.dot(vector, vector);
	},
	
	/**
	 * Multiplies a vector with a number.
	 * @param	vec The vector you want to multiply.
	 * @param	numb The number you want to multiply the vector with.
	 * @return A new instance of Vector2.
	 */
	multiply: function(vec, numb)
	{
		var newX = vec.x * numb;
		var newY = vec.y * numb;
		return this.newVector2(newX, newY);
	},
	
	/**
	 * Sets the length of this vector to 1 if the length isn't 0.
	 * @return The current vector, not a new instance of this vector.
	 */
	normalize: function(vector)
	{
		var length = this.lengthSQ(vector);
		if (length == 0) {
			return null;
		}
		
		length = Math.sqrt(length);
		vector.x /= length;
		vector.y /= length;
		
		return vector;
	},

	/**
	 * Calculates a component of this vector parallel to the given vector.
	 * @param	normal The vector you want this vector's parallel component onto.
	 * @return 	This vector's component parallel to the given vector.
	 */
	parallelOnto: function(vec1, vec2)
	{
		var lambda = this.dot(vec1, vec2) / dot(vec2, vec2);
		return this.multiply(vec2, lambda);
	},

	perpendicularOnto: function(vec1, vec2)
	{
		return this.subtract(vec1, this.parallelOnto(vec2));
	},

	/**
	 * Mirrors a vector in a normal, inverses the vector and then returns the given vector with new values.
	 * @param normal The normal which you want to relfect in.
	 * @param vector The vector which you want to reflect.
	 * @return The vector which was given but now reflected in the given normal.
	 */
	reflect: function(normal, vector)
	{
		var nlength = this.lengthSQ(normal);
		if (nlength == 0) return null;
		else if (nlength != 1) this.normalize(normal);
		normal = this.newVector2(-normal.y, normal.x);

		var temp = this.parallelOnto(vector, normal);
		temp = this.multiply(temp, 2);

		vector = this.subtract(vector, temp)
		return this.multiply(vector, -1);
	},
	
	/**
	 * Subtracts the second given vector from the first given vector.
	 * @param	v1 The first vector.
	 * @param	v2 The second vector.
	 * @return A new instance of Vector2 which is the difference between the 2 given vectors.
	 */
	subtract: function(v1, v2)
	{
		var newX = v1.x - v2.x;
		var newY = v1.y - v2.y;
		return newVector2(newX, newY);
	},
	
	/**
	 * This checks whether the length of the current vector is lower than the max value given. The vector is corrected if it isn't.
	 * @param	max The max length value.
	 */
	truncate: function(vec1, max)
	{
		var length = this.length(vec1);
		if (this.lengthSQ(vec1) <= max * max || length == 0) {
			return;
		}
		
		var comparison = max / length;
		vec1.x *= comparison;
		vec1.y *= comparison;
	},
	
	/**
	 * Creates a newVector2 object with the x and y values set to 0.
	 * @return A newVector2 object with the x and y values set to 0.
	 */
	zero: function()
	{
		return this.newVector2(0, 0);
	}
}