# CRM Client 0.0.1

Client portion of wreetcos CRM

## Requirements

You'll need the following software installed to get started.

  - [Node.js](http://nodejs.org): Use the installer for your OS.
  - [Git](http://git-scm.com/downloads): Use the installer for your OS.
    - Windows users can also try [Git for Windows](http://git-for-windows.github.io/).
  - [Gulp](http://gulpjs.com/) and [Bower](http://bower.io): Run `npm install -g gulp bower`
    - Depending on how Node is configured on your machine, you may need to run `sudo npm install -g gulp bower` instead, if you get an error with the 
first command.

## Get Started

Clone this repository, where `app` is the name of your app.

```bash
git clone https://github.com/wreetco/crm-client.git app
```

Change into the directory.

```bash
cd app
```

Install the dependencies. If you're running Mac OS or Linux, you may need to run `sudo npm install` instead, depending on how your machine is 
configured.

```bash
npm install
bower install
```

## Run the app

Now run the client (*Before the first time you run this you should run 'gulp styles' and 'gulp scripts')

```bash
gulp run
```

## Compile materialize sass and js after changes

Compile sass changes.

```bash
gulp styles
```

Compile js changes.

```bash
gulp scripts
```

## Resources and Docs for stuff used

Angular NVD3 - https://krispo.github.io/angular-nvd3/#/quickstart

Materialize - http://materializecss.com/
