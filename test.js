function createFunctions() {
  const funcs = [];
  for (var i = 0; i < 3; i++) {
    funcs.push(function () {
      return i;
    });
  }
  return funcs;
}

const funcs = createFunctions();
console.log(funcs); // 3, not 0!

// ✅ CORRECT with let
// function createFunctions() {
//   const funcs = [];
//   for (let i = 0; i < 3; i++) {
//     funcs.push(function () {
//       return i;
//     });
//   }
//   return funcs;
// }
