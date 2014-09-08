
# lycheeJS (v0.8.2)

lycheeJS is a JavaScript Game library that offers a
complete solution for prototyping and deployment
of HTML5 Canvas, WebGL or native OpenGL(ES) or libSDL2
based games inside the Web Browser or native runtimes.

The development process is optimized for Google Chrome
and its developer tools.


# Installation

### 1. Download

- Download and install the newest stable release of
NodeJS from [nodejs.org](http://nodejs.org).

- Install lycheeJS via [zip-file](https://github.com/LazerUnicorns/lycheeJS/archive/master.zip)
and extract its contents to **~/lycheeJS**.
Make sure the lycheeJS-master folder contained in the
zip-file is renamed to lycheeJS to follow up with the
tutorials.

### 2a. On Linux or Mac OSX

The port range 0-1024 is reserved for root user. It is
recommended to not run nodejs as root user in order to
prevent exploits or remote shell processes. You need
to allow nodejs to bind those ports in production to
serve port 80 successfully without getting an
**EACCESS** error.

```bash
user@box:~$ which node;
/usr/bin/node
user@box:~$ sudo setcap cap_net_bind_service=+ep /usr/bin/node;
user@box:~$ sudo getcap /usr/bin/node;
/usr/bin/node = cap_net_bind_service+ep
```

### 2b. On Windows

The port range for WebSockets are so-called Ephermal Ports,
which are deactivated on Windows by default for user processes.

You need to install the Registry Key located at **~/lycheeJS/tool/windows/ActivateEphermalPorts.reg**.
It will allow using the port range 49152-65535, which is the
recommended RFC specification.

### 3. Start Sorbet

- Navigate to the **~/lycheeJS** folder in Bash (or PowerShell)
and execute the configure script to build the lycheeJS core.

```bash
cd ~/lycheeJS;
nodejs ./tool/configure.js; # Important: current working directory is lycheeJS root folder
```

- After building the core, you are ready to go. Start Sorbet.

```bash
cd ~/lycheeJS;
npm start;

# Alternative to npm start:
# nodejs ./tool/Sorbet.js start --profile="./sorbet/profile/localhost.json";
```

- Open your Web Browserand navigate to **http://localhost:8080**
to open the lycheeJS Dashboard.

Those games show you how to develop real cross-platform games and the best practices
in high-performant JavaScript code. [Link to projects folder](./projects)


# Getting Started

**Note**: A project's server is a websocket server, no webserver.

The best way to get started is to clone the Boilerplate.

```bash
cd ~/lycheeJS/projects;
cp -R ./boilerplate ./myproject; # Replace myproject with your unique name
```

Each project has a unique identifier (e.g. /projects/boilerplate has the identifier **boilerplate**).
This identifier is used to integrate the project with:

- sorbet.net.remote.Debugger (Remote Debugger Service)
- sorbet.net.remote.Session (Remote Session Service)
- sorbet.module.Fertilizer (Continous Integration Cross-Compiler Build Service)
- sorbet.module.Server (Server Auto-Configuration Service and REST API)
- sorbet.module.Log (Project Statistics Service and REST API)

In order to integrate your project with all these capabilities and the Dashboard,
you will have to modify the game.Main's settings.client property accordingly.
A project's folder name is equivalent to its unique identifier.


```javascript
  var settings = {
    // ./projects/myproject/source/Main.js#L19
    client: '/api/server?identifier=myproject', // Replace myproject with the correct identifier
  };
```


# Documentation

The documentation is available online at [http://lycheejs.org/docs](http://lycheejs.org/docs).


# Roadmap

You want to see what kind of fancy features will arrive next?
Please take a look at the [ROADMAP.md](ROADMAP.md) file.


# Contribution

You want to contribute to the project?
Please take a look at the [CONTRIBUTING.md](CONTRIBUTING.md) file.


# Other (unsupported) JavaScript Runtimes

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


# Other (non-Sorbet) Web Server Environments

The lycheeJS architecture depends on different file types served as **application/json**.
These file types are:

- **Attachment.fnt**: Font Serialization Objects
- **lychee.env**: A Serialization Object used for [lychee.Enviroment](http://lycheejs.org/docs/api-lychee-Environment.html)
- **lychee.pkg**: A Serialization Object used for [lychee.Package](http://lycheejs.org/docs/api-lychee-Package.html)
- **lychee.store**: A Serialization Object used for [lychee.Storage](http://lycheejs.org/docs/api-lychee-Storage.html)


# License

The lycheeJS framework is licensed under MIT License.

