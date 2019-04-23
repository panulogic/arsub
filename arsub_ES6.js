

let es6Export  =  _Monad().A ;
export default es6Export;

/**
   Copyright 2019 Class Cloud LLC. All Rights Reserved.
*/

"use strict";
if (typeof module !== "undefined" &&
    typeof module.exports === "object"
)
{  module.exports =   _Monad().A ;
}
function _Monad (   )
{ const SYS = Symbol ('SYS');
  return class Monad extends Array
	{ static version ()
		{ return '0.3.0';
		}
static test ()
{
const A     = this.A;
const M     = this.A;
// maybe you want to refer ot it as M(onad)
// but it is an A(rray) so A is fine too.
let UCE =  _UserClassExample (A); // tests itself
const ok    = A.ok;
const fails = A.fails;
testAsyncMonad (A) ;
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
ok (a. of       );
ok (a. monad    );
// ok (a. flat  ); // no more now replaced by:
ok (a. m  );
ok (a. _  );
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
// Monads are sparse arrays!
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
// You can create a new Monad iby asking it
// from an exiting instance, no need
// ask for its constructor:
ok (a.of (7,8) . eq ([7,8]));
let b2 = a.of(  [1, [2, [3] ]]);
// MONAD TESTS:
// In the sacred books of Monad it is said
// that the bind() argument-function must
// be of type e=>[e] like above e=>[e].
// But in arsub-monads if the argument-function
// returns a NON-array  it is simply converted
// to one containing the original result as its
// only element.
a3 = a.m (
(e, o, i, a) =>
 {
  // with array functions you can not use this as
  // the out-channel because there is no this
  // so would it not be better to pass o as the
  // 2nd arg after all? i and a are seldom used anyway
		// return (e + i);
		// yes this is better because measn also arrow functrions
		// can be part of async pipelines.
		o (e + i);
							 });
ok (a , [1,2,3]);
// results of _m() hide their data
// so do results of _() why
// basically to prevent you from returning
// their data BUT you could always return the
// whole monad. Calculation happens inside it.
ok (a3, [null, null, null]);
a3._ (  (...a) => ok (a, [1,3,5])) ;
      // this function is a monad-instantioator
      // a.k.a monad-funk. Whatever I return
      // becomes the data of the monad return to
      // caller of _().  If I return nothing
      // then that data will be [].
// if the above funk does not return anything
// then result should be empty monad but if
// it returns the data that it goet then result
// should be amonad which carries but hjides that
// data. User could pass in a monad-class as well
// we would turn it into a monad.
ok (A(1,2,3), [1,2,3]);
// when you call the constructor A like above
// it returns a monad whose data is public.
//
// This is because monad-constructorfunctions
// like A() are a sYnchronous functions.
//
// But when you call m(f) or _(f) on it  those
// methods coudl be ASYNC and therefore we hide
// their data. You can only see  that by calling
// their method m() passing as argument a function.
// ._() can be called passing in a Monad-class
// which creates its instances  in general
// synchronously but not really if the monad to
// which you send ._() is part of a pipeline
// some of which steps are async. Therefore _()
// must return a monad whose data is hidden.
a4 = a.m
( (e, o, i, a) =>
 { let methodGiver = this;
   let outChannel  = o;
   return  [e] ;
 });
a4._ ( (...elems) =>
			  { ok (elems, [1,2,3]);
				}
     );
// See the diff between m() and _() above.
// m(e) is called for each element separately.
// _(...elems) is called with all of them
// when they are ready.
let a5 = a.m (e=>e);
a5._( (...a) => ok (a, [1,2,3]));
let a7 = a.m (e => e+e, e=>e*e);
a7._ ( (... a7) => ok (a7, [2, 4, 9]) );
let x = 0;
let y = 0;
let obAndState = A ( {name: 'pieceA'}, {x, y}) ;
let obAndState2 = obAndState
.m     (left)
.m     (up)
.m     (right)
.monad (down)  // m() is shorthand for monad(),
.m     (down)
.m     (left)
. _ (A)       // _(M) transforms recipient into the arg-monad M but
              // so far A is our only monad-class so we use it to test.
. m (right)
. _ ()        // _() without argument returns the RECIPIENT
obAndState2 . _
(  (ob, location) =>
	 { debugger
	    ok ( location, {x:0, y:-1} );
	 }
);
debugger
let v = this.version();
console.log (`SUCCESS arsub.js v.${v} tests have run`);
return v;
function left (e, o, i, a)
{ if ( i )
  {  debugger
     return o ( Object.assign ({}, e, {x: e.x - 1}));
  }
  this (e);
}
function right (e, o, i, a)
{
	if ( i )   // i === 0 means e is the game-piece, 1 means e is its state.
	{ let newState = Object.assign ({}, e, {x: e.x + 1});
		return o (newState);
	}
 this(e);
}
function up (e, o, i, a)
{
	if ( i )   // i === 0 means e is the game-piece, 1 means e is its state.
	{ let newState = Object.assign ({}, e, {y: e.y + 1});
		return o (newState);
	}
	this(e);
}
function down (e, o, i, a)
{
	if ( i )   // i === 0 means e is the game-piece, 1 means e is its state.
	{ let newState = Object.assign ({}, e, {y: e.y - 1});
		return  o(newState);
	}
  this(e);
}
function testAsyncMonad (M)
{
   let asm   = M (1,2,3);
	 asm
	 .m (asyncF10, asyncF1)
	 ._ (terminalY, 4); // 3);
   asm        // [1, 2, 3]
	 .m (asyncF10 )   // [10, 20, 30]
	 .m (asyncF1  )   // [11, 21, 31]
	 .m (asyncF10 )   // [110, 210, 310]
	 .m ( syncF1  )   // [111, 211, 311]
	 .m ( syncF2  )   // [113, 213, 313]
	 ._ (terminalX,  40);
	 function asyncF1  (e, o)
	 { setTimeout ( () => o (e + 1) , 0);
	 }
	 function asyncF10  (e, o)
	 { setTimeout ( () => o  (e*10) , 3);
	 }
	 function terminalY (... a)
	 {
		 ok (a
				, [ 10  // asyncF10(1) ===  1 * 10
					, 3   // asyncF1(2) = 2  + 1
					, 4   // asyncF1(3) = 3  + 1
					]
				) ;
		 console.log (`terminalY:\n ${a.join(', ')} `) ;
	 }
	 function syncF1  (e, o)
	 {  o (  e + 1  );
	 }
	 function syncF2  (e, o)
	 { o  (e + 2);
	 }
	 function terminalX (... a)
	 {
		 ok (a, [113, 213, 313]) ;
		 console.log (`terminalX:\n ${a.join(', ')} \n`) ;
	 }
	}
} // end test()
static of (...elems)
{
	let elems2 = elems.map
	( e =>
		{ if (e instanceof Monad)
			{ return e;
			}
			if (e instanceof Array)
			{ return this.of (...e);
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
// when using arsubs as array you dont
// want to hide their data.
//	let shell =  new this();
//	shell [SYS] .realMe = a;
//	debugger
//	return shell;
}
m (... funks)
{  return this.monad(... funks);
}
monad (... funks )
{
	let {  resultMonad, self} = this;  // when I am called as a todo later
	if (this instanceof Array)
	{ self =  this;
	}
	let siz  = self.size();
	if (! resultMonad)  // if it is there it is an array
	{ resultMonad = new (self.constructor) (siz);
		resultMonad [SYS].ready  = false;
	}
	if (self[SYS].ready === false)
	{ addToDo.call (self, 'monad', funks, resultMonad)  ;
		return resultMonad;
	}
	let howManyReady  = 0;
	let f;
	let data = self;
	if (self[SYS].data)
	{ data = self[SYS].data;
	}
	for (var j=0; j < siz; j++)
	{ if (funks[j])
		{ f = funks[j];
		}
		let outCh     = createOutChannel (j, resultMonad, f) ;
		let resultOfF = f.call(outCh,  data [j], outCh, j, data);
		if (resultOfF !== undefined)
		{
      if (f.name)
			{ debugger
			  // f.call(outCh, data[j], j, this); // fix it
			  throw new Error
		  (`The NAMED monad-arg-function ${f.name}() returned a result:
${resultOfF} .
Only arrow- and other unnamed monad-arg-functions
can return a result.
`);
			} else
			{ 	outCh (resultOfF) ;
			}
		}
	}
	return resultMonad ;
	// return it so the next m() call
	// can be called upon it.
	function allDone (doerMonad)        // doerMonad is the one that just became ready
	{  doerMonad [SYS].ready  = true;   // it is now ppossibleto calculate the next
		 let flat = [];
		 let data = doerMonad;
		 if (doerMonad[SYS].data)
		 { data = doerMonad[SYS].data;
		 } else
		 { debugger
		   // ? should not come here
		   data = [];
		   doerMonad.map (e,i,a)
			 { data[i] = e;
			 }
		   doerMonad[SYS].data = data;
		 }
		 data.map
		 ( (e, i, a) =>
			 { flat =  [...flat, ...e];
			   data[i] = null;
			 }
		 )
		 flat .map
		 ( (e, i, a) =>
			 { data[i] = flat[i];
			 }
		 );
		 data.length = flat.length; // it is possible elems were dropped
		 Object.freeze (doerMonad);
		 let todos =   todosF.call (doerMonad);
		 todos .map
		 ( ( mAndFandR, i, a) =>
				{
					let [methodName, argFunks, resultMonad, timer] = mAndFandR;
					let self = doerMonad;
					 doerMonad [methodName].call
					 ( { self, resultMonad, timer
						 }
					 , ... argFunks
					 );
				}
		 );
	}
	function createOutChannel (i, resultMonad,  $f)
	{
		ok (resultMonad);
		outCh._ii = i;
		return outCh;
		function outCh (resultOfF)
		{  if (outCh._called)
			{ debugger
			  throw new Error
			  (`
this() called more than once in:
${$f}
` );
			}
			outCh._called = true;
      resultMonad[SYS].data
      = resultMonad[SYS].data
      ? resultMonad[SYS].data
      : [];
      let data = resultMonad[SYS].data;
		  if (resultMonad[i] === undefined)
			 { howManyReady++;
			 }
			 if (resultOfF instanceof Array)
			 { // resultMonad[i] = resultOfF;
			   data [i] = resultOfF;
			 } else
			 { // resultMonad[i] = [ resultOfF ];
			   data [i] = [resultOfF];
			 }
       resultMonad[i] = null;
			 if (howManyReady >= siz)
			 { allDone.call (this, resultMonad);
			 }
			 // IMPORTANT: This function must return
			 // undefined/nothing because that has
			 // sognificance as the reurn value of
			 // monad-step-functions which cause an
			 // error si a named monad-step-function
			 // returns anything but undefined.
		}
	}
}
constructor (...args)
{
  let a  = super (...args);
	a[SYS] = {};
	a[SYS].todos = [];
	return a;
}
static A (...args)       // this is what gets exported
{ return Monad.of (...args);
}
_ (MonadF, timeout)
{
	if (! MonadF)
	{ return this;
	}
	let {  resultMonad, self, timer} = this;  // when I am called as a todo later.
	if (this instanceof Array)
	{ self = this;
	}
  let siz     = self.size();
	let data = self;
	if (self[SYS].data)
	{ data = self[SYS].data;
	}
	if (self [SYS].ready === false)
	{ resultMonad = new (self.constructor) (siz);
	  resultMonad [SYS].ready  = false;
	  if (timeout !== undefined)
		{ timer = setTimeout
			( () =>
				{ throw new Error
				  (`\nComputation did NOT reach function "${MonadF.name}()" 
within ${timeout} ms. \n`
          );
				}
				, timeout
			);
			// log (`SET timeout ${timeout} at \n${new Date().getTime()} `)
		}
	  addToDo.call (self, '_', [MonadF], resultMonad, timer);
	  return resultMonad;
	}
  if (timer)
	{ clearTimeout (timer);
	}
	 let newMonad  =  MonadF ( ... data ) ;
	 if  (newMonad instanceof Monad )
	 { return newMonad;
	 }
   let data2 = newMonad;
   if (! (data2 instanceof Array))
	 { if (data2 === undefined)
		 { data2 = [];
		 } else
		 { data2  = [data2 ];
		 }
	 }
    let nulls = data2.map(e=>null)
	 // hide the data:
	 newMonad = self.constructor.mutableOf (... nulls);
	 newMonad[SYS].data = data2;
	 Object.freeze (newMonad);
	 return newMonad;
}
static mutableOf (...elems)
{  let m = new this();
   for (var j=0; j < elems.length; j++)
	 { m.push (elems[j]);
	 }
	 return m;
}
of  (...args)
{ return Monad.of (...args);
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
	  // any Monad does.
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
	{ let c = Monad.mutableOf ( ...this ) ;  //.copy(); would make it immutable too early
	  if (typeof v === "object" || typeof v === "function" )
		{ if (v.constructor !== Monad)
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
  let copy = Monad.mutableOf ( ...this)  ;
	this.forEach
	( (e, i) =>
		{ copy[i] = e;
		}
	);
	for (let p in newElems)
	{ let ne = newElems[p];
	  if (ne instanceof Array && ! (ne instanceof Monad))
		{ ne = Monad.of (...ne);
		}
	  copy[p] = ne;
	};
	Object.freeze (copy);
	return copy;
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
addFirst (... newElems)
{ return this.of(...newElems, ...this);
}
addLast (... newElems)
{ return this.of(  ...this, ...newElems );
}
eq (a2)
{ return  okBasic (this, a2);
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
[Symbol.toPrimitive] (hint)
{ return `Monad.of(${this[0]}, ${this[1]}, ...)`
}
ok (a,b)
{ return ok(a,b);
 // Now subclasses have an easy way to
 // call this inside their instance methods
}
fails (...args)
{ return fails(...args);
 // so subclasses have an easy way to
 // call this inside their instacne methods
}
static init()
{ this[SYS]        = {};
  this.A.ok        = ok ;
	this.A.fails     = fails ;
	this.A.version   = this.version;
	Object.freeze (this.A);
	Object.freeze (this);
	this.test();
	return this;
}
} . init();
	function ok (...args)
	{ let [a, b] = args;
		let bool = okBasic (...args )
		if (! bool)
		{ throw new Error ('Monad.ok() failed');
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
	Monad.fails() did NOT fail calling its argument-function:
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
		{ throw new Error
			( `
Possible Eternal Regression in Monad::freezeOb()
probably caused by a circular data-structure.
`    );
		}
		Object.freeze(ob);
		let nextLevel = level + 1;
    for (let p in ob)
		{ freezeOb ( ob [p], nextLevel );
		}
		return ob;
	}
	function addToDo (methodName, argFunks, resultMonad, timer )
	{ ok (resultMonad);
		ok (argFunks instanceof Array);
		this[SYS].todos.push
		 ( [methodName, argFunks, resultMonad, timer]
		 );
	}
	function todosF ()
	{ return this[SYS].todos;
	}
}
function _UserClassExample (MonadF)
{ return class UserClass
  {
		static test ()
		{
		  const ok    = MonadF.ok;
		  let uce = new this();
      let resultMonad
      = uce.mainCalc (end );
	    // we can but makes little sense to
	    // RETURN the result-monad.
		  return resultMonad;
		  function end (...elems)
			{
	      log (elems.join (', '));
	      ok (elems, [11,21,31]);
				return elems;
			}
		}
		static init()
		{ this.test();
		  return this;
		}
	  stepA (e,o,i,a)
		{ o (e*10);
		}
    stepB (e,o,i,a)
		{ o (e+1);
		}
		mainCalc ( o  )
		{ let A     = MonadF;
		  let a     =  A(1,2,3);
      let stepA = this.stepA.bind (this);
      let stepB = this.stepB.bind (this);
      let resultMonad =
 			  a.m (stepA)
 			   .m (stepB)
	 			 ._ (o);
       return resultMonad;
		}
  } .init()
}
 function log (s)
	{ console.log(s)
	}