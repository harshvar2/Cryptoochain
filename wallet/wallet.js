const {INITIAL_BALENCE}=require('../config')
const ChainUtil=require('../chain-util')
const Transaction=require('./transaction')
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

       createTransaction(reciever, amount, transactionPool) {
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
    static blockchainWallet(){
      const blockchainWallet=new this();
      blockchainWallet.address = "blockchain-wallet"
      return blockchainWallet;
    }
}
module.exports =Wallet;