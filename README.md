
# lycheeJS (v0.8.6)

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Gratipay][gratipay-image]][gratipay-url]

[npm-image]: https://img.shields.io/npm/v/lycheejs.svg
[npm-url]: https://npmjs.org/package/lycheejs

[downloads-image]: https://img.shields.io/npm/dm/lycheejs.svg
[downloads-url]: https://npmjs.org/package/lycheejs

[gratipay-image]: https://img.shields.io/gratipay/martensms.svg
[gratipay-url]: https://gratipay.com/martensms/


lycheeJS is a Next-Gen Isomorphic Application Engine that
offers a complete solution for prototyping and deployment
of HTML5 or native OpenGL(ES) or libSDL2 based applications.

The development process is optimized for Blink-based browsers
(Chromium, Google Chrome, Opera) and their developer tools.


## Automatic Installation

There are prebuilt packages that ship all dependencies and
runtimes lycheeJS needs in order to work and cross-compile
properly.

Take a look at [lycheejs.org](http://lycheejs.org) for a list
of available packages for your your operating system.


## Manual Installation

The netinstall shell script allows to automatically install
lycheeJS on any server.

If you want to install lycheejs in that way, you can simply
execute this in the Terminal:

```bash
# This will create a folder ./lycheeJS
wget -q -O - http://lycheejs.org/dist/lycheejs-v0.8.6.sh | bash;
./lycheeJS/bin/sorbet.sh start development;
```


#### NPM / NodeJS Integration

You can modify the **~/lycheeJS/package.json**/*scripts* section to
use your own sorbet profile. Take a look at the examples *localhost*
or *lycheejs.org*.

```bash
cd ~/Development/lycheeJS;
npm run-script localhost;
```


## Documentation

The documentation is available online at
[http://lycheejs.org/documentation/index.html](http://lycheejs.org/documentation/index.html).


## Roadmap

You want to see what kind of fancy features will arrive next?
Take a look at the [ROADMAP.md](ROADMAP.md) file.


## Contribution

You want to contribute to the project?
Take a look at the [CONTRIBUTING.md](CONTRIBUTING.md) file.


## Other (unsupported) JavaScript Runtimes

The lycheeJS architecture is independent of the environment which
means it will run in any theoretical JavaScript runtime.

The only requirement for such a platform is a fully implemented
[bootstrap API](http://lycheejs.org/documentation/bootstrap.html).

For fully supporting a client-side environment, you will also have to implement
a [lychee.Input](http://lycheejs.org/documentation/lychee-Input.html),
a [lychee.Renderer](http://lycheejs.org/documentation/lychee-Renderer.html),
a [lychee.Storage](http://lycheejs.org/documentation/lychee-Storage.html),
and a [lychee.Viewport](http://lycheejs.org/documentation/lychee-Viewport.html).

These implementations are fully optional and only necessary if you are using
them inside your Game or Application.


## License

lycheeJS is (c) 2012-2015 LazerUnicorns and released under MIT license.
The projects and demos are licensed under CC0 (public domain) license.
The runtimes are owned and copyrighted by their respective owners.

