const express = require('express');
const WebSocketServer = require('ws').Server;
const Session = require('./server/Session');
const Client = require('./server/Client');


const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

  const wss = new WebSocketServer(server);

const sessions = new Map;

function createId(len = 6, chars = 'abcdefghjklmnopqrstuwxyz0123456789'){
    let id = '';
    while(len--){
        id+=chars[Math.random() * chars.length | 0];
    }
    return id
}

function createClient(conn, id = createId()){
    return new Client(conn, id);
}

function createSession(id = createId()){
    if(sessions.has(id)){
        throw new Error(`session ${id} already exists`);
    }
    const session = new Session(id);
    console.log('creating session ', session);
    sessions.set(id, session);
    return session;
}

function broadcastSession(session){
    const clients = [...session.clients];
    clients.forEach( client => {
        client.send({
            type: 'session-broadcast',
            peers: {
                you: client.id,
                clients: clients.map(client => {
                    return { 
                            id: client.id, 
                            state: client.state, 
                        }
                }),
            }
        })
    })
}

function getSession(id){
    return sessions.get(id);
}

wss.on('connection', connection => {
    
    console.log('connection established');
    const client = createClient(connection);

    connection.on('message', msg => {
        console.log(msg, 'in server main');
        const data = JSON.parse(msg);
        
        if(data.type === 'create-session'){
            const id = createId();
            const session = createSession();
            session.join(client);
            client.state = data.state;
            client.send({
                type: 'session-created',
                id: session.id,
            });
        } else if(data.type === 'join-session'){
            const session = getSession(data.id) || createSession(data.id);
            session.join(client);
            client.state = data.state;
            broadcastSession(session);
        } else if(data.type === 'state-update'){
            const [prop, value] = data.state;
            client.state[data.fragment][prop] = value;
            client.broadcast(data);
        }
       
    })

    connection.on('close', () => {
        console.log('connection closed')
        const session = client.session;
        if(session){
            session.leave(client);
            if(session.clients.size === 0){
                sessions.delete(session.id);
            }
        }
        broadcastSession(session);
    })
})

