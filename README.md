
# lycheeJS (0.8.6)

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Gratipay][gratipay-image]][gratipay-url]

[npm-image]: https://img.shields.io/npm/v/lycheejs.svg
[npm-url]: https://npmjs.org/package/lycheejs

[downloads-image]: https://img.shields.io/npm/dm/lycheejs.svg
[downloads-url]: https://npmjs.org/package/lycheejs

[gratipay-image]: https://img.shields.io/gratipay/martensms.svg
[gratipay-url]: https://gratipay.com/martensms/


## Overview

lycheeJS is a Next-Gen Isomorphic Application Engine that
offers a complete solution for prototyping and deployment
of HTML5 or native OpenGL(ES) or libSDL2 based applications.

The project has the goal to ease up development of applications
and shipment to further platforms. The development process is
optimized for Blink-based browsers (Chromium, Google Chrome,
Opera) and their developer tools.

The [lycheeJS-runtime](https://github.com/LazerUnicorns/lycheeJS-runtime.git)
repository contains all binary pre-compiled runtimes that are
included in the bundles.

The [lycheeJS-bundle](https://github.com/LazerUnicorns/lycheeJS-bundle.git)
repository contains all scripts and logic required to generate
operating system ready packages.


## Bundle Installation

There are prebuilt bundles that ship all dependencies and
runtimes lycheeJS needs in order to work and cross-compile
properly. These bundles should be installed on the developer's
machine and not on the target platform. Visit [lycheejs.org](http://lycheejs.org)
for a list of available bundles.


## Manual Installation

The netinstall shell script allows to automatically install
lycheeJS on any machine (arm, x86 or x86\_64). The only
requirement for the script is `curl` and `unzip`.

```bash
# This will create a lycheeJS Installation in ./lycheejs
wget -q -O - http://lycheejs.org/download/lycheejs-0.8.6-netinstall.sh | bash;
```


## NPM Installation

There's an npm package available, though npm has several
conceptual issues (no multi-platform distribution,
no multi-architecture support, no binary shipment runtimes,
no cross-compilation sdks, no binary shipment of updates
possible etc.).

That's why it is *NOT* recommended as it complicates the
installation process.

Modify the `./lycheejs/package.json/scripts` section to
get integration with other parts of the node ecosystem.


```bash
npm install lycheejs;
mv node_modules/lycheejs ./lycheejs;
git clone https://github.com/LazerUnicorns/lycheeJS-runtime.git ./lycheejs/bin/runtime;

cd lycheejs;
npm run-script localhost;
```


## Roadmap

You want to see what kind of fancy features will arrive next?
Take a look at the [ROADMAP.md](ROADMAP.md) file.


## Contribution

You want to contribute to the project?
Take a look at the [CONTRIBUTING.md](CONTRIBUTING.md) file.


## License

lycheeJS is (c) 2012-2015 LazerUnicorns and released under MIT license.
The projects and demos are licensed under CC0 (public domain) license.
The runtimes are owned and copyrighted by their respective owners.

