const Wallet= require('../wallet/wallet')
const Transaction= require('../wallet/transaction')
class Miner{
    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
      }
      mine(){
        const validTransactions = this.transactionPool.validTransactions();
        validTransactions.push(Transaction.rewardTransaction(this.wallet,Wallet.blockchainWallet()))

        //Create block with valid transactions
        const block=this.blockchain.addBlock(validTransactions)
        this.p2pServer.syncChains()
        this.transactionPool.clear()
        //broadcast the transction pool to every miner
        this.p2pServer.broadcastClearTransaction()
        return block;
      }
}
module.exports = Miner;