gulp-less-branding-js
======

[![NPM Version](https://img.shields.io/npm/v/gulp-less-branding-js.svg)](https://www.npmjs.com/package/gulp-less-branding-js)

Gulp plugin to convert variables defined in .less files into javascript variables for use in client-side charting libraries or anything that is hard to actually style in css.

## Installation

```
npm install gulp-less-branding-js
```

## Usage

(Incomplete)

## Example

Convert your _branding.less file...

```less
@brand-dark: #333333;

@gray-darkest: @brand-dark;
@gray-dark: lighten(@gray-darkest, 10%);
@gray: lighten(@gray-darkest, 40%);
@gray-light: lighten(@gray-darkest, 55%);
@gray-lightest: lighten(@gray-darkest, 70%);

@brand-white: #FFF;

@brand-primary: purple;
@brand-primary-lightened: mix(@brand-primary, @gray-lightest, 30%);
```

...to a _branding.js file.

```js
var brandingResource = {
    "brandDark": "#333333",
    "grayDarkest": "#333333",
    "grayDark": "#4d4d4d",
    "gray": "#999999",
    "grayLight": "#bfbfbf",
    "grayLightest": "#e5e5e5",
    "brandWhite": "#ffffff",
    "brandPrimary": "purple",
    "brandPrimaryLightened": "#c7a1c7"
};
```

Then just pipe the output into your minification/bundling workflow to be used as a global branding dictionary.

### TODO

- Better class collision detection. (All classes generated under the hood need to have a parent class to prevent variable name classes from colliding with existing classes defined in the .less file.
- An option to just output a .json file to be required into something that you're using (not sure the use case for this, but it sounds alright)
- Flesh out test cases.

## License

MIT


===

Special thanks to the guys and girls over at plus3network for giving me something to work from. https://github.com/plus3network/gulp-less
