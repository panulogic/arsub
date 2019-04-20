/**
   Copyright 2019 Class Cloud LLC. All Rights Reserved.
*/

"use strict";
if (typeof module !== "undefined" &&
    typeof module.exports === "object"
)
{ let nodeJsExport  =_arsub().A;
  module.exports = nodeJsExport;
}
function _arsub (   )
{
  const SYS = Symbol ('SYS');
  return class Arsub extends Array
	{
static version ()
{ return '0.1.2';
}
constructor (...args)
{ let a  = super (...args);
	a[SYS] = {};
	return a;
}
static A (...args)       // this is what gets exported
{ return Arsub.of (...args);
}
static of (...elems)
{
	let elems2 = elems.map
	( e =>
		{ if (e instanceof Arsub)
			{ return e;
			}
			if (e instanceof Array)
			{ return this.of(...e);
			}
			if (e instanceof Object)
			{ return freezeOb (e);
			}
			return e;
		}
	);
	let a = super.of(...elems2);
	Object.freeze(a);
	return a;
}
static mutableOf (...elems)
{ let a = super.of(...elems);
	return a;
}
static test ()
{
const A = this.A;
const ok    = A.ok;
const fails = A.fails;
let a = A (1, 2, 3);
ok (a instanceof Array);
ok (a, [1, 2, 3]);
ok (a. size     );
ok (a. first    );
ok (a. last     );
ok (a. addFirst );
ok (a. addLast  );
ok (a. copy     );
ok (a. get      );
ok (a. put      );
ok (a. eq       );
ok (a. monad    );
ok (a. flat     );
ok (a. of       );
//  put() returns an immutable copy:.
let a2 = a.put (10, 0);
ok (a2,  [10, 2, 3])
ok (a2.eq ([10, 2, 3]));
// a2[1] = 123; // would crash because a2 is immutable
// if we want to modify it further we must do another put():
let a3 = a2.put (100, 1);
ok (a3,  [10, 100, 3]);
// If we want to replace multiple elements
// in one call we can use copy() with an
// argument-object:
let a4 = a3.copy ({0:77, 2:[[5]] })
ok (a4, [77, 100, [[5]]]);
a = A ([1,2], [3,4]) ;
ok (a, [ [1, 2], [3, 4] ] )
a2 = a.put("abc", 0, 1) ;
ok (a2, [ [1,"abc"] , [3, 4] ] )
a3 = a.put("a", 2, 0) ; // index 2 creates a NEW toplevel elem as []
											// then puts the value-arg at its index  0
ok (a3, [ [1,2], [3, 4], ["a"] ] )
ok (a3.get (2,0) === "a");
a3 = a.put("a", 2, 1) ; // index 2 creates a NEW toplevel elem as []
										// then puts the value-arg at its index  0
ok (a3, [ [1,2], [3, 4], [undefined, "a"] ] )
ok (a3.get (2,1) === "a");
a = A ([1,2], [3,4]) ;
ok (a, [ [1, 2], [3, 4] ] )
a4 = a.put("a", 2, 33, 897);
ok (a4.get (2, 33, 897) === "a");
ok (a4[2][33][897] === "a");
ok (a4.get (1,1) === 4);
ok (a4.get (5) === undefined);
ok (a4.get (5,5) === undefined);
// a4.get (1,1,1);
// Above would cause error because
// a4.get (1,1) === 4
// and 4  does not have the field '1'
ok ( a.put("a",2, 33, 897) .get (2,33, 897) );
// Arsubs are sparse arrays!
// -------------------------
a = A
({ x: 1
, y: {z:2}
, [SYS] : {}
}
);
let ob = a[0];
let vers  = A.version();
fails ( _=> null.bad );
fails ( _=> fails ( _=> 321 )) ;
fails ( _ => A.baddy  = 321 ) ;
fails ( _=> A.version = 123); // A is immutable as well as is its version
fails ( _=> ob.x      = 2);
fails ( _=> ob.y      = 2);
fails ( _=> ob.y.z    = 44);
fails ( _=> ob [SYS]  = 123);
ob [SYS].privateU = 123;  // does not fail because SYS is a symbol
// ----------------------------------
	a = A (1, 2, 3);
	ok (a, [1, 2, 3]);
	let see4 = a + "";
	// a.push (77);
	// a.pop();
	// pop() and push() cause error because arsubs are IMMUTABLE
	// Instead you can do the same like this:
	ok (a, [1, 2, 3]);
	ok (a.addFirst(4, 5), [4,5,1,2,3] );
	ok (a.addLast (4, 5), [1,2,3,4,5] );
let a6 = A(1,2,3,4,5,6);
ok (a6.first ()  , 1  ); // Without args return the first element
ok (a6.first (1) , [1]); // With arguments always reurn an Array
ok (a6.first (2) , [1,2]);
ok (a6.first (-1), [1,2,3,4,5]);
ok (a6.first (-2), [1,2,3,4]);
ok (a6.first (-3), [1,2,3]);
// Asking FIRST elements always returns
// a list of elements that start form the beginning.
// They are the "first" elements of the array.
// If you ask for "first 5" you get the first
// five elements.
// Telling "how many" by giving a negative
// number you are telling how many should be
// REMOVED, not how many should be added.
// But you are still asking to get some of
// the "first elements" therefore the ones
// that are rem oved are removed from the end.
// SImilary asking for last() always gives a list
// that ends with some last elements of the
// recipient array:
ok (a6.last ()  , 6    );
ok (a6.last (1) , [6]  );
ok (a6.last (2) , [5,6]);
// Like with first() negative arguments
// tells ho many elements to remove but
// because you are asking for (some) of the
// LAST elements, the elements to remove
// are removed from beginning:
ok (a6.last (-1), [2,3,4,5,6]);
ok (a6.last (-2), [3,4,5,6]);
ok (a6.last (-3), [4,5,6]);
// Edge-cases:
ok (a6.first (22), a6);  // Can't gete more than there is
ok (a6.first (0) , []);  // Asking for zero elements gives you that.
ok (a6.last  (22), a6) ;
ok (a6.last  (0) , [] );
// ---------------------------------------
	ok (a.size(), 3);
	ok (a.eq ([1,2,3]));
	ok (a.eq ([1,2,3])  === true );
	ok (! a.eq ([1,2,55])  );
// You can create a new Arsub iby asking it
// from an exiting instance, no need
// ask for its constructor:
ok (a.of (7,8) . eq ([7,8]));
let b2 = a.of(  [1, [2, [3] ]]);
// MONAD TESTS:
ok (a, [1,2,3]);
a3 = a.monad ( (e, i, a) => e + i );
ok (a3, [1,3,5]);
a4 = a.monad (e=>[e]);
ok (a4, [1,2,3]);
// In the sacred books of Monad it is said
// that the bind() argument-function must
// be of type e=>[e] like above e=>[e].
// But in arsub-monads if the argument-function
// returns a NON-array  it is simply converted
// to one containing the original result as its
// only element. Therefore the above does exactly
// the same as next:
let a5 = a.monad (e=>e);
ok (a5, [1,2,3]);
let x = 0;
let y = 0;
let obAndState = A ( {name: 'pieceA'}, {x, y}) ;
let  nextPosition
= obAndState.monad (left)
				 .flat  (up)     // flat() is a SYNONYM for monad(),
				 .flat  (right)  // a bit shorter and more meaningful
				 .monad (down)
				 .monad (down)   // Note monad() does not return
				 .monad (left);  // a "monad" but a "monadic value"
												 // Think of the method-name as the
												 // verb "to monad".
ok (nextPosition[1], {x:-1, y:-1});
let v = this.version();
console.log (`SUCCESS arsub.js v.${v}  tests have run`);
return v;
function left (e, i, a)
{
if ( i )   // i === 0 means the game-piece, 1 measn its state.
{ let newState = Object.assign ({}, e, {x: e.x - 1});
return  [newState];
}
return [e];
}
function right (e, i, a)
{
if ( i )   // i === 0 means e is the game-piece, 1 means e is its state.
{ let newState = Object.assign ({}, e, {x: e.x + 1});
return  [newState];
}
return [e];
}
function up (e, i, a)
{
if ( i )   // i === 0 means e is the game-piece, 1 means e is its state.
{ let newState = Object.assign ({}, e, {y: e.y + 1});
return  [newState];
}
return [e];
}
function down (e, i, a)
{
if ( i )   // i === 0 means e is the game-piece, 1 means e is its state.
{  let newState = Object.assign ({}, e, {y: e.y - 1});
 return  [newState];
}
return [e];
}
} // end test()
static init()
{ this.A.ok      = ok ;
	this.A.fails   = fails ;
	this.A.version = this.version;
	Object.freeze (this.A);
	Object.freeze (this);
	this.test();
	return this;
}
put (v, ...ixs)
{ verifyArgs (v, ixs);
  if (ixs.length === 1)
	{ let c = Arsub.mutableOf( ...this ) ;  //.copy(); would make it immutable too early
	  if (typeof v === "object" || typeof v === "function" )
		{ if (v.constructor !== Arsub)
		  { v = freezeOb (v);
			}
		}
    c [ixs[0]] = v;
    Object.freeze(c);
    return c;  // Yes now this would crash:  c[1] = 888;
	}
  let [ix, ... ixsRest] = ixs;
  let elem = this.get(ix);
  if (elem === undefined )
	{ elem = this.of();
	}
  verifyIsPuttable (elem); // would throw if elem is primitive or null
  let newElem = elem.put (v, ...ixsRest);
  let newMe   = this.put (newElem, ix);
  return newMe;
	function verifyArgs (v, ixs)
	{  if (ixs.length === 0)
		{ throw new Error(`put() called without 2nd argument`)
		}
	}
  function verifyIsPuttable (elem)
	{ if (  elem.put && typeof elem.put === "function")
		{ return;
		}
		throw new Error(`
Trying to put() a property to an 
element ${elem} of arsub which 
does not have  the method put() \n`);
	}
}
of  (...args)
{ return Arsub.of (...args);
}
get (...ixs)
{ let v;
  let i = ixs [0];
  v = this[i];
  if (ixs.length === 1)
	{ return v;
	}
  let ixs2 =  ixs.slice (1);
  if (v === undefined)
	{ return undefined;
	  // if we encounter undefined element
	  // even if ixes remain that is ok because
	  // this is a SPARSE Array. But
	  // IF the element does exist it must be
	  // something which understands get() like
	  // any Arsub does.
	}
  if  (v.get  && typeof v.get === "function" )
	{ return v.get (...ixs2);
	} else
	{ throw new Error
	  ( `trying to call get() on an element 
${v}
which does not have get() as method.
In other words you called get()
with too many arguments, for this
location in the multi-D array whose
value is not undefined.
`	  );
	}
}
copy (newElems = {})
{
  // You can give copy a {} as argument
  // to populate arbitrary toplevel
  // sparse elements of the array.
  // Se for instacne the tests where we do:
  //  a3.copy ({0:77, 2:[[5]] })
  let copy = Arsub.mutableOf()  ;  // p.clone();
	this.forEach
	( (e, i) =>
		{ copy[i] = e;
		}
	);
	for (let p in newElems)
	{ let ne = newElems[p];
	  if (ne instanceof Array && ! (ne instanceof Arsub))
		{ ne = Arsub.of (...ne);
		}
	  copy[p] = ne;
	};
	Object.freeze (copy);
	return copy;
}
eq (a2)
{ return  okBasic (this, a2);
}
addFirst (... newElems)
{ return this.of(...newElems, ...this);
}
addLast (... newElems)
{ return this.of(  ...this, ...newElems );
}
first  (...args)
{
  if (! args.length)
	{ return this[0];
	}
	let howMany = args[0];
	if (howMany >= this.length )
	{ return  this.slice(0);
	}
	if (howMany >= 0)
	{  return this.slice (0, howMany);
	}
	let firstIxToExclude =  this.length + howMany;
	// if howMany is 0 then this.length is the
	// firstIxToExclude meaning all of the array
	// is copied. So if howMany is 1 that means
	// one more is dropped from the end and so on.
	return this.slice(0, firstIxToExclude)
}
last  (...args)
{
  if (! args.length)
	{ return this[this.length-1];
	}
	let howMany = args[0];
  if (howMany >= this.length )
	{ return  this.slice(0);
	}
	if (howMany >= 0)
	{ return this.slice
	  (this.length - howMany, this.length);
	}
	return this.slice(-1 * howMany, this.length )
  // if howMany == -3 it means give the the last
  // elements MINUS the 3 at the beginnning.
}
[Symbol.toPrimitive] (hint)
{ return `Arsub.of(${this[0]}, ${this[1]}, ...)`
}
flat (funk)
{ return this.monad(funk);
}
size ()
{ let p = this[SYS].parent;
	let mySize = this.length;
	if (! p)
	{ return mySize;
	}
	let pSize = p.size();
	if (pSize > mySize)
	{ return pSize;
	}
	return mySize;
}
monad (funk)
{ let result     = [];
	let elemArrays = this.map (funk);
	for (let i=0; i < elemArrays.length; i++)
	{ let elemArray = elemArrays[i];
		if (elemArray === undefined)
		{ continue;
		}
		if (! (elemArray instanceof Array ))
		{  elemArray = Arsub.of(elemArray);
		}
		for (let j=0; j < elemArray.length; j++)
		{ result.push (elemArray[j]);
		}
	}
	let see = result[-1];
	let result2 = Arsub.of (...result);
	return result2;
}
} . init();
function ok (...args)
{
	let [a, b] = args;
  let bool = okBasic (...args )
	if (! bool)
	{ throw new Error ('Arsub.ok() failed');
	}
	return ok;
}
function okBasic (...args)
{
	let [a, b] = args;
  if (args.length < 2)
	{ return a;
	}
	if  (a === b)
	{ return true;
	}
  if (a instanceof Object)
	{ let aLeng, bLeng;
		if (a instanceof Array)
		{ aLeng = a.length;
			bLeng = b.length;
		} else
		{ aLeng = Object.keys(a).length;
			bLeng = Object.keys(b).length;
		}
		if  (aLeng !== bLeng)
		{ return false;
		}
		for (let p in a)
		{ let e = a[p];
			let bool =  okBasic (a[p],  b[p]);
			if (! bool)
			{ return false;
			}
		}
		return true; // all fields have the same value
	}
  // they were not objects or arrays and
  // were not === therefore they are not ok
	return false;
}
function fails (funk)
{ try
  { funk();
  } catch (e)
  { return fails;
  }
   throw new Error
   ( `
Arsub.fails() did NOT fail calling its argument-function:
${funk} 
`
   );
}
	function freezeOb (ob, level=0)
	{
	  if (typeof ob === "string")
		{ return;
		}
	  if (level > 99)
		{ debugger
			throw new Error
			( `
Eternal Regression in Arsub::freezeOb()
probably caused by a circular data-structure.
`    );
		}
		Object.freeze(ob);
		let nextLevel = level + 1;
    for (let p in ob)
		{ if (p === SYS)
		  { debugger
		  }
		  freezeOb ( ob [p], nextLevel );
		}
		return ob;
	}
}