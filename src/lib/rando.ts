import * as crypto from 'crypto';

var isUndefined = (variable) => typeof variable === 'undefined',
	isNumber = (num) => typeof num === 'number' && !isNaN(num),
	isString = (str) => typeof str === 'string',
	isObject = (obj) => typeof obj === 'object',
	isFunction = (fn) => typeof fn === 'function',
	isArray = (arr) => !isUndefined(arr) && arr !== null && arr.constructor === Array;

function cryptoRandom() {
	try {
		var cryptoRandoms,
			cryptoRandomSlices = [],
			cryptoRandom;
		while ((cryptoRandom = '.' + cryptoRandomSlices.join('')).length < 30) {
			cryptoRandoms = crypto.randomFillSync(new Uint32Array(5));
			for (var i = 0; i < cryptoRandoms.length; i++) {
				var cryptoRandomSlice = cryptoRandoms[i] < 4000000000 ? cryptoRandoms[i].toString().slice(1) : '';
				if (cryptoRandomSlice.length > 0) cryptoRandomSlices[cryptoRandomSlices.length] = cryptoRandomSlice;
			}
		}
		return Number(cryptoRandom);
	} catch (e) {
		return Math.random();
	}
}

export function rando(arg1?, arg2?, arg3?) {
	try {
		if (arg1 !== null && arg2 !== null && arg3 !== null) {
			if (isUndefined(arg1)) {
				//regular decimal
				return cryptoRandom();
			}

			var jqueryObject;
			if (
				isUndefined(arg2) &&
				isObject(arg1) &&
				isFunction(arg1.constructor) &&
				arg1.constructor.name === 'jQuery' &&
				isNumber(arg1.length) &&
				isFunction(arg1.eq) &&
				isObject(arg1.eq(0)) &&
				isFunction(arg1.eq(0).constructor) &&
				arg1.eq(0).constructor.name === 'jQuery'
			) {
				//jQuery object
				if (arg1.length == 0) return false;
				var index = rando(0, arg1.length - 1);
				return { index: index, value: arg1.eq(index) };
			}

			if (isNumber(arg1) && isNumber(arg2) && isString(arg3) && arg3.toLowerCase().trim() == 'float') {
				//float from min to max (inclusive of min and exclusive of max)
				if (arg1 > arg2)
					var temp = arg2,
						arg2 = arg1,
						arg1 = temp;
				return cryptoRandom() * (arg2 - arg1) + arg1;
			}

			if (isArray(arg1) && arg1.length > 0 && isUndefined(arg2)) {
				//array
				var arr = arg1,
					pickedIndex = (cryptoRandom() * arr.length) << 0;
				return { index: pickedIndex, value: arr[pickedIndex] };
			}

			if (isObject(arg1) && isUndefined(arg2)) {
				//object
				var obj = arg1,
					keys = Object.keys(obj);
				if (keys.length > 0) {
					var key = keys[(keys.length * cryptoRandom()) << 0];
					return { key: key, value: obj[key] };
				}
			}

			if (((arg1 === true && arg2 === false) || (arg1 === false && arg2 === true)) && isUndefined(arg3)) {
				//boolean
				return rando() < 0.5;
			}

			if (isNumber(arg1) && isUndefined(arg2)) {
				//int from 0 through max OR min through 0 if negative (inclusive of both min and max)
				if (arg1 >= 0) return rando(0, arg1);
				return rando(arg1, 0);
			}

			if (isNumber(arg1) && isString(arg2) && arg2.toLowerCase().trim() == 'float' && isUndefined(arg3)) {
				//float from 0 to max OR min to 0 if negative (inclusive of min and exclusive of max)
				return arg1 >= 0 ? rando(0, arg1, 'float') : rando(arg1, 0, 'float');
			}

			if (isNumber(arg1) && isNumber(arg2) && isUndefined(arg3)) {
				//int from min through max (inclusive of both min and max)
				if (arg1 > arg2)
					var temp = arg2,
						arg2 = arg1,
						arg1 = temp;
				(arg1 = Math.floor(arg1)), (arg2 = Math.floor(arg2));
				return Math.floor(cryptoRandom() * (arg2 - arg1 + 1) + arg1);
			}

			if (isString(arg1) && arg1.length > 0 && isUndefined(arg2)) {
				//string
				return arg1.charAt(rando(0, arg1.length - 1));
			}
		}
		return false;
	} catch (e) {
		console.log('ERROR: ' + e);
		return false;
	}
}
