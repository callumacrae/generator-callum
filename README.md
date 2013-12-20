# generator-callum

The [Yeoman](http://yeoman.io/) generator written and used by Callum Macrae (callumacrae) in front-end projects.

## Usage

Clone this repository and run `npm link` inside the root directory (you may need to be root for this bit).

```bash
git clone callumacrae/generator-callum # hub* ftw
cd generator-callum
npm link
```

*[hub](https://github.com/github/hub)

Make a new directory and `cd` into it:

```bash
mkdir my-amazing-project && cd $_
```

Then run the yo command:

```bash
yo callum
```

Setup will run, magic will happen. [Grunt](gruntjs.com) plugins and [Bower](http://bower.io) packages will be automatically installed.

## License

Copyright &copy; Callum Macrae 2013
Licensed under the MIT license.