# Node.js Style Guide

Here we summarise the best practices, coding standards and tools for all our Node.js development.

This is a guide for writing consistent and aesthetically pleasing node.js code.
It is inspired by what is popular within the community, and flavored with some
personal opinions.

There is a .jshintrc which enforces these rules as closely as possible. You can
either use that and adjust it, or use
[this script](https://gist.github.com/kentcdodds/11293570) to make your own.

This guide was created by [Felix Geisendörfer](http://felixge.de/) and is
licensed under the [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/)
license. You are encouraged to fork this repository and make adjustments
according to your preferences.

![Creative Commons License](http://i.creativecommons.org/l/by-sa/3.0/88x31.png)

- Google's JavaScript Style Guide

[Read it](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml). You can skim through the bits that Felix already touched upon, because in the event of a conflict, Felix's Style Guide shall prevail. Please take extra care in reading the following three sections:

## Table of contents

### Formatting

- [2 Spaces for indentation](#2-spaces-for-indentation)
- [Newlines](#newlines)
- [No trailing whitespace](#no-trailing-whitespace)
- [Use Semicolons](#use-semicolons)
- [80 characters per line](#80-characters-per-line)
- [Use single quotes](#use-single-quotes)
- [Opening braces go on the same line](#opening-braces-go-on-the-same-line)
- [Declare one variable per var statement](#declare-one-variable-per-var-statement)

### Naming Conventions

- [Use lowerCamelCase for variables, properties and function names](#use-lowercamelcase-for-variables-properties-and-function-names)
- [Use UpperCamelCase for class names](#use-uppercamelcase-for-class-names)
- [Use UPPERCASE for Constants](#use-uppercase-for-constants)

### Variables

- [Object / Array creation](#object--array-creation)

### Conditionals

- [Use the === operator](#use-the--operator)
- [Use multi-line ternary operator](#use-multi-line-ternary-operator)
- [Use descriptive conditions](#use-descriptive-conditions)

### Functions

- [Write small functions](#write-small-functions)
- [Return early from functions](#return-early-from-functions)
- [Name your closures](#name-your-closures)
- [No nested closures](#no-nested-closures)
- [Method chaining](#method-chaining)

### Comments

- [Use slashes for comments](#use-slashes-for-comments)

### Miscellaneous

- [Object.freeze, Object.preventExtensions, Object.seal, with, eval](#objectfreeze-objectpreventextensions-objectseal-with-eval)
- [Requires At Top](#requires-at-top)
- [Getters and setters](#getters-and-setters)
- [Do not extend built-in prototypes](#do-not-extend-built-in-prototypes)

## Formatting

You may want to use [editorconfig.org](http://editorconfig.org/) to enforce the formatting settings in your editor. Use the [Node.js Style Guide .editorconfig file](.editorconfig) to have indentation, newslines and whitespace behavior automatically set to the rules set up below.

### 2 Spaces for indentation

Use 2 spaces for indenting your code and swear an oath to never mix tabs and
spaces - a special kind of hell is awaiting you otherwise.

### Newlines

Use UNIX-style newlines (`\n`), and a newline character as the last character
of a file. Windows-style newlines (`\r\n`) are **forbidden** inside any repository.

### No trailing whitespace

Just like you brush your teeth after every meal, you clean up any trailing
whitespace in your JS files before committing. Otherwise the rotten smell of
careless neglect will eventually drive away contributors and/or co-workers.

### Use Semicolons

According to [scientific research][hnsemicolons], the usage of semicolons is
a core value of our community. Consider the points of [the opposition][], but
be a traditionalist when it comes to abusing error correction mechanisms for
cheap syntactic pleasures.

[the opposition]: http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding
[hnsemicolons]: http://news.ycombinator.com/item?id=1547647

### 80 characters per line

Limit your lines to 80 characters. Yes, screens have gotten much bigger over the
last few years, but your brain has not. Use the additional room for split screen,
your editor supports that, right?

### Use single quotes

Use single quotes, unless you are writing JSON.

_Right:_

```js
var foo = 'bar';
```

_Wrong:_

```js
var foo = ''bar'';
```

### Opening braces go on the same line

Your opening braces go on the same line as the statement.

_Right:_

```js
if (true) {
  console.log('winning');
}
```

_Wrong:_
'

```js
if (true) {
  console.log(''losing'');
}
```

Also, notice the use of whitespace before and after the condition statement.

### Declare one variable per var statement

Declare one variable per var statement, it makes it easier to re-order the
lines. However, ignore [Crockford][crockfordconvention] when it comes to
declaring variables deeper inside a function, just put the declarations wherever
they make sense.

_Right:_

```js
let keys = ['foo', 'bar'];
let values = [23, 42];

var object = {};
while (keys.length) {
  let key = keys.pop();
  object[key] = values.pop();
}
```

_Wrong:_

```js
let keys = ['foo', 'bar'],
  values = [23, 42],
  object = {},
  key;

while (keys.length) {
  key = keys.pop();
  object[key] = values.pop();
}
```

[crockfordconvention]: http://javascript.crockford.com/code.html

## Naming Conventions

### Use lowerCamelCase for variables, properties and function names

Variables, properties and function names should use `lowerCamelCase`. They
should also be descriptive. Single character variables and uncommon
abbreviations should generally be avoided.

_Right:_

```js
var adminUser = db.query('SELECT * FROM users ...');
```

_Wrong:_

```js
var admin_user = db.query('SELECT * FROM users ...');
```

### Use UpperCamelCase for class names

Class names should be capitalized using `UpperCamelCase`.

_Right:_

```js
function BankAccount() {}
```

_Wrong:_

```js
function bank_Account() {}
```

### Use UPPERCASE for Constants

Constants should be declared as regular variables or static class properties,
using all uppercase letters.

_Right:_

```js
var SECOND = 1 * 1000;

function File() {}
File.FULL_PERMISSIONS = 0777;
```

_Wrong:_

```js
const SECOND = 1 * 1000;

function File() {}
File.fullPermissions = 0777;
```

[const]: https://developer.mozilla.org/en/JavaScript/Reference/Statements/const

## Variables

### Object / Array creation

Use trailing commas and put _short_ declarations on a single line. Only quote
keys when your interpreter complains:

_Right:_

```js
var a = ['hello', 'world'];
var b = {
  good: 'code',
  'is generally': 'pretty',
};
```

_Wrong:_

```js
var a = [
  'hello', 'world'
];
var b = {"good": 'code'
        , is generally: 'pretty'
        };
```

## Conditionals

### Use the === operator

Programming is not about remembering [stupid rules][comparisonoperators]. Use
the triple equality operator as it will work just as expected.

_Right:_

```js
var a = 0;
if (a !== '') {
  console.log('winning');
}
```

_Wrong:_

```js
var a = 0;
if (a == '') {
  console.log('losing');
}
```

[comparisonoperators]: https://developer.mozilla.org/en/JavaScript/Reference/Operators/Comparison_Operators

### Use multi-line ternary operator

The ternary operator should not be used on a single line. Split it up into multiple lines instead.

_Right:_

```js
var foo = a === b ? 1 : 2;
```

_Wrong:_

```js
var foo = a === b ? 1 : 2;
```

### Use descriptive conditions

Any non-trivial conditions should be assigned to a descriptively named variable or function:

_Right:_

```js
var isValidPassword = password.length >= 4 && /^(?=.*\d).{4,}$/.test(password);

if (isValidPassword) {
  console.log('winning');
}
```

_Wrong:_

```js
if (password.length >= 4 && /^(?=.*\d).{4,}$/.test(password)) {
  console.log('losing');
}
```

## Functions

### Write small functions

Keep your functions short. A good function fits on a slide that the people in
the last row of a big room can comfortably read. So don't count on them having
perfect vision and limit yourself to ~15 lines of code per function.

### Return early from functions

To avoid deep nesting of if-statements, always return a function's value as early
as possible.

_Right:_

```js
function isPercentage(val) {
  if (val < 0) {
    return false;
  }

  if (val > 100) {
    return false;
  }

  return true;
}
```

_Wrong:_

```js
function isPercentage(val) {
  if (val >= 0) {
    if (val < 100) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
```

Or for this particular example it may also be fine to shorten things even
further:

```js
function isPercentage(val) {
  var isInRange = val >= 0 && val <= 100;
  return isInRange;
}
```

### Name your closures

Feel free to give your closures a name. It shows that you care about them, and
will produce better stack traces, heap and cpu profiles.

_Right:_

```js
req.on('end', function onEnd() {
  console.log('winning');
});
```

_Wrong:_

```js
req.on('end', function () {
  console.log('losing');
});
```

### No nested closures

Use closures, but don't nest them. Otherwise your code will become a mess.

_Right:_

```js
setTimeout(function () {
  client.connect(afterConnect);
}, 1000);

function afterConnect() {
  console.log('winning');
}
```

_Wrong:_

```js
setTimeout(function () {
  client.connect(function () {
    console.log('losing');
  });
}, 1000);
```

### Method chaining

One method per line should be used if you want to chain methods.

You should also indent these methods so it's easier to tell they are part of the same chain.

_Right:_

```js
User.findOne({ name: 'foo' })
  .populate('bar')
  .exec(function (err, user) {
    return true;
  });
```

_Wrong:_

```js
User.findOne({ name: 'foo' })
  .populate('bar')
  .exec(function (err, user) {
    return true;
  });

User.findOne({ name: 'foo' })
  .populate('bar')
  .exec(function (err, user) {
    return true;
  });

User.findOne({ name: 'foo' })
  .populate('bar')
  .exec(function (err, user) {
    return true;
  });

User.findOne({ name: 'foo' })
  .populate('bar')
  .exec(function (err, user) {
    return true;
  });
```

## Comments

### Use slashes for comments

Use slashes for both single line and multi line comments. Try to write
comments that explain higher level mechanisms or clarify difficult
segments of your code. Don't use comments to restate trivial things.

_Right:_

```js
// 'ID_SOMETHING=VALUE' -> ['ID_SOMETHING=VALUE', 'SOMETHING', 'VALUE']
var matches = item.match(/ID_([^\n]+)=([^\n]+)/));

// This function has a nasty side effect where a failure to increment a
// redis counter used for statistics will cause an exception. This needs
// to be fixed in a later iteration.
function loadUser(id, cb) {
  // ...
}

var isSessionValid = (session.expires < Date.now());
if (isSessionValid) {
  // ...
}
```

_Wrong:_

```js
// Execute a regex
var matches = item.match(/ID_([^\n]+)=([^\n]+)/);

// Usage: loadUser(5, function() { ... })
function loadUser(id, cb) {
  // ...
}

// Check if the session is valid
var isSessionValid = session.expires < Date.now();
// If the session is valid
if (isSessionValid) {
  // ...
}
```

## Miscellaneous

### Object.freeze, Object.preventExtensions, Object.seal, with, eval

Crazy shit that you will probably never need. Stay away from it.

### Requires At Top

Always put requires at top of file to clearly illustrate a file's dependencies. Besides giving an overview for others at a quick glance of dependencies and possible memory impact, it allows one to determine if they need a package.json file should they choose to use the file elsewhere.

### Getters and setters

Do not use setters, they cause more problems for people who try to use your
software than they can solve.

Feel free to use getters that are free from [side effects][sideeffect], like
providing a length property for a collection class.

[sideeffect]: http://en.wikipedia.org/wiki/Side_effect_(computer_science)

### Do not extend built-in prototypes

Do not extend the prototype of native JavaScript objects. Your future self will
be forever grateful.

_Right:_

```js
var a = [];
if (!a.length) {
  console.log('winning');
}
```

_Wrong:_

```js
Array.prototype.empty = function () {
  return !this.length;
};

var a = [];
if (a.empty()) {
  console.log('losing');
}
```

## Naming

The very explicit [Naming Style Rules](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml?showone=Naming#Naming) provide more than simple DOs and DONTs, they also explain why the given practices are encouraged. They also reinforce Felix's naming guidelines, for example:

- functionNamesLikeThis,
- variableNamesLikeThis,
- ClassNamesLikeThis,
- EnumNamesLikeThis,
- methodNamesLikeThis,
- CONSTANT_VALUES_LIKE_THIS,
- foo.namespaceNamesLikeThis.bar, and
- filenameslikethis.js

#### Code Formatting

The very explicit [Code Formatting Style Rules](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml?showone=Code_formatting#Code_formatting) provide all the examples you need to resolve ambiguities. Keep in mind that Google follows the C++ formatting rules in spirit. How about an example pertaining to a common source of contention: Function Arguments?

> When possible, all function arguments should be listed on the same line. If doing so would exceed the 80-column limit, the arguments must be line-wrapped in a readable way. To save space, you may wrap as close to 80 as possible, or put each argument on its own line to enhance readability. The indentation may be either four spaces, or aligned to the parenthesis.

#### Comments

The very explicit [Comments Style Rules](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml?showone=Comments#Comments) also follow the C++ rules in spirit and specifically use [JSDoc](http://usejsdoc.org/). There are many illustrative examples. Read them! And remember:

> Inline comments should be of the // variety.

### RESTful Structure

#### Keep server.js simple

The class constructor is contained in a file named server.js. A developer should be able to quickly read the file and identify all the supported routes. Imagine it as a table of contents for the REST API.

Below is an example server.js file.

```javascript
var express = require('express');

/**
 * An example RESTful class constructor
 * @constructor
 */
function RESTfulClass() {
  var self = this;

  self.app = express();

  self.app.use(function (req, res, next) {
    req.instance = self; // Sneak the class object
    next(); //   instance into the req
  });

  // Each route is in a separate external file
  self.app.use('/someroute', require('./routes/someroute'));
  self.app.use('/anotherroute', require('./routes/anotherroute'));

  self.app.listen(80);
}

module.exports = RESTfulClass;
```

#### One route per file

Each API route is in a separate external file within a routes subfolder. A developer should be able to quickly read the file and identify any middleware used, all the routes and subroutes as well as the supported HTTP methods for each.

Each route is an [express router object](http://expressjs.com/api.html#router).

Each method (GET, POST, PUT, DELETE, ...) for a given route will be implemented via a function call. This allows a developer to quickly navigate to the implementation of any given route. For clarity, the function name will have a prefix corresponding to the given HTTP method, specifically:

- GET = retrieve
- POST = create
- PUT = replace
- DELETE = delete

In keeping with the previous example, the file routes/someroute.js would resemble the following:

```javascript
var express = require('express');
var router = express.Router();

router.use(function someMiddleware(req, res, next) {
  next();
});

router
  .route('/') // Supports GET, POST
  .get(function (req, res) {
    retrieveSomething(req, res);
  })
  .post(function (req, res) {
    createSomething(req, res);
  });

router
  .route('/:id') // Supports GET, PUT, DELETE
  .get(function (req, res) {
    retrieveSomethingSpecific(req, res);
  })
  .put(function (req, res) {
    replaceSomethingSpecific(req, res);
  })
  .delete(function (req, res) {
    deleteSomethingSpecific(req, res);
  });

function retrieveSomething(req, res) {} // GET = retrieve
function createSomething(req, res) {} // POST = create

function retrieveSomethingSpecific(req, res) {} // GET = retrieve
function replaceSomethingSpecific(req, res) {} // PUT = replace
function deleteSomethingSpecific(req, res) {} // DELETE = delete

module.exports = router;
```

## Development Tools

We use a handful of development tools to ensure that our code is consistent, tested and documented, thereby making everyone's life easier.

### JSHint for Standards Enforcement

See [JSHint](http://jshint.com/). Place the .jshintrc file included in this repository in the root folder of the project. To validate a file named server.js run:

    jshint server.js

Give yourself a pat on the back when jshint returns no errors.

### jscs for Code Style Enforcement

See [jscs](http://jscs.info/). Place the .jscsrc file included in this repository in the root folder of the project. To validate a file named server.js run:

    jscs server.js

Reward yourself with a beer when jscs returns _No code style errors found_.

### Mocha for Tests

See [Mocha](http://mochajs.org/). Create a test folder in the root with two subfolders:

- functional
- unit

Unit tests shall have a .test.js file matching the name of the .js file under test. Functional tests shall have a .test.js file named after the scenario under test. There shall be one scenario (describe) per file to keep things tidy.

The following is an example of /test/unit/server.test.js which would represent a unit test for the file /lib/server.js:

```javascript
var assert = require('assert');
var server = require('../../lib/server.js'); // Module under test

// Inputs for the scenario
var INPUT_DATA = 'coffee';

// Expected outputs for the scenario
var EXPECTED_DATA = { coffeeType: 'mocha' };

// Describe the scenario
describe('server', function () {
  // Set up the scenario (runs once at the start)
  before(function () {
    var self = this;
    self.server = new server();
  });

  // Reset the scenario (runs before each individual test)
  beforeEach(function () {
    var self = this;
    self.server.clear();
  });

  // Individual test (synchronous)
  it('should return an Object when instantiated', function () {
    var self = this;
    assert.equal(typeof self.server, 'object');
  });

  // Individual test (asynchronous)
  it('should return mocha when I ask for coffee', function (done) {
    var self = this;
    self.server.doSomethingAsynchronous(INPUT_DATA, function (data) {
      assert.deepEqual(EXPECTED_DATA, data);
      done();
    });
  });
});
```

### JSDoc for Documentation

See [JSDoc](http://usejsdoc.org/).
