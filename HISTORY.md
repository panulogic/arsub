# arsub.js release notes


For information about future releases
follow https://twitter.com/ClassCloudLLC.

######
##### v. 0.3.0:  New type monad-arg function args: (e, o, i, a)
##### v. 0.2.2:  Cleaned up removed debugging statements
##### v. 0.2.1:  Updated README.md, method 'flat' was renamed 'm'
##### v. 0.2.0:  Better monad-API, external test.js
##### v. 0.1.2:  Better README.md
##### v. 0.1.1:  first() and last() with positive and negative args and with no arg.
##### v. 0.1.0:  Immutability enforced, sparse multi-D arrays
##### v. 0.0.11: Fixed a bug caused on the server-version by the browser-version

##### v. 0.0.10: ./arsub_es6.js can be loaded as an ES6-module to browsers
##### v. 0.0.9: Better docs
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
