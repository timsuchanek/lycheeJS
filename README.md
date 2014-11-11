
# lycheeJS (v0.8.4)

[![Code Climate][climate-image]][climate-url]
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Gratipay][gratipay-image]][gratipay-url]

[climate-image]: https://codeclimate.com/github/LazerUnicorns/lycheeJS/badges/gpa.svg
[climate-url]: https://codeclimate.com/github/LazerUnicorns/lycheeJS

[npm-image]: https://img.shields.io/npm/v/lycheejs.svg
[npm-url]: https://npmjs.org/package/lycheejs

[downloads-image]: https://img.shields.io/npm/dm/lycheejs.svg
[downloads-url]: https://npmjs.org/package/lycheejs

[gratipay-image]: https://img.shields.io/gratipay/martensms.svg
[gratipay-url]: https://gratipay.com/martensms/


lycheeJS is a JavaScript Game library that offers a
complete solution for prototyping and deployment
of HTML5 Canvas, WebGL or native OpenGL(ES) or libSDL2
based games inside the Web Browser or native runtimes.

The development process is optimized for Google Chrome
and its developer tools.


## Installation

### 0. Requirements

The *client-side* lycheeJS Engine Stack is supporting
all Operating Systems that can execute JavaScript.

The *server-side* CDN, CI-, Web-, and Websocket Stack though
is only supporting Linux and Mac OSX due to sandboxing and
cross-compilation reasons. Windows also can't support SPDY
and WebSocket extensions without routing issues.

Always remember, there's no client-side and server-side
whatsoever, because all the network components can be used
on either side and peer-to-peer.

### 1. Download

- Download and install the newest stable release of
NodeJS from [nodejs.org](http://nodejs.org).

- Download lycheeJS via [zip-file](https://github.com/LazerUnicorns/lycheeJS/archive/master.zip)
and extract its contents to **~/lycheeJS**.

```bash
wget https://github.com/LazerUnicorns/lycheeJS/archive/master.zip;
unzip lycheeJS-master.zip;
mv lycheeJS-master ~/lycheeJS;
```

- Make sure the lycheeJS-master folder contained in the
zip-file is renamed to lycheeJS to follow up with the
tutorials.


### 2. Start lycheeJS Webserver (Sorbet)

- After building the core, you are ready to go. Start Sorbet.

```bash
user@box:~$          cd ~/lycheeJS;
user@box:~/lycheeJS$ nodejs ./tool/configure.js;
user@box:~/lycheeJS$ npm start;
```

- Open your Web Browser and navigate to **http://localhost:8080**
to open the lycheeJS Dashboard. You are now ready to go.

The shipped [example projects](./projects) show you best practices on how
to develop cross-platform games.


### 3. Install Fertilizers (optional)

By default, lycheeJS ships with the HTML and NodeJS Fertilizers.

If you want more cross-compilation build targets, you need to run
this command to install those from the
[lycheeJS-fertilizers repository](https://github.com/LazerUnicorns/lycheeJS-fertilizers):

```bash
user@box:~$          cd ~/lycheeJS;
user@box:~/lycheeJS$ nodejs ./tool/install-fertilizers.js
```


### 4. Deployment on a Server (optional)

lycheeJS and Sorbet can also be integrated with your root server.

- If you want to have LSB init integration, you can do so by running
the install.js script.

```bash
user@box:~$          cd ~/lycheeJS;
user@box:~/lycheeJS$ sudo ./tool/ubuntu/install.js;
```

- If you want **no** LSB init integration, you can alternatively add
an own script to the *package.json/scripts* section. Take a look
at the **localhost** or **lycheejs.org** example.

```bash
# This is identical to npm start, but will run forever
user@box:~$          cd ~/lycheeJS;
user@box:~/lycheeJS$ npm run-script localhost
```


## Getting Started

First of all, a project's server is a websocket server, not a webserver.
The best way to get started is to clone the Boilerplate.

```bash
cd ~/lycheeJS/projects;
cp -R ./boilerplate ./myproject; # Replace myproject with a unique name
```

Each project has a unique identifier (e.g. /projects/boilerplate has the
identifier **boilerplate**). A project's folder name is equivalent to
its unique identifier.

This identifier is used to integrate the project with sorbet's remote
debugging and continous integration components. In order to integrate
your project with all these capabilities and the Dashboard, you will
have to modify the game.Main's settings.client property accordingly.

```javascript
  var settings = {
    // ./projects/myproject/source/Main.js#L16
    client: '/api/server?identifier=boilerplate', // Replace boilerplate with correct identifier
  };
```

It is wise to change the identifier of the lychee.Environment
in order to find debugging reports in the remote debugger and the
lycheeJS Dashboard.

```html
  var environment = new lychee.Environment({
    // ./projects/myproject/source/index.html#L48
	id: 'boilerplate', // Replace boilerplate with correct identifier
  });
```


## Tutorials

There are plenty of tutorials available at [http://lycheejs.org/tutorials](http://lycheejs.org/tutorials).


## Documentation

The documentation is available online at [http://lycheejs.org/docs](http://lycheejs.org/docs).


## Roadmap

You want to see what kind of fancy features will arrive next?
Take a look at the [ROADMAP.md](ROADMAP.md) file.


## Contribution

You want to contribute to the project?
Take a look at the [CONTRIBUTING.md](CONTRIBUTING.md) file.


## Other (unsupported) JavaScript Runtimes

The lycheeJS architecture is independent of the environment which
means it will run on any theoretical JavaScript environment.

The only requirement for such a platform is a fully implemented
[bootstrap API](http://lycheejs.org/docs/api-bootstrap.html).

For fully supporting a client-side environment, you will also have to implement
a [lychee.Input](http://lycheejs.org/docs/api-lychee-Input.html),
a [lychee.Renderer](http://lycheejs.org/docs/api-lychee-Renderer.html),
a [lychee.Storage](http://lycheejs.org/docs/api-lychee-Storage.html),
and a [lychee.Viewport](http://lycheejs.org/docs/api-lychee-Viewport.html).

These implementations are fully optional and only necessary if you are using
them inside your Game or App.


## License

The lycheeJS framework is licensed under the MIT License.
The projects and demos are licensed under the CC0 (public domain) License.

