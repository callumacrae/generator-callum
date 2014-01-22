# generator-callum [![NPM version](https://badge.fury.io/js/generator-callum.png)](http://badge.fury.io/js/generator-callum) [![Dependency Status](https://david-dm.org/callumacrae/generator-callum.png)](https://david-dm.org/callumacrae/generator-callum) [![devDependency Status](https://david-dm.org/callumacrae/generated_callum/dev-status.png)](https://david-dm.org/callumacrae/generated_callum#info=devDependencies)

The [Yeoman](http://yeoman.io/) generator written and used by Callum Macrae (callumacrae) in front-end projects. Now with added Gulp!

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

Setup will run, magic will happen. [Gulp](http://gulpjs.com/) plugins and [Bower](http://bower.io/) packages will be automatically installed.

## Stuff what this does

### On setup

On setup, this generator will do the following:

- Install useful Gulp plugins.
- Install useful Bower plugins (plus any you tell it to).
- Add files to your project that you will probably find useful (CSS, fonts, imgs, JavaScript, [LESS](http://lesscss.org/)).
- ~~If you have CasperJS installed, it will offer to install the Gulp plugin and create a testing directory.~~ Nope, returning soon!
- If you want it to, initialise a Git repo, optionally committing files created by the generator.
- If you have [hub](https://github.com/github/hub) installed, it will offer to create and push to a GitHub repository.

### When installed

The generated project by default offers the following features:

- Code validation using jshint, lesslint, and html-validation.
- JavaScript awesomeness using RequireJS and bower. ~~(run `grunt bower` or `grunt build` to add plugins to RequireJS automatically)~~ This functionality will be back.
- It'll optionally automatically add jQuery (refer to it as "jquery" in RequireJS).
- ~~A `DEBUG` constant! Debug code will be automatically removed from production.~~
- CSS awesomeness using [LESS](http://lesscss.org/).
- CSS reset using Eric Meyer's "Reset CSS" 2.0.
- Automatically compiles and minifies LESS and JavaScript when changes to files are detected.
- Uses [browser-sync](http://css-tricks.com/cross-browser-css-injection/) to sync CSS changes between browsers. Also has ghost mode activated by default, so link clicks, form changes and scroll changes are synced between browsers.
- ~~Runs your CasperJS tests for you.~~ nope lol


## To use

After installation (`yo callum`), you can start developing right away. However, you can use gulp and bower to do magic.

### Bower

[Bower](http://bower.io/) is a JavaScript package manager, and is installed by Yeoman automatically (so, you already have it installed). You can view a list of all packages [here](http://sindresorhus.com/bower-components/), or you can use `bower search`. To install a package:

```bash
bower install --save <package>
# Or:
bower install --save <package>#<version>
```

See the [bower homepage](http://bower.io/) for a list of all commands and more help.

~~More specific to this project, if `grunt watchers` is running then bower plugins will be automatically added to your RequireJS build file. Otherwise, run `grunt bower` to add them (or just manually add them to the build file).~~ BRB

### Gulp

[Gulp](http://gulpjs.com/) is a JavaScript task runner. It's like [Grunt](http://gruntjs.com/), but better. You can use the following commands to do the following tasks:

- `gulp lint` will validate your HTML, CSS, LESS and JS.
- `gulp build` will parse your LESS, but not your JS yet.
- `gulp browser-sync` will run browser-sync. Awesome.
- `gulp bower` doesn't exist, but will add bower libraries that haven't been added yet to the build file.
- `gulp` will do all of the above, plus it will watch your LESS files for changes!



## License

Copyright &copy; Callum Macrae 2013
Licensed under the MIT license.