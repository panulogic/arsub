/**
   Copyright 2019 Class Cloud LLC. All Rights Reserved.
*/

"use strict";

module.exports =  _A2() ;


function _A2 (   )
{
  return class A2 extends Array
	{

	  static test ()
		{ let a2 = this.of (1, 2, 3);
		  ok  (a2 instanceof Array);
		  ok (a2, [1, 2, 3]);

      let see4 = a2 + "";
      a2.push (77);
      ok (a2.length === 4)
      ok (a2.pop()  === 77)
      ok (a2.length === 3)


			ok (a2.size(), 3)
			ok (a2.end() , 3);  // default arg is 0 meaning return the end-element
			ok (a2.end(0), 3);
			ok (a2.end(1), 2);        // 1 means return the 1st before last
		  ok (a2.end(2), 1)         // 2 means return the 2nd before last
      ok (a2.end(3), undefined) // 3 steps from the end is undefined


			ok (a2.wof (0), [1,2,3]) ; // drop zero elements from left
			ok (a2.wof () , [2,3])   ; // 1 is the default but seldom used
			ok (a2.wof (1), [2,3])   ; // if you want to drop 1 must be clear
 			ok (a2.wof (2), [3])     ;
			ok (a2.wof (3), [])      ;
			ok (a2.wof (4), [])      ;

		  ok (a2.wof (-1), [3])      ; // all except last 1
		  ok (a2.wof (-2), [2,3])    ; // all exceptlast 2
		  ok (a2.wof (-3), [1,2,3])  ; // drop all except last 3 == keep all of them
		  ok (a2.wof (-55), [1,2,3]) ; // drop all except last 55 == keep all of them

			ok (a2.wol (0), [1,2,3]) ; // drop zero elements from left
			ok (a2.wol ( ), [1,2])   ; // 1 is the default but seldom used
			ok (a2.wol (1), [1,2])   ; // if you want to drop 1 you must be clear
 			ok (a2.wol (2), [1])     ;
			ok (a2.wol (3), [])      ;
			ok (a2.wol (4), [])      ;

		  ok (a2.wol (-1), [1])      ; // drop all but FIRST 1
		  ok (a2.wol (-2), [1,2])    ; // drop all but FIRST 2
		  ok (a2.wol (-3), [1,2,3])  ; // drop all but FIRST 3 == drop nothing
		  ok (a2.wol (-7), [1,2,3])  ; // drop all but FIRST 7 == drop nothing


// MONAD TESTS:

      let a3 = a2.monad ( (e, i, a) => e + i );
      ok (a3, [1,3,5]);


 let x = 0;
 let y = 0;
 let obAndState = A2.of ( {name: 'pieceA'}, {x, y}) ;

 let  nextPosition
 = obAndState.monad (left)
             .monad (up)
             .monad (right)
             .monad (down)
             .monad (down)
             .monad (left);

 ok (nextPosition[1], {x:-1, y:-1});

 console.log (`A2.js tests have run`);
 return;

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
		{ this.ok = ok; // others may want to use it too
		  this.test();
		  return this;
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
		{ return `A2.of(${this[0]}, ${this[1]}, ...)`
		}

    monad (funk)
		{ let result     = A2.of();
	    let elemArrays = this.map (funk);

			for (let i=0; i < elemArrays.length; i++)
			{ let elemArray = elemArrays[i];
				if (elemArray === undefined)
				{ continue;
				}
				if (! (elemArray instanceof Array ))
				{  elemArray = A2.of(elemArray);
				}
				for (let j=0; j < elemArray.length; j++)
				{ result.push (elemArray[j]);
				}
			}
			let see = result[-1];
			return result;
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

}