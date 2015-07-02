Game.Math.Matrix = {

	newMatrix: function(n11, n12, n13, n21, n22, n23)
	{
		var matrix = {
			//The matrix' elements. Row 3 is always 001 in a 2D enviorement so no need to declare variables for it.
			m11: typeof(n11) == 'undefined' ? 1 : n11,
			m12: typeof(n12) == 'undefined' ? 0 : n12,
			m13: typeof(n13) == 'undefined' ? 0 : n13,
			m21: typeof(n21) == 'undefined' ? 0 : n21,
			m22: typeof(n22) == 'undefined' ? 1 : n22,
			m23: typeof(n23) == 'undefined' ? 0 : n23
		}
		return matrix;
	},
	
	/**
	 * Create a new rotation matrix with a specified amount of radians. If you have degrees, just use the following formula.
	 * Radians = degrees / 180 * Math.PI.
	 * @param	radians
	 * @return A rotation matrix.
	 */
	createRotation: function(radians)
	{
		var cos = Math.cos(radians);
		var sin = Math.sin(radians);
		return this.newMatrix(cos, -sin, 0, sin, cos, 0);
	},
	
	/**
	 * Create a new scaling matrix using a number.
	 * @param	scale The new scale.
	 * @return The scaling matrix.
	 */
	createScale: function(scale)
	{
		return this.newMatrix(scale, 0, 0, 0, scale, 0);
	},
	
	/**
	 * Create a new scaling matrix using a Vector2.
	 * @param	scale The scale in a vector2 object.
	 * @return The scaling matrix.
	 */
	createScales: function(scales)
	{
		return this.newMatrix(scales.x, 0, 0, 0, scales.y, 0);
	},
	
	/**
	 * Create a new translation matrix using Vector2.
	 * @param	vector The position which you want to translate to.
	 * @return The translation matrix.
	 */
	createTranslation: function(vector)
	{
		return this.newMatrix(1, 0, vector.x, 0, 1, vector.y);
	},
	
	/**
	 * Converts a given flash.geom.Matrix into a WMatrix.
	 * @param	matrix The flash.geom.Matrix which you want to convert.
	 * @return A new instance of the WMatrix class.
	 */
	fromMatrix: function(matrix)
	{
		return this.newMatrix(matrix.a, matrix.b, matrix.tx, matrix.c, matrix.d, matrix.ty);
	},

	/**
	 * Returns an new instance of WMarix as an identity matrix.
	 */
	identity: function()
	{
		return this.newMatrix();
	},
	
	/**
	 * Multiply 2 or more matrices from the WMatrix class. multiplies fr: RIGHT TO LEFT so the LAST passed
	 * along as an argument is the FIRST to be used.
	 * You can switch a Matrix into WMatrix by using the fromMatrix method in clas:
	 * Use the multiplyTwoMatrices() function if you wish to only multiply 2 matrices. It will increae performence.
	 * @param	... matrices All the matrices you want to use. The LAST matrix passed along as an argument is the FIRST matrix to be used.
	 * @return A WMatrix which is a product from the given matrices. Null if less than 2 matrices were given.
	 */
	multiply: function(matrices)
	{
		//Return null if only one matrix was given.
		if (matrices.length < 2) return null;
		
		//Now lets multiply the matrices. The left matrix is supposed te be the first one so on paper it is supposed to be the matrix on
		//the right. So name 2 variables left and right to know the difference. The first matrix is on the top now so we can use pop().
		var right, left;
		
		//Pop a matrix from the array and put it in right.
		right = matrices.pop();
		
		do {
			left = matrices.pop();
			
			//Put the new matrix in the right matrix.
			right = this.multiplyTwoMatrices(left, right);
		} while (matrices.length > 0);
		
		//Return right, the matrix which got updated constantly.
		return right;
	},
	
	/**
	 * Multiply 2 matrices with eachother. On paper multiplying is from right to left so the first matrix you give will be the
	 * right matrix and the second will be the left matrix. way y: can enter the calculation from left to right.
	 * @param	right
	 * @param	left
	 * @return
	 */
	multiplyTwoMatrices: function(left, right)
	{
		var n11 = left.m11 * right.m11 + left.m12 * right.m21; //Left.m13 * right.m31 = 0 because right.m31 is always 0.
		var n12 = left.m11 * right.m12 + left.m12 * right.m22; //Same story as last line.
		var n13 = left.m11 * right.m13 + left.m12 * right.m23 + left.m13; //Left.m13 * right.m33 = 1 because right.m33 is always 1.
		
		var n21 = left.m21 * right.m11 + left.m22 * right.m21; //Left.m13 * right.m31 = 0 because right.m31 is always 0.
		var n22 = left.m21 * right.m12 + left.m22 * right.m22; //Same story as last line.
		var n23 = left.m21 * right.m13 + left.m22 * right.m23 + left.m23; //Left.m13 * right.m33 = 1 because right.m33 is always 1.
		
		return this.newMatrix(n11, n12, n13, n21, n22, n23);
	},
	
	rotate: function(angleInRadians, matrixToRotate)
	{
		var cos = Math.cos(angleInRadians);
		var sin = Math.sin(angleInRadians);
		
		return this.multiplyTwoMatrices(
			//Rotation matrix.
			this.newMatrix(cos, -sin, 0,
				sin, cos, 0),
			matrixToRotate);
	},
	
	scaleByNumber: function(scaleFactor, matrixToScale)
	{
		return this.multiplyTwoMatrices(
			//Scale matrix.
			this.newMatrix(scaleFactor, 0, 0,
				0, scaleFactor, 0),
			matrixToScale);
	},
	
	scaleByVector: function(scaleVector, matrixToScale)
	{
		return multiplyTwoMatrices(
			//Scale matrix.
			this.newMatrix(scaleVector.x, 0, 0,
				0, scaleVector.y, 0),
			matrixToScale);
	},
	
	translate: function(translationVector, matrixToTranslate)
	{
		return this.multiplyTwoMatrices(
			//Translation matrix.
			this.newMatrix(1, 0, translationVector.x,
				0, 1, translationVector.y),
			matrixToTranslate);
	},
	
	/**
	 * Transform a Vector2 using a WMatrix. This function will also use translation.
	 * @param	vector The Vector2 you want to transform.
	 * @param	matrix The matrix which you want to use.
	 * @return A new Vector2 instance which is the transformation of the given vector.
	 */
	transformVector: function(vector, matrix)
	{
		var x = matrix.m11 * vector.x + matrix.m12 * vector.y + matrix.m13;
		var y = matrix.m21 * vector.x + matrix.m22 * vector.y + matrix.m23;
		
		return Game.Math.Vector.newVector2(x, y);
	},
	
	/**
	 * Transform a Vector2 using a WMatrix. This function will ignore translation. It doesn't matter if you've added translation into the
	 * WMatrix or not. This function will not use the translation.
	 * @param	vector The Vector2 you want to transform.
	 * @param	matrix The matrix which you want to use.
	 * @return A new Vector2 instance which is the transformation of the given vector.
	 */
	transformVectorNormal: function(vector, matrix)
	{
		var x = matrix.m11 * vector.x + matrix.m12 * vector.y;
		var y = matrix.m21 * vector.x + matrix.m22 * vector.y;
		
		return this.newVector2(x, y);
	}
}