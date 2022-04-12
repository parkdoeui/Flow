const DEFAULT_GRID = 16;

const sqlite3 = require('sqlite3').verbose()
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

server.listen(process.env.PORT || 3001, () => {
  console.log("SERVER RUNNING");
});

const db = new sqlite3.Database('db.sqlite3')

const createTables = () => {
  db.run('CREATE TABLE IF NOT EXISTS objects (position STRING, id STRING, content STRING, config STRING)', (err, rows) => {
    db.run('CREATE UNIQUE INDEX IF NOT EXISTS unique_id ON objects (id)')
    for (let y = 0; y < DEFAULT_GRID; y++) {
      for (let x = 0; x < DEFAULT_GRID; x++) {
        db.run(`
      INSERT OR REPLACE INTO objects (id, position, content, config)
            VALUES ('grid-${x + y * DEFAULT_GRID}', '${x},${y}', NULL, NULL)
      `)
      }
    }
  })


}

db.get(`SELECT * FROM sqlite_master WHERE type='table'`, (err, rows) => {
  if (!rows) {
    createTables()
  }
})

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_HOST || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`connected: ${socket.id}`);

  socket.on('get_grid', (callback = null) => {
    try {
      const query = 'SELECT * FROM objects'
      db.serialize(() => {
        db.all(query, (err, rows) => {
          const formattedRows = rows.sort((a,b) => parseInt(a.id.split("-")[1]) - parseInt(b.id.split("-")[1])).map(el => ({...el, config: JSON.parse(el.config)}))
          io.emit('subscribe_grid', formattedRows)
          if (callback) {
            callback(formattedRows)
          }
        })
      })

    }
    catch (e) {
      callback(null)
    }
  })

  socket.on('set_grid', (payload) => {
    const { id, position, content, config } = payload

    if (content === 'start' || content === 'end') {
      db.run(`UPDATE objects SET content=NULL, config=NULL WHERE content='${content}'`)
    }

    db.run(`
    INSERT OR REPLACE INTO objects (id, position, content, config)
    VALUES ('${id}', '${position}', '${content}', '${JSON.stringify(config)}')
    `)
  })

  socket.on('delete_grid', (payload) => {
    const { id } = payload
    db.run(`UPDATE objects SET content=NULL, config=NULL WHERE id='${id}'`)
  })

  socket.on('update_grid_config', (payload) => {
    const { id, config } = payload
    db.run(`UPDATE objects
    SET config='${JSON.stringify(config)}'
    WHERE id='${id}'`)
  })

  socket.on('reset_grid', () => {
    db.run('UPDATE objects SET content=NULL, config=NULL')
  })

  socket.on('send_timestamp', (timestamp) => {
    socket.emit('get_timestamp', timestamp)
  })

});
