const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./wallet');

describe('TrasactionPool',()=>{
    let tp,wallet,transaction
    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();
        transaction = Transaction.newTransaction(wallet, '0xnsdsydhgywjkas', 30);
        tp.updateOrAddTransaction(transaction);
      });

      it('adds a transaction to the pool', () => {
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
      });

      it('updates the transaction in the pool',()=>{
          const previousTransaction=JSON.stringify(transaction)
          const newTransaction=transaction.update(wallet,'0xnsdsydhgywjkas',100)
          tp.updateOrAddTransaction(newTransaction)
          expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))).not.toEqual(previousTransaction)
      })
      
})

