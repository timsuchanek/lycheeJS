
# Features Roadmap

The features listed here are not implemented.
This document shows the planned features for upcoming lycheeJS releases.
Only if all features are completed, the lycheeJS release is merged
back into master, tagged and published.


## v0.8.5


- sorbet.plugin.Fertilizer should auto-build environments for all projects
- sorbet.serve.api.Project for details of each project (Ranger API)
- API: lychee.Renderer
- API: lychee.Storage
- API: lychee.data Stack
- Fertilizer: html-nwjs for Linux, Mac OSX and Windows
- Website: Overhauling and game.Main Architecture Diagram
- Website: Refactor tool/configure.js script to generate API docs properly
- Website: Refactor tool/configure.js script to generate Tutorials properly

## v0.8.6

- /lychee/dist build via configure script for CDNJS and standalone deployment
- Sorbet Log File serialization (sorbet.data.LOG encode/decode that runs every 5 minutes)
- lychee.net.(client||remote).DHT as described in Bittorrent's DHT protocol [1] which extends lychee.net.(client||remote).KRPC for its codec behaviours
- Project Tool (inspects and verifies integrity of lychee.pkg files)
- Mode7 Game finalization (lane switch), required assets: racing car, box sprite, explosion sprite
- LethalMaze Game finalization (multiplayer)
- API + Implementation: lychee.net.Hybrid
- API: lychee.game Stack
- API: lychee.ui Stack

## v0.8.7

- Inspector Tool: Timeline State (that shows bind/trigger/unbind calls)
- Dispenser CLI Tool (creates Templates and validates API Docs of a Definition)
- lychee.net.remote.Controller and lychee.net.client.Controller
- API + Implementation: lychee.game.Logic
- API + Implementation: lychee.game.Physic
- API + Major Refactor: lychee.verlet Stack
- Fertilizer: html-webgl Refactor (webgl2d refactor)
- Fertilizer: html-cordova for Android, iOS and Blackberry

## v0.8.8

- Sorbet needs major support for Content-Security-Policy
- sorbet.module.Blacklist integration with Content-Security-Policy

## Backlog

- Blitzkrieg Game finalization (auto-connect 4 players and let them play against each other)
- API + Implementation: lychee.data.BSON
- API + Implementation: lychee.data.MSGPACK


## References (Articles and Sources)

1. [DHT Protocol Specification](http://www.bittorrent.org/beps/bep_0005.html)
2. [Mainline DHT on wikipedia](http://en.wikipedia.org/wiki/Mainline_DHT#Routing_Table)
3. [webtorrent implementation](https://github.com/feross/bittorrent-dht)
4. [chrome app websocket server](https://github.com/GoogleChrome/chrome-app-samples/tree/master/samples/websocket-server)

