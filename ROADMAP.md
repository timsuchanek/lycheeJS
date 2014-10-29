
# Features Roadmap

The features listed here are not implemented.
This document shows the planned features for upcoming lycheeJS releases.
Only if all features are completed, the lycheeJS release is merged
back into master, tagged and published.


## v0.8.4

- Integration with Services (tool/linux) using systemd and upstart
- Integration with Services (tool/windows) using regedit
- Color Game (Timeout and Point Calculation)
- lychee.net.remote.Controller and lychee.net.client.Controller
- lychee.game.Logic
- lychee.game.Physic
- lychee.verlet Stack serialization and finalization

## v0.8.5

- lychee.net.Tunnel integration (event-based abstraction for Client and Remote)
- lychee.net.Protocol refactor for sending AND receiving
- html-webgl platform finalization (webgl2d refactor)
- Automatized Fuzztest suite (based on API docs)
- Blitzkrieg Game with basic tanks interaction

## v0.8.6

- Simulator for Dashboard
- Debugger for Dashboard (Remote-Debugging API UI)
- lychee.Environment needs serializable injection API
- sorbet.module.Fertilizer needs injection references (and internal cache)

## v0.8.7

- Sorbet needs major support for Content-Security-Policy
- sorbet.module.Blacklist integration with Content-Security-Policy

## v0.8.8

- port ws (*1*) project for identical API on html and nodejs
- lychee.net.Client for nodejs
- lychee.net.Protocol for nodejs (should work due to Buffer implementation in bootstrap.js)


# References (Articles and Sources)

1. [ws project](https://github.com/einaros/ws)

