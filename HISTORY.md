# A2.js release notes


For information about future releases
follow https://twitter.com/ClassCloudLLC.

######
##### v. 0.0.8: Simpler way to create arrays

     let a = A (1,2,3,99);

##### v. 0.0.7: Instance-methods eq() and of()

    ok (a.eq ([1,2,3]));
    ok (a.eq ([1,2,3])  === true );
    ok (a.eq ([1,2,55]) === false);

    ok (a.of (7,8) . eq ([7,8]));

##### v. 0.0.6: Fixed package.json so main file is arsub.js
##### v. 0.0.5: Better docs
##### v. 0.0.4: Better docs
##### v. 0.0.3: Added flat() as synonym fopr monad()
##### v. 0.0.2: Initial
##### v. 0.0.1: Initial
