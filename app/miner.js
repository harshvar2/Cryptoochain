const Wallet= require('../wallet/wallet')
const Transaction= require('../wallet/transaction')
const {MINING_REWARD}=require('../config')
class Miner{
    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
      }
      mine(){
        const validTransactions = this.transactionPool.validTransactions();
        validTransactions.push(Transaction.rewardTransaction(this.wallet,Wallet.blockchainWallet(MINING_REWARD)))

        //Create block with valid transactions
        const block=this.blockchain.addBlock(validTransactions)
        //sync chains to p2p sever
        this.p2pServer.syncChains()
        //clear transactionPool after sending transactions to blockchain
        this.transactionPool.clear()
        //broadcast to clear transction pool to every miner
        this.p2pServer.broadcastClearTransaction()
        return block;
      }
}
module.exports = Miner;