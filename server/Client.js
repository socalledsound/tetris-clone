

class Client {
    constructor(conn, id){
        this.conn = conn;
        this.session = null;
        this.id = id;
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