const Wallet = require('./wallet');
const TransactionPool= require('./transaction-pool');

describe('Wallet',()=>{
    let wallet, tp;

  beforeEach(() => {
    wallet = new Wallet();
    tp = new TransactionPool();
  });
  describe('creating a transaction', () =>{
    let transaction, sendAmount, reciever;
    beforeEach(() => {
        sendAmount = 50;
        reciever = '0xsdsdsrasdsa';
        transaction = wallet.createTransaction(reciever, sendAmount, tp);
      })

      describe(' doing the same transaction with same amount', () => {
        beforeEach(() => {
          wallet.createTransaction(reciever, sendAmount, tp);
        });

        it('doubles the `sendAmount` subtracted from the wallet balance', () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
        .toEqual(wallet.balance - sendAmount*2);
        })

        it('user repeats the same transaction with same amount', () => {
            expect(transaction.outputs.filter(output => output.address === reciever)
              .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
          });



        })


  })

})