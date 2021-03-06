const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain/Blockchain');
const HTTP_PORT = process.env.HTTP_PORT || 3001;
const P2pServer=require('./p2p-server')
const app = express();
const Wallet = require('../wallet/wallet')
const TransactionPool = require('../wallet/transaction-pool')
const Transaction = require('../wallet/transaction')
const Miner=require('./miner')


app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
const bc = new Blockchain();

const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer=new P2pServer(bc,tp);
const miner = new Miner(bc,tp,wallet,p2pServer)

app.get('/blocks', (req, res) => {
	res.json(bc.chain);
});

// app.post('/mine', (req, res) => {
//     const block = bc.addBlock(req.body.data);
    
//     console.log(`New block added: ${block.toString()}`);

//     p2pServer.syncChains();
//     res.redirect('/blocks');
//   });

app.get('/mempool', (req, res)=>{
  res.json(tp.transactions)
})

app.post('/transact', (req, res) => {
const {reciever,amount}=req.body;
const transaction = wallet.createTransaction(reciever,amount,bc,tp)
p2pServer.broadcastTransaction(transaction);
res.redirect('/mempool');

})
app.get('/public-key', (req, res)=>{
  // const balance=Transaction.getWalletBalence()
  const walletbalance =wallet.calculateBalance(bc)
  // if(walletbalance>balance)
  // balence=walletbalance;
res.json({WalletAddress:wallet.publicKey,privateKey:wallet.privateKey,balance:walletbalance});
})

app.get('/mine-transaction', (req, res)=>{
  const block=miner.mine()
  console.log(`New block added:${block.toString()}`)
  res.redirect('/blocks')
})
app.listen(HTTP_PORT, () => console.log(`Listening on port: ${HTTP_PORT}`));
p2pServer.listen();