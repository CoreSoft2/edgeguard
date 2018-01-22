# Edgeguard

This repo contains the javascript code for edgeguard, and some accompanying
testing material.

## Description

Edgeguard attempts to capture all data that might be exflitrated from a web
application using client-side attacks. This includes XSS and certain types
of malware. This is done using the following techniques:

##### Script validation

Other scripts are loaded via edgeguard, and are fingerprinted on load. This
allows you to see if the same scripts are being loaded each time.
See:
- `src/entry-point.js`

##### Existing code detection

Edgeguard is designed to operate as the first piece of javascript executed on
the page. It contains methods to detect whether this has been circumvented by
looking for other scripts, and checking for delayed operation using timers. It
also checks to see whether certain browser builtins have been overridden. See:

- `src/detectives/altered-builtins.js`
- `src/detectives/timers.js`

##### Overriding builtins

Edgeguard overrides builtin browser primitives that might be used to exfiltrate
data, e.g. XHR, Websockets. See:

- `src/overrides/ws-override.js`
- `src/overrides/xhr-override.js`

##### DOM Watcher

Edgeguard scrapes the DOM initially to check the values of potentially dangerous
attributes. It also watches the DOM for subsequent changes to see whether these
attributes are changed dynamically after the page has loaded. See:

- `src/content-scraper.js`
- `src/element-creation-watcher.js`
- `src/element-attribute-watcher.js`

## Building

The build process uses grunt as a task runner. The standard build pipeline will
compile all the source code into a single source file to be referenced by the
application, and a snippet which should be inserted into the html of every page
in the application. If you already have node/npm/grunt installed, the following
commands should be sufficient to build the project:

    npm install
    grunt build

## Usage

Copy the code in `build/snippet.compiled.js` into a script tag in your html. This
should be the first element in the `<head>` of your html. Each additional script
tag in the document should then use `vsrc` instead of the standard `src` attribute.
This will allow the file to be loaded and fingerprinted by edgeguard. Note that
the default behaviour of edgeguard is to load all the scripts asynchronously, but
it executes them in the order in which they appear in the markup.

## Configuration

Most of the configuration options are in `src/globals.js`. The following are the
most important values to change:

- `endpoint`: where to send the edgeguard audit data to.
- `proto`: protocol to use for this purpose (include a colon at the end, e.g. `http:`)
