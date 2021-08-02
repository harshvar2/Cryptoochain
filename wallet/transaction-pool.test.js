const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./wallet');
const Blockchain = require('../blockchain/Blockchain')

describe('TrasactionPool',()=>{
    let tp,wallet,transaction
    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();
       bc=new Blockchain();
        // transaction = Transaction.newTransaction(wallet, '0xnsdsydhgywjkas', 30);
        // tp.updateOrAddTransaction(transaction);
        transaction = wallet.createTransaction('0xnsdsydhgywjkas', 30,bc, tp);
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


      describe('mixing valid and corrupt transactions', () => {
        let validTransactions;
        beforeEach(() => {
          validTransactions = [...tp.transactions];
          for (let i=0; i<6; i++) {
            wallet = new Wallet();
            transaction = wallet.createTransaction('0xnsdsydhgywjkas', 30,bc, tp);
            if (i%2==0) {
              transaction.input.amount = 9999;
            } else {
              validTransactions.push(transaction);
            }
          }
        });
        it('shows a difference between valid and corrupt transactions', () => {
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
          });
        
          it('grabs invalid transactions', () => {
            expect(tp.validTransactions()).not.toEqual(validTransactions);
          });
        })
        it('clears tranasction pool', () =>
        {   tp.clear();
            expect(tp.transactions).toEqual([]);
        })
})

