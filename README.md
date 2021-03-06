# geovis [![npm](https://img.shields.io/npm/v/geovis.svg?style=flat-square)](https://www.npmjs.com/package/geovis)

[![Gitter](https://img.shields.io/gitter/room/nkbt/help.svg?style=flat-square)](https://gitter.im/nkbt/help)

[![CircleCI](https://img.shields.io/circleci/project/nkbt/geovis.svg?style=flat-square&label=nix-build)](https://circleci.com/gh/nkbt/geovis)
[![AppVeyor](https://img.shields.io/appveyor/ci/nkbt/geovis.svg?style=flat-square&label=win-build)](https://ci.appveyor.com/project/nkbt/geovis)
[![Coverage](https://img.shields.io/codecov/c/github/nkbt/geovis.svg?style=flat-square)](https://codecov.io/github/nkbt/geovis?branch=master)
[![Dependencies](https://img.shields.io/david/nkbt/geovis.svg?style=flat-square)](https://david-dm.org/nkbt/geovis)
[![Dev Dependencies](https://img.shields.io/david/dev/nkbt/geovis.svg?style=flat-square)](https://david-dm.org/nkbt/geovis#info=devDependencies)

React component-wrapper to swap one element with another and back, useful to show/hide popups, expand/collapse elements, various toggles, etc.

## Installation

### NPM
```sh
npm install --save @nkbt/geovis react redux react-redux three

```

Don't forget to manually install peer dependencies (`react`, `redux`, `react-redux`, `three`) if you use npm@3.


### Bower:
```sh
bower install --save https://unpkg.com/@nkbt/geovis/bower.zip
```


### 1998 Script Tag:
```html
<script src="https://unpkg.com/react/dist/react.min.js"></script>
<script src="https://unpkg.com/redux/dist/redux.min.js"></script>
<script src="https://unpkg.com/react-redux/dist/react-redux.min.js"></script>
<script src="https://unpkg.com/three/build/three.min.js"></script>
<script src="https://unpkg.com/@nkbt/geovis/build/geovis.js"></script>
(Module exposed as `GeoVis`)
```


## Demo

[http://nkbt.github.io/geovis](http://nkbt.github.io/geovis)

## Codepen demo

```js
// TODO
```

## Usage
```js
const React = require('react');
const ReactDOM = require('react-dom');
const {createStore, combineReducers} = require('redux');
const {Provider} = require('react-redux');
const {App, attacks, controls} = require('@nkbt/geovis');

const el = React.createElement;

const store = createStore(combineReducers({attacks, controls}));

const appRoot = document.createElement('div');
appRoot.id = 'app';
document.body.appendChild(appRoot);
ReactDOM.render(el(Provider, {store}, el(App)), appRoot);
```

## Options

```js
// TODO
```

## Development and testing

Currently is being developed and tested with the latest stable `Node 6` on `OSX` and `Windows`.

To run example covering all `GeoVis` features, use `npm start dev`, which will compile `src/example/Example.js`

```bash
git clone git@github.com:nkbt/geovis.git
cd geovis
npm install
npm start dev

# then
open http://localhost:8080
```

## Tests

```bash
# to run tests
npm start test

# to generate test coverage (./reports/coverage)
npm start test.cov

# to run end-to-end tests
npm start test.e2e
```

## License

MIT
