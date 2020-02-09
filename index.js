const express = require('express')
const app = express()
const http = require('http').createServer(app)
const PORT = process.env.PORT || 3000

const ws = require('ws')
const wss = new ws.Server({ server: http })

app.use('/', express.static('dist'))

http.listen(PORT, () => {
    console.log('http://localhost:' + PORT)
    console.log('ws://localhost:' + PORT)
})

// WebSocket
const selections = [
    {
        name: '良いね',
        count: 0
    },
    {
        name: 'ダメだね',
        count: 0
    }
]

wss.on('connection', socket => {
    console.log('connection')

    socket.on('message', message => {
        console.log(message)
        const obj = JSON.parse(message)
        const type = obj.message
        const data = obj.data

        if (type === 'post') {
            selections[data.id].count++
        }

        wss.clients.forEach(client => {
            client.send(JSON.stringify(
                {
                    message: 'selections',
                    data: selections
                }
            ))
        })
    })

    socket.send(JSON.stringify(
        {
            message: 'selections',
            data: selections
        }
    ))
})
