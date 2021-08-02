const Wallet = require('./wallet');
const TransactionPool= require('./transaction-pool');
const Blockchain= require('../blockchain/blockchain');
const INITIAL_BALENCE= require('../config')

describe('Wallet',()=>{
    let wallet, tp;

  beforeEach(() => {
    wallet = new Wallet();
    tp = new TransactionPool();
    bc=new Blockchain();
  });
  describe('creating a transaction', () =>{
    let transaction, sendAmount, reciever;
    beforeEach(() => {
        sendAmount = 50;
        reciever = '0xsdsdsrasdsa';
        transaction = wallet.createTransaction(reciever, sendAmount,bc, tp);
      })

      describe(' doing the same transaction with same amount', () => {
        beforeEach(() => {
          wallet.createTransaction(reciever, sendAmount,bc, tp);
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

        // describe('calculating the balence',()=>{
        //     let addBalance ,repeatAdd,senderWallet;
        //     beforeEach(() => {
        //         senderWallet =new Wallet();
        //         addBalance =100;
        //         repeatAdd=3
        //         for(let i=0; i<repeatAdd;i++){
        //             senderWallet.createTransaction(wallet.publicKey,addBalance,bc,tp)
        //         }
        //         bc.addBlock(tp.transactions)

        //     })

        //     // it('calculates the balence for blockchain transactions for reciever', () => {
        //     //     expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALENCE+(addBalance*repeatAdd))
        //     // })
        //     // it('calculates the balence for blockchain transactions for sender',()=>{
        //     //     expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALENCE-(addBalance*repeatAdd))
        //     // })
        // })


  })

})