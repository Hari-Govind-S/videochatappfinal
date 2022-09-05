var express = require('express')
const { Socket } = require('socket.io')
var app = express()
const { PeerServer } = require('peer');
const { ExpressPeerServer } = require('peer');
var port = process.env.PORT || '3000';
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.set('port', port);
app.use(express.static('public'))



app.get('/',(req,res)=>{
  res.render('index')
})
app.get('/room', (req, res) => {
 
 res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {

      socket.join(roomId)
      socket.to(roomId).emit('user-connected', userId)

  
      socket.on('disconnect', () => {
        console.log("User disconnected")
        io.emit('user-disconnected', userId)
        socket.to(roomId).emit('user-disconnected', userId)
        io.emit('exit',userId)
      })

      

  })

})

server.listen(port)