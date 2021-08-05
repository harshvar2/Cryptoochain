const Wallet = require('./wallet');
const TransactionPool= require('./transaction-pool');
const Blockchain= require('../blockchain/blockchain');
const {INITIAL_BALENCE,MINING_REWARD}= require('../config')

describe('Wallet',()=>{
    let wallet, tp,bc;

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
        .toEqual((wallet.balance - sendAmount*2)-MINING_REWARD);
        })

        it('user repeats the same transaction with same amount', () => {
            expect(transaction.outputs.filter(output => output.address === reciever)
              .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
          });



        })

        describe('calculating the balence',()=>{
            let addBalance ,repeatAdd,senderWallet;
            beforeEach(() => {
                senderWallet =new Wallet();
                addBalance =100;
                repeatAdd=3
                for(let i=0; i<repeatAdd;i++){
                    senderWallet.createTransaction(wallet.publicKey,addBalance,bc,tp)
                }
                bc.addBlock(tp.transactions)

            })

            it('calculates the balence for blockchain transactions for reciever', () => {
                expect(wallet.calculateBalance(bc)+50).toEqual(INITIAL_BALENCE+(addBalance*repeatAdd)-MINING_REWARD)
            })
            it('calculates the balence for blockchain transactions for sender',()=>{
                expect((senderWallet.calculateBalance(bc))).toEqual(INITIAL_BALENCE-(addBalance*repeatAdd)-MINING_REWARD)
            })

            describe('and the recipient conducts a transaction', () => {
              let subtractBalance, recipientBalance;
        
              beforeEach(() => {
                tp.clear();
                subtractBalance = 60;
                recipientBalance = wallet.calculateBalance(bc);
                wallet.createTransaction(senderWallet.publicKey, subtractBalance, bc, tp);
                bc.addBlock(tp.transactions);
              });
        
              describe('and the sender sends another transaction to the recipient', () => {
                beforeEach(() => {
                  tp.clear();
                  senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
                  bc.addBlock(tp.transactions);
                });
        
                it('calculate the recipient balance only using transactions since its most recent one', () => {
                  expect((wallet.calculateBalance(bc)+MINING_REWARD)).toEqual(recipientBalance - subtractBalance + addBalance);
                });
              });
            });
        })

        


  })

})