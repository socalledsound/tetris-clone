

class Client {
    constructor(conn, id){
        this.conn = conn;
        this.session = null;
        this.id = id;
        this.state = null;
    }

    broadcast(data){
        if(!this.session){
            throw new Error('cannot broadcast without session');
        }
        data.clientId = this.id;
        this.session.clients.forEach( client => {
            if(this === client){
                return
            }
            client.send(data);
            console.log('broadcasting', data)
        })
    }


    send(data){
        const msg = JSON.stringify(data);
        console.log(`sending message: ${msg}`);
        this.conn.send(msg, (err) => {
            if(err){
                console.log('message failed', msg, err);
            }
        });
    }


}



module.exports = Client;