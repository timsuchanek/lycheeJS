
# Features Roadmap

The features listed here are not implemented.
This document shows the planned features for upcoming lycheeJS releases.
Only if all features are completed, the lycheeJS release is merged
back into master, tagged and published.


## v0.8.4

- API Tool (documents API of Definitions)
- Package Tool (inspects and verifies integrity of lychee.pkg files)
- Sprite Tool (creates Sprite.png, Sprite.json and Sprite.js)


## v0.8.5
- Inspector Tool: Timeline State (that shows bind/trigger/unbind calls)
- Mode7 Game finalization (lane switch), required assets: racing car, box sprite, explosion sprite
- Color Game finalization (UI, Timeout and Point Calculation)
- lychee.Environment needs serializable injection API

## v0.8.6

- Blitzkrieg Game finalization (auto-connect 4 players and let them play against each other)
- lychee.net.remote.Controller and lychee.net.client.Controller
- lychee.game.Logic
- lychee.game.Physic
- lychee.verlet Stack serialization and finalization
- lychee.net.Tunnel integration (event-based abstraction for Client and Remote)
- lychee.net.Protocol refactor for sending AND receiving
- html-webgl platform finalization (webgl2d refactor)
- Automatized Fuzztest suite (based on API docs)

## v0.8.7

- sorbet.module.Fertilizer needs injection references (and internal cache)
- Sorbet needs major support for Content-Security-Policy
- sorbet.module.Blacklist integration with Content-Security-Policy

## v0.8.8

- port ws (*1*) project for identical API on html and nodejs
- lychee.net.Client for nodejs
- lychee.net.Protocol for nodejs (should work due to Buffer implementation in bootstrap.js)


# References (Articles and Sources)

1. [ws project](https://github.com/einaros/ws)

