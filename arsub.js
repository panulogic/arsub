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
constructor (...args)
{ let a  = super (...args);
	a[SYS] = {};
	return a;
}
static version ()
{ return '0.1.0';
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
end (i=0)  // no arg means return the last element
{ ok (i >= 0)
	return this [this.length - (1 + i)];
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
dropFirst  (howMany=1)
{
	if (howMany >= this.length )
	{  return [];
	}
	if (howMany >= 0)
	{  return this.slice (howMany);
	}
	let firstIxToKeep =  this.length + howMany;
	return this.slice(firstIxToKeep)
}
dropLast  (howMany=1)
{
	if (howMany >= this.length )
	{ return [];
	}
	let lastIx       = this.length - 1;
	let lastIxToKeep = lastIx - howMany;
	if (howMany >= 0)
	{  return this.slice(0, lastIxToKeep + 1); // how slie works
	}
	// Negative howMany  means  drop  everything
	// except the first -1 * howMany .
	lastIxToKeep =  (-1 * howMany) - 1 ; // howMany is < 0
	return this.slice (0, lastIxToKeep + 1 );
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
static test ()
{
const A = this.A;
const ok    = A.ok;
const fails = A.fails;
let a = A (1, 2, 3);
ok (a instanceof Array);
ok (a, [1, 2, 3]);
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
	ok (a.end);
	ok (a.slice(0).end(), 3);
	// When you create new array from an
	// Arsub instance with methods like slice()
	// inherited from Array the result is still
	// an instance of the Array subclass Arsub,
	// so it has its extra methods so you can keep on
	// using those.
	let see4 = a + "";
	// a.push (77);
	// a.pop();
	// pop() and push() cause error because arsubs are IMMUTABLE
	// Instead you can do the same like this:
	ok (a, [1, 2, 3]);
	ok (a.addLast (4).addLast(5) , [1,2,3,4,5] );
	ok (a.addFirst(4).addFirst(5), [5,4,1,2,3] );
	// or simpler:
	ok (a.addFirst(4, 5), [4,5,1,2,3] );
	ok (a.addLast (4, 5), [1,2,3,4,5] );
	ok (a.size(), 3)
	ok (a.end() , 3);  // default arg is 0 meaning return the end-element
	ok (a.end(0), 3);
	ok (a.end(1), 2);        // 1 means return the one before last
	ok (a.end(2), 1)         // 2 means return the 2nd before last
	ok (a.end(3), undefined) // 3 steps left is index -1 whose value is undefined
	ok (a.dropFirst (0), [1,2,3])   ; // Drop zero first elements.
	ok (a.dropFirst (1), [2,3])     ; // Without one first element.
	ok (a.dropFirst () , [2,3])     ; // Same. 1 is the default arg-value.
	ok (a.dropFirst (2), [3])       ; // without first two
	ok (a.dropFirst (3), [])        ;
	ok (a.dropFirst (4), [])        ;
	ok (a.dropFirst (-1), [3])      ; // all except last 1
	ok (a.dropFirst (-2), [2,3])    ; // all exceptlast 2
	ok (a.dropFirst (-3), [1,2,3])  ; // drop all except last 3 == keep all of them
	ok (a.dropFirst (-55), [1,2,3]) ; // drop all except last 55 == keep all of them
	ok (a.dropLast (0), [1,2,3]) ; // Drop zero last elements. Means return a shallow copy
	ok (a.dropLast (1), [1,2])   ; // Drop one elment from the end.
	ok (a.dropLast ( ), [1,2])   ; // Same. 1 is the default but value of the argument.
	ok (a.dropLast (2), [1])     ;
	ok (a.dropLast (3), [])      ;
	ok (a.dropLast (4), [])      ;
	ok (a.dropLast (-1), [1])    ; // drop all but FIRST 1
	ok (a.dropLast (-2), [1,2])  ; // drop all but FIRST 2
	ok (a.dropLast (-3), [1,2,3]); // drop all but FIRST 3 == drop nothing
	ok (a.dropLast (-7), [1,2,3]); // drop all but FIRST 7 == drop nothing
	ok (a.eq ([1,2,3]));
	ok (a.eq ([1,2,3])  === true );
	let b = a.eq ([1,2,55]);
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