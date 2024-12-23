<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

# parcel-codegen-loader

[![npm](https://img.shields.io/npm/v/parcel-codegen-loader.svg)](https://www.npmjs.com/package/parcel-codegen-loader)
[![GitHub tag](https://img.shields.io/github/tag/FlorianRappl/codegen-js.svg)](https://github.com/FlorianRappl/codegen-js/releases)
[![GitHub issues](https://img.shields.io/github/issues/FlorianRappl/codegen-js.svg)](https://github.com/FlorianRappl/codegen-js/issues)

The `parcel-codegen-loader` resolves `import` / `require()` on a file into a Node.js module that is evaluated during the compilation. It expects the Node.js module to generate a webpack module on the fly establishing meta programming.

It follows pretty much the [parcel-plugin-codegen](https://www.npmjs.com/package/parcel-plugin-codegen) implementation.

## Getting Started

To begin, you'll need to install `parcel-codegen-loader`:

```sh
npm install parcel-codegen-loader --save-dev
```

Import (or `require`) the target file(s) in one of the bundle's files:

**file.js**

```js
import { entries } from './file.codegen';
```

where `file.codegen` could be written as follows:

```js
module.exports = function() {
  const entries = [1, 2, 3];
  return `export const entries = ${JSON.stringify(entries)};`;
};
```

Then add the loader to your `webpack` config. For example:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.codegen$/i,
        use: [
          {
            loader: 'parcel-codegen-loader',
          },
        ],
      },
    ],
  },
};
```

And run `webpack` via your preferred method. This will emit `file.png` as a file
in the output directory (with the specified naming convention, if options are
specified to do so) and returns the public URI of the file.

> ℹ️ By default the filename of the resulting file is the hash of the file's contents with the original extension of the required resource.

## Options

(No options yet.)

## Examples

The following examples show how one might use `parcel-codegen-loader` and what the result would be.

### Get Infos from a Remote Source

Let's say you want to get a static set of users for your module from an API.

**remote.codegen**

```js
const axios = require('axios');

module.exports = async function() {
  const res = await axios.get('https://jsonplaceholder.typicode.com/users');
  const users = res.data.map(m => ({ id: m.id, name: m.name, mail: m.email }));
  return `export const users = ${JSON.stringify(users)};`;
};
```

You can now use the following code to retrieve this static info:

```js
import { users } from './remote.codegen';
```

## Contributing

Contributions in any form are appreciated and much welcome!

## License

This plugin is released using the MIT license. For more information see the [LICENSE file](./LICENSE).
