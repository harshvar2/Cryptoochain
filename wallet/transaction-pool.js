const Transaction = require('./transaction');
const {MINING_REWARD}=require('../config')


class TransactionPool{
    constructor(){
        this.transactions=[]
    }

    updateOrAddTransaction(transaction){
        if(transaction!=undefined){
        let transactionWithId = this.transactions.find(t => t.id === transaction.id);
        //add or update transaction if not in pool
        if (transactionWithId) {
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
          } else {
            this.transactions.push(transaction);
          }
        }
    }

     existingTransaction(address){
        return this.transactions.find(transaction => transaction.input.address === address);
    }
    validTransactions(){
        return this.transactions.filter(transaction => {
            const outputTotal = transaction.outputs.reduce((total,output)=>{
                return total+output.amount;
            },0)
            if(transaction.input.amount!==outputTotal+MINING_REWARD){
                console.log(`Invalid transaction from ${transaction.input.address}.`)
                return;
            }
            if (!Transaction.verifyTransaction(transaction)) {
                console.log(`Invalid signature from ${transaction.input.address}.`)
                return;
              };
              return transaction;
        })

    }

    clear(){
        this.transactions=[]
    }


}

module.exports=TransactionPool