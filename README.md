_Note: proprietary materials fall under different rules, per the [LICENSE](https://github.com/code-dot-org/code-dot-org/blob/staging/LICENSE)._

## Local Setup (all platforms)

### Node.js and Grunt

You will need to first install [Node.js](http://nodejs.org/download/) and the grunt-cli: `npm install -g grunt-cli`.

### Setup Your Project

Check this project out from source:

    git clone git@github.com:code-dot-org/craft.git
    cd craft

Next, inside the project, you need to install the project's various NPM dependencies:

    npm install

And you should now be ready to spin up a development build of your new project:

    grunt
    
A browser should open with a Minecraft Hour of Code test page displayed:

![](https://i.imgur.com/vzsfoH2.png)

## Developing

All of the files required to run the game live in the `src` folder, including any javascript, images, HTML ([ejs](http://www.embeddedjs.com/) templated), and CSS. When the default `grunt` task is invoked, these files are compiled to a `build` directory.

Files in the `build` directory will always be generated and excluded from Git by the `.gitignore`, as such these will removed without warning and should generally not be edited.

### What's being used?

* [NPM](https://www.npmjs.org/) via [Browserify](http://browserify.org/), [JsHint](http://www.jshint.com/), Browserify inline [source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/), dev server with livereload (auto refresh), [.gitignore](https://github.com/serby/GitIgnore).
* ES6 via babelify

### Recommendations

* If you intend to store development assets (i.e PSD's, Texture Packer files, etc) inside your project, store them outside of the `src` directory to avoid unnecessary copying during dev builds.

### Resources for:

#### Phaser.js

* [Phaser.io Examples](http://phaser.io/examples) — lots of great example code
* [Game Mechanic Explorer](http://gamemechanicexplorer.com/) - set of game mechanic demos with Phaser source below
* [Kenney.nl assets](http://kenney.nl/assets) — public domain placeholder assets for spritesheets, backgrounds, etc.
* [Freesound](https://freesound.org/) — public domain placeholder sounds

#### Browserify

[Substack's Browserify Handbook](https://github.com/substack/browserify-handbook).

### Available Targets

#### `grunt`

Configures and runs an un-minified development build optimised for fast watch performance with source maps and live reload. Opens browser window pointing to a test page on first build.

### Updating or adding libraries

The project comes with an unminified version of Phaser with arcade physics, this can be replaced if you require updates or one of the alternate physics engines.

You can install new npm-compatible libraries with:

`npm install --save my-package-name`

Then require it in your code with e.g. `import MyCoolTimesavingLibrary from 'My-Cool-Timesaving-Library'`.

Some interesting npm libraries: list of [browserify-friendly game modules](https://github.com/hughsk/game-modules/wiki/Modules), [@substack's npm repositories](https://www.npmjs.com/~substack).

Raw vendor packages can be added to `src/test-build-only` and added directly to `src/index.html.ejs`.

If adding new libraries that aren't CommonJS compatible, you'll have to additionally update the [Browserify shim configuration](https://github.com/thlorenz/browserify-shim#3-provide-browserify-shim-config) in our `package.json`.

### Coding style

We will try to follow the [Airbnb ES6 styleguide](https://github.com/airbnb/javascript).

### Acknowledgements

Boilerplate based on the [Phaser.js grunt/browserify boilerplate](https://github.com/lukewilde/phaser-js-boilerplate/), which was based on [1](https://github.com/luizbills/phaser-js-boilerplate) and [2](https://github.com/gamecook/phaser-project-template).
