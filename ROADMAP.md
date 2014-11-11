
# Features Roadmap

The features listed here are not implemented.
This document shows the planned features for upcoming lycheeJS releases.
Only if all features are completed, the lycheeJS release is merged
back into master, tagged and published.


## v0.8.5

- Port existing tools to standalone tools in /projects/devtools/
- Debugger Tool (that debugs errors in timelines)
- Font Tool (generates .fnt files)
- Sprite Tool (generates sprite entities and png/json files)
- Inspector Tool (that inspects snapshots of environments)
- Mode7 Game finalization (lane switch), required assets: racing car, box sprite, explosion sprite
- Color Game finalization (Timeout and Point Calculation)
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

