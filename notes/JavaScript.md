# Variables
## `var`
* Deprecated way of declaring variables. 
* Can be globally or locally scoped.
* Cab be re-declared and updated.
* Try to avoid.
## `let`
* Block scoped declaration of variable.
* Variables declared with `let` can be updated but not re-declared in the same scope
```JavaScript
let x = "Hello";
if (true) {
	let x = "Hi";
	console.log(greeting);
}
console.log(greeting);

// This will log both "Hi" and "Hello" to the console
```
* Should really only be used when we intentionally want to be able to update a variables value (e.g. a `counter` variable for a loop).
## `const`
* Block scoped declaration of variable.
* __Cannot__ be updated or re-declared.
* If used with an object, the object properties __can__ be updated:
```JavaScript
const obj = {
	type: "Greeting",
	message: "Hello World"
};

console.log(obj);
/*
obj = {
	type: "Greeting",
	message: "Howdy"
}; // This will throw an error
*/

obj.message = "How's she cuttin?" // will work without error
console.log(obj);
```
* Should be the default variable declaration where possible.