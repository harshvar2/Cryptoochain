const Websocket=require("ws")
const Wallet = require('../wallet/wallet')
const TransactionPool = require('../wallet/transaction-pool')
const P2P_PORT=process.env.P2P_PORT||5001;
const peers=process.env.PEERS?process.env.PEERS.split(','):[];
const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  clear_transactions: 'CLEAR_TRANSACTIONS',
 };


class P2pServer{
constructor(blockchain,transactionPool){
    
    this.blockchain=blockchain;
    this.sockets=[];
    this.transactionPool=transactionPool;

}
//Starting the server
listen() {
    const server = new Websocket.Server({ port: P2P_PORT });
    server.on('connection', socket => this.connectSocket(socket));

    this.connectToPeers();



    console.log(`Listening for peer to peer connections on :${P2P_PORT}`)
  }

connectToPeers(){
    peers.forEach(peer => {
        const socket=new Websocket(peer)
        socket.on('open',()=>{
            this.connectSocket(socket)
        })
    })
}

connectSocket(socket){
    this.sockets.push(socket);
    console.log("Socket Connected Succesfyully")
    
    this.messageHandler(socket);
    this.sendChain(socket);
   
}
messageHandler(socket) {
	socket.on('message', message => {
    const data = JSON.parse(message);
    switch(data.type) {
      case MESSAGE_TYPES.chain:
        this.blockchain.replaceChain(data.chain);
        break;
      case MESSAGE_TYPES.transaction:
        this.transactionPool.updateOrAddTransaction(data.transaction);
        break;
        case MESSAGE_TYPES.clear_transactions:
          this.transactionPool.clear();
          break;
    }

  })
}
sendChain(socket){
    socket.send(JSON.stringify({type:MESSAGE_TYPES,chain:this.blockchain.chain}))
}
syncChains() {
    this.sockets.forEach(socket => {
      this.sockets.forEach(socket => this.sendChain(socket));
    }); 
  }
broadcastTransaction(transaction){
  this.sockets.forEach(socket => this.sendTransaction(socket,transaction));
}
sendTransaction(socket,transaction){
  socket.send(JSON.stringify({type:MESSAGE_TYPES.transaction,transaction}))
}
broadcastClearTransaction(){
  this.sockets.forEach(socket => socket.send(JSON.stringify({type:MESSAGE_TYPE.clear_transactions})));

}

}
module.exports = P2pServer;