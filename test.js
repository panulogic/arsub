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

