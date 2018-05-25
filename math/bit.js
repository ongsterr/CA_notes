// 1 = 00000001
// 2 = 00000010
// OR = 00000011 = 3
// AND = 00000000 = 0

console.log(1 | 2) // Bitwise OR
console.log(1 & 2) // Bitwise AND

// Read, Write, Execute
// 00000100 = Read only
// 00000010 = Write only
// 00000001 = Execute only

const readPermission = 4;
const writePermission = 2;
const executePermission = 1;

let myPermission = 0;
myPermission = myPermission | readPermission | writePermission

let message = (myPermission & readPermission) ? 'Yes' : 'No' // Output: Yes because (myPermission & readPermission) returns >0, hence 'true'