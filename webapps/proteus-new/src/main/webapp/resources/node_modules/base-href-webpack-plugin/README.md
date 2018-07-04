# base-href-webpack-plugin (extension for html-webpack-plugin)

[![Dependency Status](https://gemnasium.com/badges/github.com/dzonatan/base-href-webpack-plugin.svg)](https://gemnasium.com/github.com/dzonatan/base-href-webpack-plugin)
[![npm version](https://badge.fury.io/js/base-href-webpack-plugin.svg)](https://badge.fury.io/js/base-href-webpack-plugin)
[![Build Status](https://travis-ci.org/dzonatan/base-href-webpack-plugin.svg?branch=master)](https://travis-ci.org/dzonatan/base-href-webpack-plugin)

Extension for [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin) to programmatically insert or update `<base href="" />` tag.

# Prerequisites

This plugin is an extension of [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin).  
So make sure you have installed `npm i --save-dev html-webpack-plugin`.

# Installation

For webpack v3:  
`npm i --save-dev base-href-webpack-plugin@1`

For webpack v4:  
`npm i --save-dev base-href-webpack-plugin`

# Usage

```javascript
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');

// Add to plugins
plugins: [
  new HtmlWebpackPlugin(), // Required dependency
  new BaseHrefWebpackPlugin({ baseHref: '/' })
]
```

Plugin **leaves your template untouched** if `baseHref` option is not provided.

# Contribution

Feel free to contribute to this project by submitting issues and/or pull requests.

# License

MIT
