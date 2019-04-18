# arsub 0.0.3

A subclass of Array adding
a few useful methods.
 

##### USAGE:

    let A2  = require ("arsub");
        
    let a2 = A2.of(1,2,3);
    a2.end();
    a2.wof();
    a2.wol();

    a2.monad (e=>[e]);


##### RELEASE-ANNOUNCEMENTS:
   
https://twitter.com/ClassCloudLLC
   
   
#### 0. MOTIVATING EXAMPLE

    let a     = A.of (1,2,3,99);
    let last  = a.end();
    A.ok (last, 99);
    // no more clumsy a[a.length-1]
    // ever time you need to get
    // the last element of an array.


#### 1. INSTALLATION
    npm install arsub
    
#### 2. REQUIRING

##### A) With Node.js

    const A  = require ("arsub");
    // You can use it like Array so call it 'A'.


##### B) With  browser


    <script src="arsub.js"></script>
    <script> let A2  = A2;
    </script>



SEE: **test_browser.html** which does the
above. To check whether it runs on your browser
open  **test_browser.html** in it. 

Seems to work on latest versions of Edge,
FireFox and Chrome.

#### 3. API  

##### 3.1 Array-subclass require(arsub)

       const A  = require ("arsub");
       // You can use it like Array so call it 'A'.

       let a     = A.of (1,2,3,99);
       let last  = a.end();
       A.ok (last, 99);

       // Transforming an existing
       // standard array into an Arsub -array:

       let aStd  = [1,2,3];
       let a2     = A.of (...aStd);
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


