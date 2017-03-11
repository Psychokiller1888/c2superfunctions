// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.C2SuperFunctions = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.C2SuperFunctions.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	/*Cnds.prototype.MyCondition = function (myparam)
	{
		// return true if number is positive
		return myparam >= 0;
	};*/
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	/*Acts.prototype.MyAction = function (myparam)
	{
		// alert the message
		alert(myparam);
	};*/
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.Split = function (ret, string, delimiter)
	{
		var arr = string.split(delimiter);

		var jsonStr = new Object();
		jsonStr['c2array'] = true;
		jsonStr['size'] = [arr.length, 1, 1];
		
		var data = [];
		
		for (var i in arr) {
		  data.push([[arr[i]]]);
		}
		jsonStr['data'] = data;
		
		ret.set_string(JSON.stringify(jsonStr));
	};
	
	Exps.prototype.Sha1 = function (ret, string)
	{
		ret.set_string(doSha1(string));
	}
	
	function doSha1(str) {
		//  discuss at: http://phpjs.org/functions/sha1/
		// original by: Webtoolkit.info (http://www.webtoolkit.info/)
		// improved by: Michael White (http://getsprink.com)
		// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		//    input by: Brett Zamir (http://brett-zamir.me)
		//  depends on: utf8_encode
		//   example 1: sha1('Kevin van Zonneveld');
		//   returns 1: '54916d2e62f65b3afa6e192e6a601cdbe5cb5897'

		var rotate_left = function(n, s) {
			var t4 = (n << s) | (n >>> (32 - s));
			return t4;
		};

		/*var lsb_hex = function (val) { // Not in use; needed?
		var str="";
		var i;
		var vh;
		var vl;

		for ( i=0; i<=6; i+=2 ) {
			vh = (val>>>(i*4+4))&0x0f;
			vl = (val>>>(i*4))&0x0f;
			str += vh.toString(16) + vl.toString(16);
		}
		return str;
		};*/

		var cvt_hex = function(val) {
		var str = '';
		var i;
		var v;

		for (i = 7; i >= 0; i--) {
			v = (val >>> (i * 4)) & 0x0f;
			str += v.toString(16);
		}
		return str;
		};

		var blockstart;
		var i, j;
		var W = new Array(80);
		var H0 = 0x67452301;
		var H1 = 0xEFCDAB89;
		var H2 = 0x98BADCFE;
		var H3 = 0x10325476;
		var H4 = 0xC3D2E1F0;
		var A, B, C, D, E;
		var temp;

		//str = this.utf8_encode(str);
		var str_len = str.length;

		var word_array = [];
		for (i = 0; i < str_len - 3; i += 4) {
			j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
			word_array.push(j);
		}

		switch (str_len % 4) {
		case 0:
			i = 0x080000000;
			break;
		case 1:
			i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
			break;
		case 2:
			i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
			break;
		case 3:
			i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) <<
			8 | 0x80;
			break;
		}

		word_array.push(i);

		while ((word_array.length % 16) != 14) {
			word_array.push(0);
		}

		word_array.push(str_len >>> 29);
		word_array.push((str_len << 3) & 0x0ffffffff);

		for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
			for (i = 0; i < 16; i++) {
				W[i] = word_array[blockstart + i];
			}
			for (i = 16; i <= 79; i++) {
				W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
			}

			A = H0;
			B = H1;
			C = H2;
			D = H3;
			E = H4;

		for (i = 0; i <= 19; i++) {
			temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
		  E = D;
		  D = C;
		  C = rotate_left(B, 30);
		  B = A;
		  A = temp;
		}

		for (i = 20; i <= 39; i++) {
		  temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
		  E = D;
		  D = C;
		  C = rotate_left(B, 30);
		  B = A;
		  A = temp;
		}

		for (i = 40; i <= 59; i++) {
		  temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
		  E = D;
		  D = C;
		  C = rotate_left(B, 30);
		  B = A;
		  A = temp;
		}

		for (i = 60; i <= 79; i++) {
		  temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
		  E = D;
		  D = C;
		  C = rotate_left(B, 30);
		  B = A;
		  A = temp;
		}

		H0 = (H0 + A) & 0x0ffffffff;
		H1 = (H1 + B) & 0x0ffffffff;
		H2 = (H2 + C) & 0x0ffffffff;
		H3 = (H3 + D) & 0x0ffffffff;
		H4 = (H4 + E) & 0x0ffffffff;
	  }

	  temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
	  return temp.toLowerCase();
	}
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());