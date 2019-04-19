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
  return class Arsub extends Array
	{
	  static version ()
		{ return '0.0.11';
		}

    static A (...args)
		{ return Arsub.of (...args);
		}

	  static test ()
		{
		  // throw new Error
		  // (`Testing how errors while loading arsub_es6.js show on the browser.`
		  // );

		  // Above was used to test and show what shows
		  // on the browser if an error happens when
		  // loading arsub on the browser. Note that
		  // arsub requires an ES6-capable browser.

		  const A = this.A; // shorthand see above this 'A' is what
		                    // will be exported from this module
      const ok = A.ok;

		  let a = A (1, 2, 3);
		  ok (a instanceof Array);
		  ok (a, [1, 2, 3]);

      ok (a.end);
      ok (a.slice(0).end(), 3);
      // When you create new array from an
      // Arsun instance with methods like slice()
      // inherited from Array the result is still
      // an instance of the subclass Arsub, so it
      // has its extra methods so you can keep on
      // using those.

      let see4 = a + "";
      a.push (77);
      ok (a.length === 4)
      ok (a.pop()  === 77)
      ok (a.length === 3)


			ok (a.size(), 3)
			ok (a.end() , 3);  // default arg is 0 meaning return the end-element
			ok (a.end(0), 3);
			ok (a.end(1), 2);        // 1 means return the one before last
		  ok (a.end(2), 1)         // 2 means return the 2nd before last
      ok (a.end(3), undefined) // 3 steps left is index -1 whose value is undefined


			ok (a.wof (0), [1,2,3])   ; // Drop zero first elements.
			ok (a.wof (1), [2,3])     ; // Without one first element.
			ok (a.wof () , [2,3])     ; // Same. 1 is the default arg-value.

 			ok (a.wof (2), [3])       ; // without first two
			ok (a.wof (3), [])        ;
			ok (a.wof (4), [])        ;

		  ok (a.wof (-1), [3])      ; // all except last 1
		  ok (a.wof (-2), [2,3])    ; // all exceptlast 2
		  ok (a.wof (-3), [1,2,3])  ; // drop all except last 3 == keep all of them
		  ok (a.wof (-55), [1,2,3]) ; // drop all except last 55 == keep all of them

			ok (a.wol (0), [1,2,3]) ; // Drop zero last elements. Means return a shallow copy
			ok (a.wol (1), [1,2])   ; // Drop one elment from the end.
			ok (a.wol ( ), [1,2])   ; // Same. 1 is the default but value of the argument.
 			ok (a.wol (2), [1])     ;
			ok (a.wol (3), [])      ;
			ok (a.wol (4), [])      ;

		  ok (a.wol (-1), [1])    ; // drop all but FIRST 1
		  ok (a.wol (-2), [1,2])  ; // drop all but FIRST 2
		  ok (a.wol (-3), [1,2,3]); // drop all but FIRST 3 == drop nothing
		  ok (a.wol (-7), [1,2,3]); // drop all but FIRST 7 == drop nothing

      ok (a.eq ([1,2,3]));
      ok (a.eq ([1,2,3])  === true );
      ok (a.eq ([1,2,55]) === false);


// You can create a new Arsub if you
// have  an exsiting instance, no need
// ask for its constructor:

   ok (a.of (7,8) . eq ([7,8]));

let b2 = a.of(  [1, [2, [3] ]]);
let b3 = b2.copy();


// MONAD TESTS:

 ok (a, [1,2,3]);

 let a3 = a.monad ( (e, i, a) => e + i );
 ok (a3, [1,3,5]);

 let a4 = a.monad (e=>[e]);
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
             .monad (down)   // name, so take your pick.
             .monad (down)   // Note monad() does not return
             .monad (left);  // a "monad" but a "monadic value"
                             // Think of the method-name as the
                             // verb "to monad". Another name
                             // for it could be "flat-map".

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
		{ this.A.ok      = ok.bind(this);
		  this.A.version = this.version;
		  this.test();
		  return this;
		}

    eq (a2)
		{ try
			{ ok (this, a2);
			} catch (e)
			{ return false;
			}
			return true;
		}

    size ()
		{ return this.length;
		}

    end (i=0)  // no arg means return the last element
		{ ok (i >= 0)
		  return this [this.length - (1 + i)];
		}


		wof  (howMany=1)
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

		wol  (howMany=1)
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

    monad (funk)
		{ let result     = Arsub.of();
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
			return result;
		}

    flat (funk)
		{ return this.monad(funk);
		}

    of  (...args)
		{ return Arsub.of (...args);
		}

copy ()
{ // deep copy
	debugger

}

	} .init();


function ok (a, b)
{ if (arguments.length > 1)
	{ if (a instanceof Array)
		{ ok (a.length === b.length);
			a.map ( (e,i) => ok (a[i],  b[i]));
			return ok;
		}
		if (a instanceof Object)
		{ ok (Object.keys(a).length, Object.keys(b).length);
			for (let p in a) { ok (a[p],  b[p])};
			return ok;
		}
		return ok(a === b);
	}
	if (! a)
	{ throw new Error ('ok() single-arg falsy');
	}
	return ok;
}



function es6Header (exportsValueString=" _arsub().A ")
{
debugger
return `
let theExport  = ${exportsValueString};
export default theExport;
`;
}

}