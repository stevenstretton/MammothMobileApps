# Mammoth-v2

## Overview
> Mammoth-v2 is a social web application that's intended to be used on mobile devices. Users can perform CRUD operations on trips. A trip is described as an event that 1+ people are attending within the users group (i.e. a music festival). The USP of this app is that users can track another users location (if allowed) when the trip commences so that members will never become lost/separated.

## Versioning
Mammoth-v1 was originally built with the [Ionic v1](http://ionicframework.com/) framework coupled with Angular. Since investigating that Ionic v2 offers more UI flexibility, we migrated to use Ionic v2 couple with Angular 2.<br>

This project requires:

- **Node**: 7.4.0 *(latest stable release)*
- **npm**: 4.1.1
- **Ionic**: 2.0.0
- **Cordova**: 6.5.0

To install all the above, run:

```bash
$ npm install <package>
```

## Installation
The project resides in a private repository in Bitbucket. To pull it, please use:
```bash
$ git clone git@bitbucket.org:darrylhall/mammoth-v2.git
```

When pulled, run the following:

- ```bash
  $ npm install
  ```
  *To install all dependencies in `packages.json`*
  
- ```bash
  $ ionic state reset
  ```
  *This refreshes all `cordova` plugins and is recommended*
  
- To add mobile platforms to the project, run:
  ```bash
  $ ionic platform add ios
  $ ionic platform add android
  ```
  
## Fixes
We have encountered an error with the latest webpack version that comes with ionic. The issue has been raised with the ionic team but in the mean time, there is a (far from ideal) fix:
 
In `node_modules/webpack-sources/node_modules/source-/lib/source-node.js`, please change the following lines:

- **94 & 114:** `var nextLine = remainingLines[0];` to `var nextLine = remainingLines[0] || '';` 

## Building & running
- To clean the project, run:
  ```bash
  $ npm run clean
  ```

- To build the project, run:
  ```bash
  $ npm run build
  ```
  
- The project has mainly been tested in a browser, to run it to a browser on a PC, run:
  ```bash
  $ ionic serve
  ```
  
When deploying to a device, the `--prod` or `--release` flags can be set but they are optional, for example:

```bash
$ ionic run android --prod
```
 
