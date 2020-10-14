const WebSocketServer = require('ws').Server;
const Session = require('./Session');
const Client = require('./Client');
const server = new WebSocketServer({ port: 9000});

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
                clients: clients.map(client => client.id),
            }
        })
    })
}

function getSession(id){
    return sessions.get(id);
}

server.on('connection', connection => {
    
    console.log('connection established');
    const client = createClient(connection);

    connection.on('message', msg => {

        const data = JSON.parse(msg);
        
        if(data.type === 'create-session'){
            const id = createId();
            const session = createSession();
            session.join(client);
            client.send({
                type: 'session-created',
                id: session.id
            });
        } else if(data.type === 'join-session'){
            const session = getSession(data.id) || createSession(data.id);
            session.join(client);
            broadcastSession(session);
        }
        console.log('sessions:', sessions);
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

