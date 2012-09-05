
# lycheeJS (v0.5)

Web Documentation: [http://martens.ms/lycheeJS](http://martens.ms/lycheeJS)

lycheeJS is a JavaScript Game library that offers a
complete environment for prototyping and deployment
of HTML5 Canvas or WebGL based games inside the Web Browser.

Its architecture is **independent of the environment** which
means it will run on any JavaScript environment, such as
V8, Node, Spidermonkey etc. The only requirement for such a
platform is a lychee.Preloader.

If you want to support a different platform like NodeJS, you
are invited to take a look at the [lychee.Preloader API Docs](http://martens.ms/lycheeJS/docs/api-lychee-Preloader.html)
and - if you have a client-side environment - at the [lychee.Renderer API Docs](http://martens.ms/lycheeJS/docs/api-lychee-Renderer.html)


# lycheeJS-ADK (App Development Kit)

The [lycheeJS ADK](http://github.com/martensms/lycheeJS-adk)
is the underlying framework to deliver platforms natively.

The ADK allows you to cross-compile to different platforms
natively using a custom V8 based JIT runtime with OpenGL
bindings as the target environment. The equivalent environment
integration is the platform/v8gl inside the lycheeJS Game library.


# Limitations

At the time this was written (August 2012), iOS based platforms
are only deliverable natively using a WebView (WebKit) implementation,
because custom JIT runtimes are not allowed. Blame Apple for not
offering a high-performance alternative, not me.

Sound issues on iOS 5 and earlier versions are known due to Apple's
crappy implementation using iTunes in the background. These issues
are gone with iOS6+ due to the WebKitAudioContext (WebAudio API)
availability.


# Roadmap

**v0.5 (September 2012) lycheeJS-ADK**

- Completion of OpenGLSL bindings, Shader and Buffer data types
- OpenAL/OpenSL bindings
- cutting-edge freeglut integration
- Android NDK integration for V8GL and ADK shell script, using simple Java wrapper for V8GL process.


**v0.6 (October 2012) lycheeJS-ADK**

- Packaging: Debian/Ubuntu (DEB)
- Packaging: Windows Metro (via VisualStudio project)
- Packaging: Android (APK)
- Packaging: Mac OSX (APP)

**v0.6 (October 2012) lycheeJS**

- v8gl: lychee.Track and lychee.Jukebox
- v8gl: lychee.Input: Multi-Touch integration
- v8gl: lychee.Viewport: orientationchange, resize, pageshow and pagehide

**v0.7 (November 2012) lycheeJS-adk**

- Multi-Thread API, synchronized with freeglut's glut.timerFunc callstack.
- Nothing else planned (yet).

**v0.7 (November 2012) lycheeJS**

- Nothing planned (yet).


# License

The lycheeJS framework is licensed under MIT License.


# Features

I'm not a marketing guy, so I don't give a shit on
selling you stuff. it's open source, grab the demos
and grab the code, dude!


# Examples and Game Boilerplate

There is the [Game Boilerplate](http://martens.ms/lycheeJS/game/boilerplate)
and the [Jewelz Clone](http://martens.ms/lycheeJS/game/jewelz) that show you
how to develop a real cross-platform game and best practices in high-performance
JavaScript code.


The example source codes are all available at the github repository:

[Link to game folder on github](https://github.com/martensms/lycheeJS/tree/master/game)


# Documentation

The documentation is available in on the web at [http://martens.ms/lycheeJS](http://martens.ms/lycheeJS)
or at the [lycheeJS-docs github repository](https://github.com/martensms/lycheeJS-docs)

