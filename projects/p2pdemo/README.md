
This p2pdemo is currently only supporting nodejs
until a TCPSocket and UDPSocket can be written
natively in other platforms.

W3C sysapps WG Draft - you are welcome to contribute!

A lychee.net.Peer Service is being implemented that
will distribute DHT based Topology information.

Centralized servers will be hosted in the given
initial connection, so when you set host to "localhost"
it will assume that the Server offers the "peer"
service.


## Usage


### Start server via:

cd ~/Software/lycheeJS/projects/p2pdemo;
nodejs server.js ~/Software/lycheeJS/ 1337 localhost


### Start client via:

cd ~/Software/lycheeJS/projects/p2pdemo;
nodejs client.js ~/Software/lycheeJS/ 1337 localhost


## Notes

All your beta are belong to us. All contents of this
project are subject to change and will work only
with bleeding edge lycheeJS.

We are currently also working on integrations with cjdns
as an underlying resolution system, but this is also
subject to change.

We are currently experimenting using RSV1, RSV2, RSV3
as the service identifiers for the peers, which would
allow us to use initialization-free data packets that
we (theoretically) could broadcast.

