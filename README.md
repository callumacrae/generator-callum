# generator-callum [![NPM version](https://badge.fury.io/js/generator-callum.png)](http://badge.fury.io/js/generator-callum) [![Dependency Status](https://david-dm.org/callumacrae/generator-callum.png)](https://david-dm.org/callumacrae/generator-callum) [![devDependency Status](https://david-dm.org/callumacrae/generated_callum/dev-status.png)](https://david-dm.org/callumacrae/generated_callum#info=devDependencies) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

The [Yeoman](http://yeoman.io/) generator written and used by Callum Macrae (callumacrae) in front-end projects.

## Usage

To install, globally install the npm package (you may need to use sudo):

```bash
npm install -g generator-callum
```

Make a new directory and `cd` into it:

```bash
mkdir my-amazing-project && cd $_
```

Then run the yo command:

```bash
yo callum
```

Setup will run, magic will happen. [Grunt](http://gruntjs.com/) plugins and [Bower](http://bower.io/) packages will be automatically installed.

## Stuff what this does

### On setup

On setup, this generator will do the following:

- Install useful Grunt plugins.
- Install useful Bower plugins (plus any you tell it to).
- Add files to your project that you will probably find useful (CSS, fonts, imgs, JavaScript, [LESS](http://lesscss.org/)).
- If you have CasperJS installed, it will offer to install the Grunt plugin and create a testing directory.
- If you want it to, initialise a Git repo, optionally committing files created by the generator.
- If you have [hub](https://github.com/github/hub) installed, it will offer to create and push to a GitHub repository.

### When installed

The generated project by default offers the following features:

- Code validation using jshint, lesslint, and html-validation.
- JavaScript awesomeness using RequireJS and bower (run `grunt bower` or `grunt build` to add plugins to RequireJS automatically).
- It'll optionally automatically add jQuery (refer to it as "jquery" in RequireJS).
- A `DEBUG` constant! Debug code will be automatically removed from production.
- CSS awesomeness using [LESS](http://lesscss.org/).
- CSS reset using Eric Meyer's "Reset CSS" 2.0.
- Automatically compiles and minifies LESS and JavaScript when changes to files are detected.
- Uses [browser-sync](http://css-tricks.com/cross-browser-css-injection/) to sync CSS changes between browsers. Also has ghost mode activated by default, so link clicks, form changes and scroll changes are synced between browsers.
- Runs your CasperJS tests for you.


## To use

After installation (`yo callum`), you can start developing right away. However, you can use grunt and bower to do magic.

### Bower

[Bower](http://bower.io/) is a JavaScript package manager, and is installed by Yeoman automatically (so, you already have it installed). You can view a list of all packages [here](http://sindresorhus.com/bower-components/), or you can use `bower search`. To install a package:

```bash
bower install --save <package>
# Or:
bower install --save <package>#<version>
```

See the [bower homepage](http://bower.io/) for a list of all commands and more help.

More specific to this project, if `grunt watchers` is running then bower plugins will be automatically added to your RequireJS build file. Otherwise, run `grunt bower` to add them (or just manually add them to the build file).

### Grunt

[Grunt](http://gruntjs.com/) is a JavaScript task runner. You can use the following commands to do the following tasks:

- `grunt validate` will run jshint, lesslint, and html-validation.
- `grunt build` will run validate (as seen above), generate the bower build file, minify the RequireJS files, and parse and minify the LESS files.
- `grunt watchers` will run the watchers, so that if you add a bower library it will be added to the project, or if you change a JavaScript or LESS file, they will be parsed and minified. It also runs `browser-sync` (which is slightly useless when file changes aren't being applied to the website).
- `grunt bower` will add bower libraries that haven't been added yet to the build file. This is useful if the libraries were added when the watchers weren't running when you ran `bower install`.
- `grunt test` will run CasperJS tests.
- Just `grunt` will run `grunt build`, and then `grunt watchers`.

If you run `grunt build`, debug will be set to off, and `DEBUG` code will be removed and code minified. If you run `grunt`, it is slightly different when it calls `grunt build` in that debug will be set to on, and `DEBUG` will be set to true. Code won't be minified, either.



## License

Copyright &copy; Callum Macrae 2013
Licensed under the MIT license.