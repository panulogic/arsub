/* =========================================
   Copyright 2019 Class Cloud LLC
   Copyright 2019 Panu Viljamaa

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

   =============================================*/

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
		{ return '0.3.3';
		}
constructor (...args)
{
  let a  = super (...args);
	a[SYS]          = {};
	a[SYS].redos    = [];
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
// _() does not take the data out opf the monad
// use $() for that. _() sinply cfalls the arg-function
// MonadF passing this monad as argument.  That is
// a simple way to provide simple syntax for
// chaining of arg-functions.  aMonad._(f1)._(f2) ....
let monad   = this;
let theThis = this[SYS].theThis;
let m2 = MonadF.call (theThis, monad);
if (! (m2 instanceof Monad))
{ debugger
  if (! (m2 instanceof Array))
	{ debugger
			m2 = [m2];
	}
  m2 = Monad.A(...m2);
}
if (! m2 [SYS] )
{ m2 [SYS] = {}
}
if (! m2 [SYS].theThis)
{ m2 [SYS].theThis = theThis
}
return m2;
}
$ (dataF, timeout)
{ if (! dataF)
	{ return this;
	}
	let { redoerMonad, self,   nextMonad, timer} = this;
	 // if I am called later when I become ready, have all my data.
	if (this instanceof Monad)
	{ self = this;
	} else
	{
	}
	let data = self;
	if (self[SYS].data)
	{ data = self[SYS].data;
	}
  let siz = self.size();
	if (self [SYS].ready === false)
	{ nextMonad = new (self.constructor) (siz);
	  nextMonad [SYS].ready  = false;
    let timer = setTimer  (dataF, timeout);
	  addReDo.call (self, '$', [dataF], nextMonad, timer);
	  // the above redo-data must include  nextMonad which
	  // we give out here because when I become ready
	  // the data of the result-monad must be updated
	  // because it can have followers as well.
	  return nextMonad;
	}
  if (timer)
	{ clearTimeout (timer);
	}
	 let newMonad  =  dataF ( ... data ) ;
	 // above does the main thing calling the arg-funk
	 // with my data so ti can do somethign with it like
	 // log it on console.
   // If the result of the funk is amonad then we can
   // simply return it:
	 if  (newMonad instanceof Monad )
	 { return newMonad;
	 }
    // So calling the funk above ios the main thing
    // but we also want to return something, and we
    // want to return a monad, which carries the data
    // further in case you want to do something more
    // with it:
   let data2 = newMonad;
   if (! (data2 instanceof Array))
	 { if (data2 === undefined)
		 { data2 = [];
		 } else
		 { data2  = [data2 ];
		 }
	 }
   let nulls = data2.map(e=>null)
	 newMonad = self.constructor.mutableOf (... nulls);
	 newMonad[SYS].data = data2;
	 Object.freeze (newMonad);
	 return newMonad;
function setTimer  (dataF, timeout)
{  let timer;
if (timeout === 4 )
{ debugger
}
	  if (timeout !== undefined)
		{   timer = setTimeout
			(  () =>
				{ timeoutError (dataF, timeout)
				}
				, timeout
			);
		}
  return timer;
function timeoutError (dataF, timeout)
{
  throw new Error
	 (`\nComputation did NOT reach function "${dataF.name}()" 
   within ${timeout} ms. \n`
	);
}
}
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
	let {redoerMonad, self, nextMonad, timer
	    } = this;  // when I am called as a todo later
	if (this instanceof Array)
	{ self =  this;
	}
	let siz  = self.size();
	if (!  nextMonad)  // measn this is the first call, not a redo
	{ nextMonad = new (self.constructor) (siz);
		nextMonad [SYS].ready    = false;
		nextMonad [SYS].theThis  = this  [SYS].theThis;
		nextMonad[SYS].history
		= [... self[SYS].history
		   , [... self[SYS].data]
		  ];
		// history contains data not monads. we copy the
		// data below to make sure it can not be manipulated
		// from the outsideexcept you can reset it by calling
		// resetH()
	}
// new Array(1,2) BEWARE that contaisn 1,2 but  new Array(5)  creates an array of length 5
	if (self[SYS].ready === false)
	{ addReDo.call (self, 'monad', funks, nextMonad);
	  // nextMonad is the new monad which is not ready but we
	  // return it anywya so it can be asked for more monads.
		return nextMonad;
	}
	let howManyReady  = 0;
	let f, unboundF;
	let data = self;
	if (self[SYS].data)
	{ data = self[SYS].data;
	}
  let myThis;
  if (self && self[SYS])
	{ myThis = self[SYS].theThis;
	}
  myThis =  myThis ? myThis : self;
  // if the monad was not explicitly bound
  // to anything then we use the monad itself
  // as  the 'this' inside the arg-functions.
  // A good default
	for (var j=0; j < siz; j++)
	{ if (funks[j] )
		{ f = funks[j];
		  unboundF = f;
		  if  (myThis !== undefined )
			{ f = f.bind (myThis);
			}
		}
		let outCh     = createOutChannel (j, nextMonad, unboundF) ;
    let dataAsMonad =   Monad.A(...data);
    // this makes it easy to extract last 2 etc.
    // and also makes sure the arrays as such can not be
    // modified inside the arg-funk.
		let resultOfF = f.call (myThis, data [j], outCh, j, dataAsMonad);
		if (resultOfF === undefined)
		{ // do NOT push anything to outchannel because
		  // we expect the function itself to do that
		  // asynchronously later
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
	return nextMonad ;
	// return it so the next m() call
	// can be called upon it.
	function allDone ( )        // redoerMonad is the one that just became ready
	{
	  let doneMonad = this;
	  doneMonad [SYS].ready  = true;
    // this monad is done but it may have followers in its redos
    // list whose data now needs to be calculated because
    // only now that can be done
		 let flat = [];
		 let data = doneMonad;
		 if (doneMonad[SYS].data)
		 { data = doneMonad[SYS].data;
		 } else
		 {  // should not come here any more
		   data = [];
		   doneMonad.map
		   ( (e,i,a) =>
			   { data[i] = e;
			   }
			 )
		   doneMonad[SYS].data = data;
		 }
		 data.map
		 ( (e, i, a) =>
			 { // ok (e instanceof Array); // because not flattened yet
			   flat =  [...flat, ...e];
			   data[i] = null; // note flattening can also reduce elements
			 }
		 )
		 flat .map
		 ( (e, i, a) =>
			 { data[i] = flat[i];
			   doneMonad[i] = null; // important because now there can be
			 }                      // more elements.
		 );
		 data.length = flat.length; // it is possible elems were dropped
     doneMonad.length = data.length;
		 Object.freeze (doneMonad);
		 let redos =   redosF.call (doneMonad);
		 redos .map
		 ( ( eRedo , i, a) =>
				{
					let [methodName, argFunks, nextMonad, timer] = eRedo;
					let self = doneMonad;
					if (typeof methodName === "function")
					{  methodName();
					   //  used when outCh was passed a no-ready monad
					   // which it put on ho9ld here now we can do what
					   // outCh does for ready monads.
					   return;
					}
// Why do we need to next pass-in also the doneMonad
// even though that is the subject of the call? BECAUSE
// using  .call() here replaces the actual target-this
// with the {} here so the method needs a way to figure
// out who is the monad it was originally called with:
					 doneMonad [methodName].call
					 ( { doneMonad, self, nextMonad, timer
						 }
					 , ... argFunks
					 );
				}
		 );
	}
	function createOutChannel (i, processedMonad,  $f)
	{
		ok (processedMonad);
		outCh._ii = i;
		return outCh;
		function outCh (resultOfF)
		{ ensureOnlyOneOutput (outCh);
			outCh._called = true;
      processedMonad[SYS].data
      = nextMonad[SYS].data
      ? nextMonad[SYS].data
      : [];
      let data = processedMonad[SYS].data;
			if (resultOfF instanceof Array)
			{
if ( resultOfF instanceof Monad )
{ // it can be a monad which is not ready
	// so must delay its processing until it
	// becomes ready.
			   if ( resultOfF [SYS].ready === false)
			   {
			     outCh._called  = false; // else error
			      addReDo.call
			      (   resultOfF
			      ,  () => outCh (resultOfF)
			      , [  (...args
			           ) =>
								 { outCh (resultOfF);
								   // above in effect REDOES the current
								   // method-call  when the result-monad is ready.
								 }
			        ]
			      , processedMonad
			      )  ;
		        return  ;
			   } else
				 { 	// it is ready if it is a monad we should
				 	  // take its data instead since the data is what
				 	  // will be flattened together with other
				 	  // elements results when all are ready..
if (resultOfF[SYS] && resultOfF[SYS].data  )
{ resultOfF = resultOfF[SYS].data
}
				 }
			 }
			   data [i] = resultOfF;
			 } else
			 { // these are the element arrays to be concatenated later
			   data [i] = [resultOfF];
			 }
			 if (processedMonad[i] === undefined)
			 { howManyReady++; // in case it is adde many times
			 } else
			 { // not sure if we come here but it is clear
			 	 // if you overwrite an existing slot it does not
			 	 // cause the container to become any more ready.
			 }
       processedMonad[i] = null;
			 if (howManyReady >= siz)     // note they can become ready in any order
			 { allDone.call (processedMonad );
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
	function addReDo (methodName, argFunks, nextMonad, timer )
	{ ok (nextMonad);
		ok (argFunks instanceof Array);
		this[SYS].redos.push
		 ( [methodName, argFunks, nextMonad, timer]
		 );
	}
	function redosF ()
	{ let redos =  this[SYS].redos;
		return redos;
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
fiboTest (MonadCreatorF);
basicTest (MonadCreatorF);
testAsyncMonad (MonadCreatorF) ;
_UserClassExample (MonadCreatorF);
let SE = _ServerExample (MonadCreatorF);
_ServerSubClassExample (SE, MonadCreatorF);
return;
function fiboTest (M)
{
// Calculating the Fibonacci-series is a
// good example of what monads can do that
// map() can not because the fiboArgFunk()
// below must produce a varying number of
// results each time it is called. map()
// can never return an array that is of
// different length than its recipient,
// m() can. Of course Fibonacci series can be
// calculated in many different ways but this
// example is abhout demonstrating why map()
// is not all you need..
//
// Note the method m() takes also the e, i
// and a -arguments like map() does, and uses
// those here to know about the other elements
// of the monadic-array being processed besides
// the current element.
 // A monad must have at least one element
 // if you want arg-function of m() to get
 // called -- since that gets called once
 // for each element.  Below the actual value
 // the fibo-series is started with does not
 // matter, just the fact that the starting
 // monad must have exactly one element.
  let fm0 =  M (0).m (fiboArgFunk);
  let fm1 =  fm0.m (fiboArgFunk);
  let fm2 =  fm1.m (fiboArgFunk);
  let fm3 =  fm2.m (fiboArgFunk);
  let fm4 =  fm3.m (fiboArgFunk);
  let fm5 =  fm4.m (fiboArgFunk);
  ok (fm5.eq([0,1,1,2,3,5,8]));
  let fm6 = M (0,1,1,2,3,5,8).m (fiboArgFunk);
  ok (fm6.eq([0,1,1,2,3,5,8,13]));
  // Only way to get the values out of a monad
  // is to use $() and a side-variable.
  // Note _() does not take the monad a part
  // it passes the monad as such as argument
  // to the arg-funk of _() so you can then
  // apply .s() and .w() etc. to it.
  // Note: $() can extract the data only if
  // it ready which may not be the case if
  // moand-steps are async.
  let fiboValues;
  fm6.$ ( (...data) =>
					{ fiboValues = data;
          }
	      );
  ok (fm3.eq (fiboValues, [0,1,1,2,3,5,8,13]));
  // eq() is an instance-method of monads.
  return;
 function fiboArgFunk  (e,o,i,a)
 {
   if (a.length === 1  )
	 { return [0, 1];
	 }
	 if (i  != a.length-1)
	 { return e;
	 }
	 let last2      = a.last(2);
	 let sumOfLast2 = last2[0] + last2[1];
   return [last2[1], sumOfLast2] ;
 }
}
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
	 .$ (terminalY, 445);
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
{  const DATA = Symbol('DATA');
    return class ServerExample
  {
    constructor (port)
		{ this[DATA]          = {};
		  this[DATA].sessions = {};
		  this[DATA].port     = port;
		}
    port ()
		{ return this[DATA].port
		}
    static startServer (port=8123)
		{
      let server = new this(port);
      server.start  ();
      return;
    }
		start  ()
	  { let port       = this[DATA].port;
	    let http       = require('http');
		  let nodeServer = http.createServer
		                   (this.handleRequest.bind(this));
			nodeServer . listen (port);
			log (`\nSTARTED HTTP-SERVER at http://127.0.0.1:${port}\n`);
		}
    handleRequest (req, resp)
	  {
      let me    = this;
 		  let state = {};
		  let monad = MonadF ( {req, resp, state}
		                     ).bind(me);
		  monad ._ (me.authenticate  )
					  ._ (me.authorize     )
					  ._ (me.produceContent)
				    ._ (me.sendContent   )
				     ;
			}
sessionIdKey ()
{ let port = this[DATA].port;
  let key =  'sessionId_' + port;
	return key;
}
    getSession (req, resp)
		{ let cookie   = this.getCookie  (req, resp);
			let sessions = this[DATA].sessions;
			let sid      = cookie[this.sessionIdKey ()] ; // .sessionId;
			// log (`SESSION-ID = ` + sid);
			return  sessions[sid];
			// session is undefined until authenticate()
			// calls getsNewSession() and stores its id
			// into the cookie.
		}
		getNewSession ( )
		{ let id = Math.random().toString(36).slice(2);
      let sn = {id};
		  this[DATA].sessions[id] = sn;
		  sn.count = 0;
			return sn;
		}
    serverId ()
		{
		  let sid = this.serverId._serverId;
			if (sid)
			{ return sid;
			}
			sid = Math.random().toString(36).slice(2);
      this.serverId._serverId = sid;
      return sid;
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
		getCookie (req, resp, key)
		{
			let cString = req.headers.cookie;
			if (! cString )
			{ return {};
			}
			let cookie  = {};
			let parts = cString.split(/;/);
			parts.map
			( s =>
				{ let ps2 = s.split(/=/);
				  let k   =  ps2[0];
				  let v   =  ps2[1]
				  if (k)
					{ cookie[k.trim()] = v;
					} else
					{ debugger
					}
				}
			);
			if (key)
			{ return cookie[key];
			}
			return cookie;
		}
    setCookie(k, v, resp)
		{	resp.setHeader
		   ('Set-Cookie', `${k}=${v}; HttpOnly `);
		}
		authenticate (aMonad)
		{ return aMonad.m (f);
			 function f
			 ( {req, resp, state, port}, o, i)
			 {
				 let u = req.url;
				 let session = this.getSession (req, resp)
         if (session)
				 { return {req, resp, state};
				 }
				 state._status = 401; // un-AUTHENTICATED, no session
				 // Below creates the session-cookie but that
				 // gets used only on the next page-request
				 // so this request will return a page which
				 // tells you to load the page again.
				 setTimeout
				 ( () =>
					 {
					   // problem is here  we create a new session because
					   // above the current-server instance did not
					   // have a stored session by key that comes in the
					   // request from the browser, which is the cookie
					   // created for the other part.
					   session = this.getNewSession ();
				     let sid = session.id;
				     this.setCookie
				       (this.sessionIdKey(), sid, resp);
					   o ( {req, resp, state} )
					 }
					 , 222
				 );
			 }
		}
		authorize (aMonad)
		{ return aMonad.m (f);
			function f ({req, resp, state, port}, o, i)
			{
				 let session = this.getSession(req, resp);
         if (! session)
				 { return {req, resp, state, port};
				   // we don't mark it unauthorized because
				   // it is un-authenticated as long as there
				   // is no session.
				 }
         let count = session.count;
         session.count++;
         if (count > 3)
				 {  state._status = 403;
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
         state._content = `${content}`;
				 return {req, resp, state };
			}
		}
		htmlContent (status)
		{
		     let content = `2) Authenticated and Authorized.<p>
                           Please reload this page a few times ...`;
		     if (status === 401 )
				 {  content = `1) Un-Authenticated. <p> 
				                  Please reload this page to get in .... `;
				 }
				 if (status === 403 )
				 {  content = `3) <u>Authenticated but UN-AUTHORIZED, <br>
                          page was reloaded too many times! </u>. `;
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
			function f ({req, resp, state}, o, i)
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
        state = Object.assign({}, state);
        state._content =
`<h2>SERVER-SUBCLASS @ ${this.port()} <p>
${content}</h2>`;
				 return {req, resp, state};
			}
		}
		outerHTML (aMonad)
		{ return aMonad.m (f);
			function f ({req, resp, state}, o, i)
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
return {req, resp, state};
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