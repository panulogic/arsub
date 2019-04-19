# arsub 0.0.11

A subclass of Array adding
a few useful methods.
 

##### USAGE:

    let A  = require ("arsub");
        
    let a = A(1,2,3);
    a.end();
    a.wof();
    a.wol();

    a.monad (e=>[e]);


##### RELEASE-ANNOUNCEMENTS:
   
https://twitter.com/ClassCloudLLC
   
   
#### 0. MOTIVATING EXAMPLES

    const A   = require ("arsub");
    let a     = A (1,2,3,99);
    let ok    = A.ok;

    let last  = a.end();
    ok (last, 99);
    // no more clumsy a[a.length-1]

    ok (a.eq ([1,2,3,99]) === true );
    ok (a.eq ([1,2,3])    === false);
    // array equality





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

Open the file
 **./test_browser.html**  in your
 browser to test-run the above.
 Use the above as example for
 how to import  the ES6-module
  **arsub_es6.js** to your own
  browser-side html- or js-files.



Seems to work on latest versions of Edge,
FireFox and Chrome.

#### 3. API  

##### 3.1 Array-subclass require(arsub)

       const A  = require ("arsub");
       let a     = A (1,2,3,99);

       let last  = a.end();
       A.ok (last, 99);

       // Transforming an existing
       // standard array into an Arsub -array:

       let aStd  = [1,2,3];
       let a2     = A (...aStd);
       A.ok (a2.end(), 3);

       // Sticking to arsubs:

       let a3 = a2.slice(0);
       // a3 is also an arsub so it
       // hjas all its extra methods
       // like .end():
       A.ok (a3.end(), 3);



##### 3.2 Extra ok()

    let ok = A.ok;

    // The utility function ok()
    // used in the tests, piggy-backing
    // with arsub.js since it is so useful.
    // See the source-code it is not long

    ok ([1,2], [1,2])

#### 4. Tests

Tests are coded in and executed by
the static test() -method of the
class 'Arsub' that is the exports of
arsub.js.

When the class is defined those
tests are run. That happens
only once, when you load the module,
not at runtime. Unless you explicitly
call Arsub.test() again.

See the source Luke!
   
#### 5. What does 'arsub' mean?
It means Array-subclass.

#### 6. License
SPDX-License-Identifier: Apache-2.0


