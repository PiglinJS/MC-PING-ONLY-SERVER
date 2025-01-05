/*
MIT License

Copyright (c) 2024 EducatedSuddenBucket

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const dgram = require('dgram');

const SERVER_PORT = 19132;
const SERVER_NAME = "This is a non-joinable Bedrock server";
const VERSION = "99.9";
const PROTOCOL = 999;
const MOTD = "This is a non-joinable Bedrock server";
const MAX_PLAYERS = 999;
const CURRENT_PLAYERS = 1;
const WORLD_NAME = "EducatedSuddenBucket";
const GAME_MODE = "Survival";
const CHEATS_DISABLED = 1;
const IPV4_PORT = 19132;
const IPV6_PORT = 19133;
const SERVER_ID = "266573783837372727272728281881";

const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
  const magic = Buffer.from('00ffff00fefefefefdfdfdfd12345678', 'hex');

  // Verify if it's a Minecraft discovery ping
  if (msg.indexOf(magic) !== -1) {
    const response = Buffer.from(
      [
        0x1c, // Packet ID for an unconnected pong
        ...Buffer.alloc(8, 0xff), // Random server ID
        ...Buffer.alloc(8, 0xff), // Client timestamp echoed back
        ...magic,
        // Server response in the correct format
        ...Buffer.from(
          `MCPE;${SERVER_NAME};${PROTOCOL};${VERSION};${CURRENT_PLAYERS};${MAX_PLAYERS};${SERVER_ID};${WORLD_NAME};${GAME_MODE};${CHEATS_DISABLED};${IPV4_PORT};${IPV6_PORT};0`,
          'utf8'
        ),
      ]
    );

    server.send(response, 0, response.length, rinfo.port, rinfo.address, (err) => {
      if (err) console.error('Error sending response:', err);
    });
  }
});

server.on('error', (err) => {
  console.error('Server error:', err);
  server.close();
});

server.on('listening', () => {
  const address = server.address();
  console.log(`Server running at ${address.address}:${address.port}`);
});

server.bind(SERVER_PORT);
