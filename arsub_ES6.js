

let es6Export  =  _Monad().A ;
export default es6Export;

/**
   Copyright 2019 Class Cloud LLC. All Rights Reserved.
*/

"use strict";
const MonadCreatorF = _Monad().A;
if (typeof module !== "undefined" &&
    typeof module.exports === "object"
)
{ module.exports = MonadCreatorF ;
}
_Test (MonadCreatorF);
// --------------------------------------------
function _Monad (   )
{ const SYS = Symbol ('SYS');
  return class Monad extends Array
	{ static version ()
		{ return '0.3.2';
		}
constructor (...args)
{
  let a  = super (...args);
	a[SYS]          = {};
	a[SYS].todos    = [];
	a[SYS].history  = [];
	a[SYS].data     = [...args];
	return a;
}
m (... funks)
{  return this.monad(... funks);
}
static test ()
{
  let a = this.A(1,2,3);
  a.ok (a.last() === 3);
  return this;
} // end test()
h ()
{ return this[SYS].history
}
resetH ()
{ this[SYS].history = [];
  return this;
}
b (theThis)
{ return this.bind (theThis)
}
s (... funks)    // 's' means SWITCH
{
  let [testF,  ... branches] = funks;
	if (branches.length < 2)
	{ throw new Error
		( `\ms() called with < 3 arguments.\n`
		);
	}
	let myData  = this[SYS].data;
	let choice  = testF (myData);
	let branchF = branches [choice];
  if (! branchF)
	{ throw new Error
		( `\mNon-existent bracnch chosein in s().\n`
		);
	}
	let nextMonad = branchF  (this);
	return nextMonad;
}
static mutableOf (...elems)
{  let m = new this();
   for (var j=0; j < elems.length; j++)
	 { m.push (elems[j]);
	 }
	 let copyOfElems = [...m];
	 m[SYS].data =  copyOfElems;
	 return m;
}
static A (...args)       // this is what gets exported
{ return Monad.of (...args);
}
d ()
{ this.debug();
  return this;
}
// --------------------------------
debug (...args)
{ debugger
  return this;
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
    c[SYS].data [ixs[0]] = v;
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
eq (a, b=this[SYS].data)
{ return  okBasic (a, b);
}
// note that this[SYS].data may not be ready yet
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
ok (...args)
{ return ok(...args);
 // Now subclasses in other modules have
 // an easy way to call this inside their
 // instance methods
}
fails (...args)
{ return fails(...args);
 // so subclasses have an easy way to
 // call this inside their instacne methods
}
bind (theThis)
{ if (theThis === undefined)
  { return this;
	  // else we create bound functions from arrow-functions
	  // which auses them to have a name which causes an
	  // error since then we have a named function which
	  // RETURNS a result. We want to promote using the
	  // o-channel because then your methods work whether
	  // they are sync or async.
  }
  if (this[SYS].theThis)
  { throw new Error (`Trying to double-bind a monad`);
  }
  this[SYS].theThis = theThis;
  return this;
}
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
	a[SYS].data = elems2;
	// elems2 is a copy of elems so
	// it is simple
	Object.freeze(a);
return a;
}
_ ( MonadF )
{
let monad = this;
let theThis = this[SYS].theThis;
let m2 = MonadF.call (theThis, monad);
if (! m2 [SYS] )
{ m2 [SYS] = {}
}
if (! m2 [SYS].theThis)
{ m2 [SYS].theThis = theThis
}
return m2;
}
$ (dataF, timeout)
{
	if (! dataF)
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
				  (`\nComputation did NOT reach function "${dataF.name}()" 
within ${timeout} ms. \n`
          );
				}
				, timeout
			);
			// log (`SET timeout ${timeout} at \n${new Date().getTime()} `)
		}
	  addToDo.call (self, '$', [dataF], resultMonad, timer);
	  return resultMonad;
	}
  if (timer)
	{ clearTimeout (timer);
	}
	 let newMonad  =  dataF ( ... data ) ;
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
w (... funks)
{ // while
  let [testF, ... stepFunks]  = funks  ;
  let myData = this[SYS].data;
  let bool      = testF (... myData);
  if (! bool)
	{ // this is certanly possible
		return this;
	}
  let nextMonad = this;
  while (bool)
	{  let previousMonad = nextMonad;
	   nextMonad = stepFunks[0] (previousMonad);
     if (! ( nextMonad instanceof  Monad))
		 {
		 	debugger
		 	// why.
		  throw new Error
		  (`WHILE -2nd arg-funk ${ stepFunks[0].name} 
did NOT return a MONAD but: ${typeof nextMonad}  ${nextMonad} 
		    `)
		 }
	   // would using m() be BETTER so that we can have
	   // one funk per  elem?
	   // want to have m() apply it separately
	   // to every elment but  we want to
	   // manipulate the current monoad as whole
	   // why ? BECAUSE then we can apply s() to it
	   // as a whole. THEREFORE WHILE takes only  two
	   // arguments  a bit like $(), not everybody
	   // has to be like m().
     // nextMonad = nextMonad.m (... stepFunks);
     bool = testF (nextMonad[SYS].data);
	}
 return nextMonad;
}
u (... funks)
{ // until
}
monad (... funks )
{
	let {  resultMonad, self} = this;  // when I am called as a todo later
	if (this instanceof Array)
	{ self =  this;
	}
	let siz  = self.size();
	if (!  resultMonad)           // if it is there it is an array
	{
	  resultMonad = new (self.constructor) (siz);
		resultMonad [SYS].ready    = false;
		resultMonad [SYS].theThis  = this  [SYS].theThis;
if (! self[SYS].data)
{ debugger
}
		resultMonad[SYS].history
		= [... self[SYS].history
		   , [... self[SYS].data]
		  ];
		// history contains data not monads. we copy the
		// data below to make sure it can not be manipulated
		// from the outsideexcept you can reset it by calling
		// resetH()
	}
// new Array(1,2) BEWARE that contaisn thoise elements but  new Array(5)  creates an array of length 5
	if (self[SYS].ready === false)
	{ addToDo.call (self, 'monad', funks, resultMonad)  ;
		return resultMonad;
	}
	let howManyReady  = 0;
	let f, unboundF;
	let data = self;
	if (self[SYS].data)
	{ data = self[SYS].data;
	}
  let myThis;
  if (this && this[SYS])
	{ myThis = this[SYS].theThis;
	}
	for (var j=0; j < siz; j++)
	{ if (funks[j] )
		{ f = funks[j];
		  unboundF = f;
		  if  (myThis !== undefined )
			{ f = f.bind (myThis);
			}
		}
		let outCh     = createOutChannel (j, resultMonad, unboundF) ;
		let resultOfF = f (data [j], outCh, j, data);
		if (resultOfF === undefined)
		{
       // when fetchdata arrives how am marked READY?
       // but problem is really when a monad is reurned
       // which is nmot ready the container still thinks
       // one or its elemetns is ready
		} else
		{ outCh (resultOfF);
		  // note if they do not do return then result is
		  // undefined and we DONT put it to outch because
		  // they probably will do that from within the method
		  // later perhaps async. If they retunded AND out
		  // something to outch THAT causes error because WE
		  // above push the reurn value to out-0ch
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
		 {  // should not come here any more
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
					if (typeof methodName === "function")
					{  methodName();
					   // completes what could not completed before
					   /// such as adding this monad as aaaan element
					   // to its container monad so tyhat npow the
					   // container-monad can become ready as well.
					   return;
					   // now we get this. Now must somehow
					   // cause the container to become ready as well.
					}
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
		{ ensureOnlyOneOutput (outCh);
			outCh._called = true;
      resultMonad[SYS].data
      = resultMonad[SYS].data
      ? resultMonad[SYS].data
      : [];
      let data = resultMonad[SYS].data;
			 if (resultOfF instanceof Array)
			 {
if ( resultOfF instanceof Monad )
{ // mopnads differe from ordinary arrays in that they can have hidden data.
  // it is the tasl of the system to extract the data out fo whatever
  // the step-unction returns
	// a monad was put into the out-channel.
	// we must takes its data instead?
	// Yes but later  it might be a monad which
	// is not ready so its data may not be valid yet.
			   if ( resultOfF [SYS].ready === false)
			   {
			    // TODO: if an element-result is a monad and
			     // that is not ready like the fetch-mond
			     // returned by my method fetch() then the containing
			     // monad can not be ready either why becaseu we
			     // will flatten out all elements when all are ready.
			     // below makes it ready too soon.
			     // bug was we did not add it to resultOfF but to result monad
			     // now we do and below arraynge this outCh to be called AGAIN
			     // when the resultOfF we got here becomes ready
			     outCh._called  = false; // else error
			      addToDo.call
			      (   resultOfF
			      ,  () => outCh (resultOfF)
			      , [  (...args
			           ) =>
								 { outCh (resultOfF);
								   // above in effect REDOES the current
								   // method-call  when the result-monad is ready.
								 }
			        ]
			      , resultMonad
			      )  ;
		        return  ;
			   } else
				 {
				 	// it is ready if it is a monad we should
				 	// take its data instead
if (resultOfF[SYS] && resultOfF[SYS].data  )
{
  resultOfF = resultOfF[SYS].data
}
				 }
			 }
			   data [i] = resultOfF;
			 } else
			 { // these are the element arrays to be concatenated later
			   data [i] = [resultOfF];
			 }
			 if (resultMonad[i] === undefined)
			 { howManyReady++; // in case it is adde many times
			 } else
			 { // not sure if we come here but it is clear
			 	 // if you overwrite an existing slot it does not
			 	 // cause the container to become any more ready.
			 }
       resultMonad[i] = null;
			 if (howManyReady >= siz)     // note they can become ready in any order
			 { allDone.call (this, resultMonad);
			 }
			 // IMPORTANT: This function must return
			 // undefined/nothing because that has
			 // sognificance as the reurn value of
			 // monad-step-functions which cause an
			 // error si a named monad-step-function
			 // returns anything but undefined.
		}
		function ensureOnlyOneOutput (outCh)
		{
			if (outCh._called)
			{
				throw new Error
						(`
		The monad() arg-function ${$f.name}() 
		produced MORE THAN ONE RESULT! 	  
		Either o() was called more than 
		once  OR  o() was called but then 
		return-statement with no-undefined
		return-value was ALSO executed, in:
		${$f}
		----------------------------------
		NOTE: You CAN execute
		 return o(newState)  
		in a monad-arg -function because,
		o(newState) returns undefined.
		` );
					}
		}
	}
}
of  (...args)
{ return Monad.of (...args);
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
	  if (true)
		{ return ob;
		}
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
	{ let todos =  this[SYS].todos;
		return todos;
	}
} // end _Monad()
function _Test (MonadCreatorF)
{
// _UserClassExample and _ServerExample
// test the classes they create as a
// side-effect of creating them.
//
// _ServerExample()  also STARTS HTTP-SERVER
// or two ON PORTs 8123 8124 so you can see
// how easy it is to create server-code with
// monads.
// So p0oint your browser to:
// http://127.0.0.1:8123/ and
//  http://127.0.0.1:8123/
basicTest (MonadCreatorF);
testAsyncMonad (MonadCreatorF) ;
_UserClassExample (MonadCreatorF);
let SE = _ServerExample (MonadCreatorF);
_ServerSubClassExample (SE, MonadCreatorF);
return
function basicTest (MonadCreatorF)
{
const A     = MonadCreatorF; // this.A;
const M     = MonadCreatorF; // this.A;
// maybe you want to refer ot it as M(onad)
// but it is an A(rray) so A is fine too.
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
ok (a. of       );
ok (a. monad    );
// ok (a. flat  ); // no more now replaced by:
ok (a. m  );
ok (a. $  );
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
 }
);
let ob = a[0];
let vers  = A.version();
fails ( $=> null.bad );
fails ( $=> fails ( $=> 321 )) ;
fails ( $ => A.baddy  = 321 ) ;
fails ( $=> A.version = 123); // A is immutable as well as is its version
// We no longer make th eobjects inside the monad
// immutable why because we want to to pass on
// systme-objects like IncominfMessage inside
// the monads and those contain cyclical references
// sindei them which would cause an error when
// trying to recursively freexe them. So, monadidc arrays
// themselves are immutable but they can carry
// mutable objects inside them, which helps performance
// too.
 ob.x      = 2 ;
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
// so do results of $() why
// basically to prevent you from returning
// their data BUT you could always return the
// whole monad. Calculation happens inside it.
ok (a3, [null, null, null]);
a3.$ (  (...a) => ok (a, [1,3,5])) ;
      // this function is a monad-instantioator
      // a.k.a monad-funk. Whatever I return
      // becomes the data of the monad return to
      // caller of $().  If I return nothing
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
// But when you call m(f) or $(f) on it  those
// methods coudl be ASYNC and therefore we hide
// their data. You can only see  that by calling
// their method m() passing as argument a function.
// .$() can be called passing in a Monad-class
// which creates its instances  in general
// synchronously but not really if the monad to
// which you send .$() is part of a pipeline
// some of which steps are async. Therefore $()
// must return a monad whose data is hidden.
a4 = a.m
( (e, o, i, a) =>
 { let methodGiver = this;
   let outChannel  = o;
   return  [e] ;
 });
a4.$ ( (...elems) =>
			  { ok (elems, [1,2,3]);
				}
     );
// See the diff between m() and $() above.
// m(e) is called for each element separately.
// $(...elems) is called with all of them
// when they are ready.
let a5 = a.m (e=>e);
a5.$( (...a) => ok (a, [1,2,3]));
let a7 = a.m (e => e+e, e=>e*e);
a7.$ ( (... a7) => ok (a7, [2, 4, 9]) );
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
. $ (A)       // $(M) transforms recipient into the arg-monad M but
              // so far A is our only monad-class so we use it to test.
. m (right)
. $ ()        // $() without argument returns the RECIPIENT
obAndState2 . $
(  (ob, location) =>
	 { ok ( location, {x:0, y:-1} );
	 }
);
let v = MonadCreatorF.version();
console.log (`SUCCESS arsub.js v.${v} tests have run`);
return v;
function left (e, o, i, a)
{ if ( i )
  {  return o ( Object.assign ({}, e, {x: e.x - 1}));
  }
  o (e);
}
function right (e, o, i, a)
{
	if ( i )   // i === 0 means e is the game-piece, 1 means e is its state.
	{ let newState = Object.assign ({}, e, {x: e.x + 1});
		return o (newState);
	}
 o (e);
}
function up (e, o, i, a)
{
	if ( i )   // i === 0 means e is the game-piece, 1 means e is its state.
	{ let newState = Object.assign ({}, e, {y: e.y + 1});
		return o (newState);
	}
	o (e);
}
function down (e, o, i, a)
{
	if ( i )   // i === 0 means e is the game-piece, 1 means e is its state.
	{ let newState = Object.assign ({}, e, {y: e.y - 1});
		return o(newState);
	}
  o (e);
}
} // end basicTest()
function testAsyncMonad (M)
{
   let asm   = M (1,2,3);
   let ok    = asm.ok;
	 asm
	 .m (asyncF10, asyncF1)
	 .$ (terminalY, 4); // 3);
   asm        // [1, 2, 3]
	 .m (asyncF10 )   // [10, 20, 30]
	 .m (asyncF1  )   // [11, 21, 31]
	 .m (asyncF10 )   // [110, 210, 310]
	 .m ( syncF1  )   // [111, 211, 311]
	 .m ( syncF2  )   // [113, 213, 313]
	 .$ (terminalX); // , no timeout for now  40);
	 function asyncF1  (e, o)
	 { setTimeout ( () => o (e + 1) , 0);
	 }
	 function asyncF10  (e, o)
	 { setTimeout ( () => o  (e*10) , 3);
	 }
	 function terminalY (... a)
	 { // note we come here async
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
	}  // end testAsyncMonad()
function _UserClassExample (MonadF)
{ return class UserClass
  {
		static test ()
		{
		 this. switchTest ()
			   . fetchTest  ();
		  let uce = new this();
      let A   = MonadF;
		  let a   = A (1,2,3).bind(uce);
      uce
      .   mainCalc()
      .$ (lookInside)
      .$ (lookInside2)
      ;
		  return ;
		  function lookInside (...elems)
			{ log ('lookInside: ' + elems.join (', '));
	      ok (elems, [11,21,31]);
				return elems;
			}
			function lookInside2 (...elems)
			{ log ('lookInside2: ' + elems.join (', '));
	      ok (elems, [11,21,31]);
				return elems;
			}
		}
		static switchTest ()
		{
			let me = new this();
			let A  = MonadF;
		let a = 	MonadCreatorF ("BaSe").bind(me)
		//	let a  = A ("BaSe").bind(me);
			let aOrBMonad
			= a.s ( switchTest, branchA, branchB );
			let loopedMonad = a . w
			( times4 ()
			, function whiler (currentMonad)
				{ let nextMonad
					= currentMonad.s ( switchTest, branchA,  branchB );
					return  nextMonad;
				}
			);
			let h    = loopedMonad.h();
			let hs   = h.map (e=>e[0]);
			let hsiz = h.length;
			ok (hsiz === 4);
			ok ( a.eq( hs[0], "BaSe")) ;
			return this;
		function times4 ()
		{ let i = 4;
			// The first 4 times you call my result-function
			// you get true result after that you always get
			// false. So if you usae this with w() the while-loop
			// gets executed 4 times meaning in the end there
			// wi8ll be 4 rentries in tyhe history of the
			// last result-monad.
			return (...data) =>
			{ i--;
				return  i >= 0;  // when i becomes -1 and later return false
			};
		}
		function switchMaybe (e,o,i,a)
		{
			let b =  switchTest ( e, i, a );
			return b ? branchA(e) : e;
		}
		function switchTest ( e, i, a )
		{
			 return new Date().getTime() % 2;
			 // Switch-test functions are normal functions
			 // which return 0, 1, 2,  .... which indicate
			 // which alternate branch to executed before
			 // passing the result to next state. If result
			 // is 0 then now processing is done by _s()
			 // it just reurns its recipioent monad as is.
			 // It is like IF-THEN if you pass in just one
			 // branch.
		}
		function branchA (previousMonad)
		{ return previousMonad.m( e => e.toLowerCase() );
		}
		function branchB (previousMonad)
		{ return previousMonad.m( e => e.toUpperCase() );
		}
		}
		static fetchTest ()
		{
		  let uce = new this();
      let A   = MonadF;
		  let a   = A (1,2,3).bind(uce);
      let a2  = A (1    ).bind(uce);
      let fetchM = a2.m (uce .fetchTest); // 1-sized base-monad is better here
      // fetchM has no data after the above.
      // To get to see the data when it
      // ARRIVES we must inject a function
      // into the monad:
      fetchM . $
      ( (...es) =>
				{ console.log
				  (`
fetchMonad loaded content of size: 
 ${es.map(e=>e.length).join(', ')}` )
				}
      );
		  return ;
		}
		static init()
		{ this.test();
		  return this;
		}
    methodB (e,o,i,a)
		{ o (e+1);
		}
	  methodC (e,o,i,a)
		{
		}
	newMonad (...elems)
	{ return MonadF (...elems).b(this)
	}
	fetch (... urls )
	{
	  return this
		. newMonad (...urls  ) // todo: test getting multiple urls
		. m (GET );
}
	  fetchTest (e,o,i,a)
		{
			let fetchMonad
			= this.fetch
			  ( 'https://developer.mozilla.org/en-US/'
			  ,  'https://www.google.com/'
			  );
			fetchMonad  . $
			( (html, ...rest) =>
				{ if (html instanceof Error)
					{ log (`GETMonad ERROR:  ${html}`)
					} else
				{  log (`Call ${i} of GETMonad produced: \n ${(html + "").slice(0, 67)} ... `)
				}
				}
			);
      // Test trying to fetch  non-existent url:
			this.fetch ('https://no-such-websidez6452')
			. $
			(  html =>
				{ if (html instanceof Error)
					{ log (`GETMonad ERROR:  ${html} `)
					} else
					{  log (`Call ${i} of GETMonad produced: \n ${(html + "").slice(0, 67)} ... `)
				 }
				}
			) ;
		   // note we come here 3 times
		// so what do we output?
    o (fetchMonad) ;
    return;
		// Answer:  the output of a monmad-arg-function
		// is supposed to be a monadic value but in our
		// frameworks you can also return a single element
		// of the monad.
		//
		// We internally detect it is not an
		// array and if so we turn it into one, therefore
		// we often for simplicity juts return individual
		// elements from the monad arg-functions.
		// BUT: It is also possible to return a monad as well
		// that is the whole POINT of MONADS, the type of
		// the monad arg-functions is  e => [e] .
		//
		// So here we can return the fetchMonad and we can
		// do that whether it has its value already or not.
    // In fact it is NOT ready at current time so it
    // looks empty if you try to inspect it in deb ugger.
    // And it is empty when mainCalc() gets it. It is
    // only when you pass a function inside it and when
    // the function gets called because data has arrived
    // that yuopu will see any data.
}
	  methodA (e,o,i,a)
		{
			 // note we come here 3 times if there are
			 // 3 elements in the original monad/array
		  let aUserClassExample = this;  // I WAS BOUND
		  ok (aUserClassExample.methodA.call)
		  ok (this.methodB);
      ok (this.methodC);
 	 o (e*10);
   //      return e*10;
}
		mainCalc ( o  )
		{ let A     = MonadF;
		  let a     =  A (1,2,3).bind(this);
      return a
      .m (this.methodA)
 			.m (this.methodB)
   	}
   whileTest (...elems )
	 { let test = (new Date().getTime()) % 9  ;
     return test;
	 }
	 whileStep (e, o, i, a)
	 { // this is a step fuink
     let userC = this;
	   return e + 1;
	 }
  } .init()
} // end _UserClassExample()
function _ServerExample (MonadF)
{ return class ServerExample
  {
    static startServer (port=8123)
		{
		  let ServerClass = this;
      startServerF (port);
      return;
      function handleRequest (req, resp)
			{
 				 let me    = new ServerClass ();
 				 let state = {};
		     let monad = MonadF ( {req, resp, state, port}
		                        ).bind(me);
		     monad ._ (me.authenticate  )
					     ._ (me.authorize     )
					     ._ (me.produceContent)
				       ._ (me.sendContent   )
				       ;
			}
		  function startServerF (port=8123)
			{ let http       = require('http');
				let nodeServer = http.createServer (handleRequest);
				nodeServer . listen (port);
				log (`
STARTED HTTP-SERVER at http://127.0.0.1:${port}
`);
			}
    }
		static test (port=8123)
		{
			if (typeof require !== "undefined")
			{  this.startServer (port);
			}
		  return ;
		}
		static init(port=8123)
		{ this.test(port);
		  return this;
		}
		authenticate (aMonad)
		{ return aMonad.m (f);
			 function f
				( {req, resp, state, port}, o, i)
			 {
			   // if below we mark  this as 403 un-authenticated
			   // then tehre is still 50% chance that  page becomes
			   // un-authorized meaning there is only 25% chance
			   // that status will be 401. THEREFORE to make this
			   // demo more illustrative we decrease the chance
			   // of un-authorization in authorize()
				 let flip = new Date().getTime() % 2;
				 flip = flip ? true : false;
				 state._authenticated = flip;
				 if (! state._authenticated)
				 { state._status     = 401; // un-AUTHENTICATED
				 }
				 return {req, resp, state, port};
			 }
		}
		authorize (aMonad)
		{ return aMonad.m (f);
			function f ({req, resp, state, port}, o, i)
			{
				 // can you be authorized is you are not authenticated?
         // yes because depending on the URL some pages are
         // available to the public, you are authorized to view
         // thejm even if we can not or did not authenticate you.
         // And even if you are authenticated you are not
         // authorized to see very possible page.
         //
         // So the status tells the REASON why you did not see
         // the content of the page. But really the logic is then
         // that mere3 lack of authenticaton should not be the
         // reason to not see a page.
				 let flip = new Date().getTime() % 4;
				 // increase the chance of passiong authorizaiton
				 // so the 3rd option neither un-autghenticated nor
				 // un-authorized has more equal chance.
				 flip = flip ? true : false;
         state._authorized = flip;
         if (! state._authorized)
				 { state._status = 403;
				 }
				 return {req, resp, state, port};
			}
		}
		sendContent (aMonad)
		{ return aMonad.m (f);
			function f ({req, resp, state}, o, i)
			{
			  let content = state._content;
			  let status  = state._status;
			  status      = status ? status : 200;
			  resp.statusCode = status;
			  resp.setHeader('Content-Type', 'text/html');
        resp.end (content);
				return {req, resp, state};
			}
		}
		produceContent (aMonad)
		{ return aMonad.m (produceContentF);
			function produceContentF ({req, resp, state, port}, o, i)
			{
         let content    = this.htmlContent (state._status);
         // Observe: The 'this' is an instance of the
         // ServerExample or its subclass, wo we can call
         // upon its methods.
         state._content = `${content}`;
				 return {req, resp, state };
			}
		}
		htmlContent (status)
		{  // This is not a flowchart method argumetn is not a monad.
		   // Making this amethod make it possible to inherit
		   // this into subcalsses.
		     let content = 'A) Logged-in and authorized to see this content. ';
				 if (status === 403 )
				 {  content = `B) <u>UN-AUTHORIZED, forbidden</u>. <br>
                       Either<br> a) You ARE logged-in but you   do NOT have <br>
                        the rights to see
                         the page you requested or <p> b)
                      You are NOT logged-in AND the page   <br>
                       you requested is not available to the public. `;
				 }
		     if (status === 401 )
				 {  content = 'C) NOT logged-in, BUT, this IS PUBLIC content, <br>so here it is .... ';
				 }
         return `<h2>${content}</h2>`;
		}
  } .init(8123)
} // end _ServerExample()
function _ServerSubClassExample (ServerExample, MonadF)
{
	return class ServerSubClass extends ServerExample
  {
		produceContent (aMonad)
		{
		    return  aMonad
		     ._ (this.innerHTML)
		     ._ (this.outerHTML)
				 ;
		}
    innerHTML (aMonad)
		{
		  // USING SUPER-MONADS:
		  let superMonad = super.produceContent (aMonad);
		  return superMonad.m (f);
			function f ({req, resp, state, port}, o, i)
			{
			  let content  =  state ._content;
        let contentB = this.htmlContent (state._status); // inherited method
        // We could use the above inherited method as well
        // as anotehr way to get the inherited content.
        //
        // NOTE: BECAUSE we above called superMonad.m (f);
        // it measn the 'this' here is whatever the
        // monad m was originally bound to if it was
        // which makes it easy to reuse METHODS of the
        // owning class INSIDE INNERT FUNTIONS like here.
        ok (content === contentB);
         debugger
        state = Object.assign({}, state);
        state._content =
`<h2>SERVER-SUBCLASS @ ${port} <p>
${content}</h2>`;
				 return {req, resp, state, port};
			}
		}
		outerHTML (aMonad)
		{ return aMonad.m (f);
			function f ({req, resp, state, port}, o, i)
			{
			  let innerContent = state._content;
        state  = Object.assign({}, state);
			  state._content = `
<!DOCTYPE html>
<html><head><title>ServerSubClass</title></head>			   
<body class="ServerSubClass">
${innerContent}
</body></html>
`;
return {req, resp, state, port};
			}
		}
	} .init(8124)
}
function log (s)
{ console.log(s)
}
function ok (...args)
{ return MonadCreatorF.ok (...args);
}
function GET  (url, o, i, a)
{
  if (isNodeJs () )
	{ let result =  nodeJsGET (url, o);
	  // problem is the nodeJsGET() returns nothing
	  // somwhow this measn there is no todo to do
	  // when the get-output is passed to o().
	  // THe issue is when fetchTest reurns the monad
	  // its data   will not trigger the call to
	  // observer funk of the container monad, which
	  // whould get ready ONLY when all its elemnetns
	  // are ready.
	  // PROBLEM IS if a step-function like GET returns
	  // undefined then the calling m() thinks it should
	  // WAIT for  the reak result to come via o() but
	  // it does not because above we thought we have
	  // the result already but m() ignores it since it
	  // iws undefined.
	   return result;
	} else
	{ return browserGET (url, o);
	  // for the client-side test to succeed you must have a
	  // a web-server running this page and it must respond to
	  // the above url '/index.htm'. But if not consider
	  // this a test of how the error gets handled, see
	  // the browser DEV-console.
	}
  return ;
function nodeJsGET (url, o)
{ let https = require('https');
	https.get
	( url
	, rsp =>
		{ let response  = '';
			rsp.on
			('data', (chunk) =>
				{ let see = url;
				  response += chunk; // turns buffer-data to string
				}
			);
			rsp.on
			('end', () =>
				{  let result = url + " :  " + response;
				   o ( result );
				}
			);
		}
	) .on
	   ('error', (e) =>
				{ let result = url + " :  " + e;
				   o ( new Error ( `nodeJsGET(): ${result} `));
				}
		 );  // error-handler must be attached to the get-call
		     // because there is no rsp if the website is not found.
 }
function browserGET (url, o)
{
  fetch (url, {credentials: 'include' } )
  .then
  (rsp =>
   { if (  rsp.ok )
	   {  o ( rsp . blob());
	      return;
	   };
   }
  )
  .catch
  ( rsp => o ( new Error ('browserGET(): ' + rsp))
	)
}
function isNodeJs ()
{ return typeof require === "function" &&
	       typeof module === "object" ;
}
}
} // end _Test()