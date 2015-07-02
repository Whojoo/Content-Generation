/**
 * These functions are found at:
 * http://codeincomplete.com/posts/2013/12/6/javascript_game_foundations_math/
 */ 
Game.Math = {

	random: function(min, max) {
	return (min + (Math.random() * (max - min)));
	},

	randomInt: function(min, max) {
	return Math.round(this.random(min, max));
	},

	randomChoice: function(choices) {
	return choices[this.randomInt(0, choices.length-1)];
	},

	randomBool: function() {
	return this.randomChoice([true, false]);
	},

	limit: function(x, min, max) {
	  return Math.max(min, Math.min(max, x));
	},

	between: function(n, min, max) {
	  return ((n >= min) && (n <= max));
	},

	accelerate: function(v, accel, dt) {
	  return v + (accel * dt);
	},

	lerp: function(n, dn, dt) {   // linear interpolation
	  return n + (dn * dt);
	},

	interpolate: function(a,b,percent) 
	{ 
		return a + (b-a)*percent                                 
	},

	easeIn:      function(a,b,percent) 
	{ 
		return a + (b-a)*Math.pow(percent,2);                    
	},
	easeOut:     function(a,b,percent) 
	{ 
		return a + (b-a)*(1-Math.pow(1-percent,2));              
	},

	easeInOut:   function(a,b,percent) 
	{ 
		return a + (b-a)*((-Math.cos(percent*Math.PI)/2) + 0.5); 
	},

	brighten: function(hex, percent) {

	  var a = Math.round(255 * percent/100),
	      r = a + parseInt(hex.substr(1, 2), 16),
	      g = a + parseInt(hex.substr(3, 2), 16),
	      b = a + parseInt(hex.substr(5, 2), 16);

	  r = r<255?(r<1?0:r):255;
	  g = g<255?(g<1?0:g):255;
	  b = b<255?(b<1?0:b):255;

	  return '#' + (0x1000000 + (r * 0x10000) + (g * 0x100) + b).toString(16).slice(1);
	},

	darken: function(hex, percent) {
	  return this.brighten(hex, -percent);
	},

	overlap: function(box1, box2) {
	  return !((box1.right  < box2.left)   ||
	           (box1.left   > box2.right)  ||
	           (box1.top    > box2.bottom) ||
	           (box1.bottom < box2.top));
	},

	lineIntercept: function(x1, y1, x2, y2, x3, y3, x4, y4, d) {
	  var denom = ((y4-y3) * (x2-x1)) - ((x4-x3) * (y2-y1));
	  if (denom != 0) {
	    var ua = (((x4-x3) * (y1-y3)) - ((y4-y3) * (x1-x3))) / denom;
	    if ((ua >= 0) && (ua <= 1)) {
	      var ub = (((x2-x1) * (y1-y3)) - ((y2-y1) * (x1-x3))) / denom;
	      if ((ub >= 0) && (ub <= 1)) {
	        var x = x1 + (ua * (x2-x1));
	        var y = y1 + (ua * (y2-y1));
	        return { x: x, y: y, d: d };
	      }
	    }
	  }
	  return null;
	},
}