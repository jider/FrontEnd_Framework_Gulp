# FrontEnd Gulp Framework

This is a template to start your own project that uses Gulp and libsass!

## Requirements

You'll need to have the following items installed before continuing.

  * [Node.js](http://nodejs.org): Use the installer provided on the NodeJS website.
  * [Gulp](http://gulpjs.com/): Run `[sudo] npm install -g gulp`
  * [Bower](http://bower.io): Run `[sudo] npm install -g bower`

## Quickstart

```bash
git clone https://github.com/jider/FrontEnd_Framework_Gulp
npm install
```

While you're working on your project, run:

`gulp`

And you're set!

## Directory Structure
  ```
    ├── src/
    │   ├── Framework
    │   ├── dist
    │   ├── lib
    │   ├── sites
  ```

  * `node_modules`: Node dependencies specified in **package.json**
  * `bower_components`: Bower dependencies specified in **bower.json**
  * `gulp`: Gulp tasks used in the project.
  * `src`: Source folder.
  * `scss/_settings.scss`: Foundation configuration settings go in here.
  * `scss/app.scss`: Application styles go here.