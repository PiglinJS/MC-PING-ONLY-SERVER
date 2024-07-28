/*
MIT License

Copyright (c) 2024 PiglinJS

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
const net = require('net');

const SERVER_PORT = 25565;

const response = JSON.stringify({
  version: {
    name: "https://educatedsuddenbucket.is-a.dev/",
    protocol: 999
  },
  players: {
    max: 1,
    online: 6267,
    sample: [
      {
        name: "EducatedSuddenBucket",
        id: "00000000-0000-0000-0000-000000000000"
      }
    ]
  },
  description: {
    text: " Made By EducatedSuddenBucket Visit: https://educatedsuddenbucket.is-a.dev/"
  }
});

function writeVarInt(value) {
  let bytes = [];
  while (true) {
    let temp = value & 0b01111111;
    value >>>= 7;
    if (value != 0) {
      temp |= 0b10000000;
    }
    bytes.push(temp);
    if (value == 0) {
      break;
    }
  }
  return Buffer.from(bytes);
}

const server = net.createServer((socket) => {
  socket.once('data', () => {
    const jsonResponse = Buffer.from(response);
    const lengthPrefix = writeVarInt(jsonResponse.length);
    const packet = Buffer.concat([
      writeVarInt(0),
      lengthPrefix,
      jsonResponse
    ]);
    const fullPacket = Buffer.concat([writeVarInt(packet.length), packet]);
    
    socket.write(fullPacket, () => {
      socket.end();
    });
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
    socket.destroy();
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});
