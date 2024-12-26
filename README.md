![codegen](./title.png)

# `codegen-js`

> Explore the possibilities with Codegen and elevate your development experience with seamless bundling and code generation! 🚀

Codegen is a powerful tool for enabling bundling superpowers through advanced plugins and mechanisms. This repository contains all the libraries, plugins, and utilities you need to integrate code generation seamlessly into your development workflows.

Whether you're using modern bundlers like Webpack, rspack, esbuild, Vite, Rollup, or Parcel, or looking for integration with editors like Visual Studio Code, an integration exists.

## Features

- **Bundler Plugins**:
  - Dedicated plugins for popular bundlers:
    - [Webpack](https://webpack.js.org/)
    - [Rspack](https://rspack.dev/)
    - [esbuild](https://esbuild.github.io/)
    - [Vite](https://vitejs.dev/)
    - [Rollup](https://rollupjs.org/)
    - [Parcel](https://v1.parceljs.org/)
    - [Parcel v2](https://parceljs.org/)
    - [Bun](https://bun.sh/)
  - Enhance bundlers with custom code generation and dynamic content injection.
  
- **Editor Plugins**:
  - Convenience plugins for editor integration.
  - Editor-specific tooling, including [VS Code](https://code.visualstudio.com/).

- **Ease of Use**:
  - Focused on simplifying code generation in diverse environments.
  - Extensible and customizable for various project needs.
  - Bundler agnostic - easily swap bundlers.

## Installation

The plugins for each bundler or editor can be installed via npm, pnpm, or yarn. Below is an example for the Webpack plugin:

```bash
npm install parcel-codegen-loader --save-dev
```

Replace `parcel-codegen-loader` with the specific plugin for your bundler or editor as needed.

## Usage

### Bundler Plugins

1. Add the plugin to your bundler configuration.
2. Configure it as needed to fit your project requirements.
3. Benefit from dynamic code generation tailored to your build process.

Example for Webpack:

```javascript
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

### Editor Plugins

Follow the instructions in the relevant plugin documentation for integrating with your editor.

Example for VS Code:

1. Install the plugin from the marketplace.
2. Configure the workspace settings to recognize code generation configurations.

## Documentation

Detailed documentation and examples can be found at [dev.to](https://dev.to/florianrappl/getting-bundling-superpowers-using-codegen-2no8).

Additional resources are provided in the `README.md` of the respective plugin or library within this repository.

## Contributing

We welcome contributions! Please follow the steps below to get started:

1. Fork the repository.
2. Clone the repository locally.
3. Install dependencies using `npm install`.
4. Make your changes and submit a pull request - target the `develop` branch.

Please ensure that all contributions follow our [Code of Conduct](./.github/CODE_OF_CONDUCT.md) and [Contributing Guidelines](./.github/CONTRIBUTING.md).

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
