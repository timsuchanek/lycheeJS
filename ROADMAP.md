
# Features Roadmap

The features listed here are not implemented.
This document shows the planned features for upcoming lycheeJS releases.
Only if all features are completed, the lycheeJS release is merged
back into master, tagged and published.


## v0.8.5

- API: lychee.Renderer
- API: lychee.Storage

- /lychee/dist build via configure script for CDNJS and standalone deployment
- Website: Overhauling and Architecture Diagrams
- Sorbet Log File serialization (sorbet.data.LOG encode/decode that runs every 5 minutes)
- lychee.net.(client||remote).DHT as described in Bittorrent's DHT protocol [1] which extends lychee.net.(client||remote).KRPC for its codec behaviours
- Project Tool (inspects and verifies integrity of lychee.pkg files)
- Inspector Tool: Timeline State (that shows bind/trigger/unbind calls)

- lychee.net.Hybrid

- Mode7 Game finalization (lane switch), required assets: racing car, box sprite, explosion sprite
- Color Game finalization (UI, Timeout and Point Calculation)

## v0.8.6

- Dispenser CLI Tool (creates Templates and validates API Docs of a Definition)
- Blitzkrieg Game finalization (auto-connect 4 players and let them play against each other)
- lychee.net.remote.Controller and lychee.net.client.Controller
- API + Serialization: lychee.game.Logic
- API + Serialization: lychee.game.Physic
- lychee.verlet Stack serialization and finalization
- lychee.net.Protocol Ping/Pong verification
- html-webgl platform finalization (webgl2d refactor)
- Automatized Fuzztest suite (based on API docs)

## v0.8.7

- sorbet.module.Fertilizer needs injection references (and internal cache)
- Sorbet needs major support for Content-Security-Policy
- sorbet.module.Blacklist integration with Content-Security-Policy


# References (Articles and Sources)

1. [DHT Protocol Specification](http://www.bittorrent.org/beps/bep_0005.html)
2. [Mainline DHT on wikipedia](http://en.wikipedia.org/wiki/Mainline_DHT#Routing_Table)
3. [webtorrent implementation](https://github.com/feross/bittorrent-dht)

