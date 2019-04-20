# arsub 0.1.2

A subclass of Array adding a few useful methods.
 

##### USAGE:

    let A  = require ("arsub");
    let ok = A.ok;
    // ok (a,b) means a and b must be equal,
    // else an error is thrown. ok() works
    // also with Arrays and Objects, recursively

    let a = A(1, 2, 3, 4, 5);
    ok (a.size(), 5 );

    // more examples below



##### RELEASE-ANNOUNCEMENTS:
   
https://twitter.com/ClassCloudLLC
   
   
#### 0. MOTIVATING EXAMPLES

    let a = A(1, 2, 3, 4, 5);

    ok (a.first ()  ,  5 );
    ok (a.first (1) , [5]);
    ok (a.first (2) , [4. 5]);
    ok (a.first (-1), [2,3,4,5]);
    ok (a.first (-2), [3,4,5]);

    ok (a.last ()  ,  5 );
    ok (a.last (1) , [5]);
    ok (a.last (2) , [4. 5]);
    ok (a.last (-1), [2,3,4,5]);
    ok (a.last (-2), [3,4,5]);

    // plus more, read the static method test():



#### 1. INSTALLATION
    npm install arsub
    
#### 2. REQUIRING

##### A) With Node.js

    const A  = require ("arsub");
    // You can use it like Array so call it 'A'.


##### B) With  browser

    <script type="module">

     import A from './arsub_es6.js';
     let a = A (1,2,3);
     A.ok (a, [1,2,3]);

    </script>

Open the file **./test_browser.html**  in your
browser to test-run the above.

Use the above as example for
how to import  the ES6-module
**arsub_es6.js** to your own
browser-side html- or js-files.

Seems to work on latest versions of Edge,
FireFox and Chrome.

#### 3. API  

##### 3.1 Array-subclass Arsub

       const A  = require ("arsub");
       let ok   = A.ok;
       let a    = A (1,2,3); // Immutable

       ok (a. size    ); // The length
       ok (a. first   ); // First elements
       ok (a. last    ); // Last elements
       ok (a. addFirst); // Add new elements to the beginning
       ok (a. addLast ); // Add new elements to the end
       ok (a. copy    ); // (shallow) copy with overriding or new elements

       ok (a. get     ); // Get element from sparse array
       ok (a. put     ); // Put element to sparse array
       ok (a. eq      ); // Test array equality recursively

       ok (a. monad   ); // The monad bind-function.
       ok (a. flat    ); // Same as monad
       ok (a. of      ); // Create new instance with given elements

       // Above just lists all API-methods showing
       // by calling ok() that the above methods
       // do exist. Arsub is a subclass of Array so
       // in imnherits all Array-methods as well.
       //
       // Read the source of the static method
       // test() to see how they can be used.



##### 3.2 Extra ok()

    let ok = A.ok;

    // The utility function ok() is
    // used in the tests, piggy-backing
    // with arsub.js since it is so useful.
    // See the source-code it is not long

    ok ([1,2], [1,2])

#### 4. Tests

Tests are coded in and executed by
the static test() -method of the
class 'Arsub' defined in arsub.js.

When the class is defined those
tests are run. That happens
only once, when you load the module,
not at runtime. Unless you explicitly
call Arsub.test() again.

See the source Luke.
   
#### 5. What does 'arsub' mean?
It means Array-subclass.

#### 6. License
SPDX-License-Identifier: Apache-2.0


