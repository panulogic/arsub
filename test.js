/**
   Copyright 2019 Class Cloud LLC. All Rights Reserved.
*/
"use strict";

 let A  = require ("./arsub");
 let ok = A.ok;
 ok (A(1,2,3).size() === 3);

console.log
(`
npm INSTALL-TEST
${module.filename}
SUCCEEDED.
`
);


 // This test.js gets run when the module arsub.js
 // is installed from npm. There is very few
 // tests above because when the arsub.js gets
 // required it runs the tests in the static method
 // test() of the class whose instances A() creates.

