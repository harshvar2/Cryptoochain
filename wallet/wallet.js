const {INITIAL_BALENCE}=require('../config')
const ChainUtil=require('../chain-util')
const Transaction=require('./transaction')
const Blockchain=require('../blockchain/Blockchain')
class Wallet{

    constructor() {
        this.balance = INITIAL_BALENCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
      }
      printWalletContents() {
        return `Wallet -
        publicKey : ${this.publicKey.toString()}
        balance   : ${this.balance}`
      }
      sign(hash) {
        return this.keyPair.sign(hash)
      }

       createTransaction(reciever, amount, blockchain,transactionPool) {

        this.balance=this.calculateBalance(blockchain);
        if (amount > this.balance) {
          console.log(`Amount: ${amount}, exceeds current balance: ${this.balance}`);
          return;
      }
      let transaction = transactionPool.existingTransaction(this.publicKey);
      if (transaction) {
        transaction.update(this, reciever, amount);
      }else{
        transaction = Transaction.newTransaction(this, reciever, amount);
        transactionPool.updateOrAddTransaction(transaction);
      }
      return transaction;
    }
    calculateBalance(blockchain) {
    let transactions=[];
    let balance=this.balance;

    blockchain.chain.forEach(block=>block.data.forEach(transaction=>transactions.push(transaction)))
    
    const walletInputs=transactions.filter(transaction=>transaction.input.address===this.publicKey);
    let startTime=0;
    if(walletInputs.length>0){
    const recentInput=walletInputs.reduce(
      (prev,current)=>prev.input.timestamp>current.input.timestamp?prev:current
    )

    balance=recentInput.outputs.find(output=>output.address===this.publicKey).amount
    startTime=recentInput.input.timestamp
  }

  transactions.forEach(transaction=>{
    if(transaction.input.timestamp>startTime){
      transaction.outputs.find(output=>{
        if(output.address===this.publicKey)
        balance+=output.balance
      });
    }
  })

    


    }
    static blockchainWallet(){
      const blockchainWallet=new this();
      blockchainWallet.address = "blockchain-wallet"
      return blockchainWallet;
    }
}
module.exports =Wallet;