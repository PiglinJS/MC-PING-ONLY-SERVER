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
