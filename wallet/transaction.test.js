const Transaction=require('./transaction')
const Wallet=require('./wallet')
const {MINING_REWARD}=require('../config')
describe('Transaction', ()=>{
    let transaction,wallet,reciever,amount;
    beforeEach(()=>{
        wallet =new Wallet();
        amount=50
        reciever ='0xadsjksdkjdhaiowq'
        transaction =Transaction.newTransaction(wallet,reciever,amount);

    })
    it('Check if the output `amount` matches the amount subtracted from wallet balence',()=>{
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance-amount-MINING_REWARD)
    })
    it('output matches the `amount` added to the reciever wallet',()=>{
        expect(transaction.outputs.find(output =>output.address === reciever).amount).toEqual(amount)
    })
    it('matches the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
     })

    it('validate the transaction', ()=>{
        expect(Transaction.verifyTransaction(transaction)).toBe(true)
    })
    it('validate the bad transaction',()=>{
        transaction.outputs[0].amount=50000
        expect(Transaction.verifyTransaction(transaction)).toBe(false)
    })

    // describe('transaction reward creation',()=>{
    //     beforeEach(()=>{
    //         transaction=Transaction.rewardTransaction(wallet,Wallet.blockchainWallet())
    //     })
    //     it(`reward the minerWallet`,()=>{
    //         expect(transaction.outputs.find(output=> output.address===.publicKey).amount).toEqual(MINING_REWARD)
    //     })
    // })

    describe('transaction exceeds wallet balence',()=>{
        beforeEach(() =>{
            amount=100000;
            transaction=Transaction.newTransaction(wallet,reciever,amount);
        })

        it('transaction exceeds wallet balence',()=>{
            expect(transaction).toEqual(undefined)
        })
        
         
    })


    describe('updating the transaction',()=>{
        let newAmount,newReciever;
        beforeEach(() =>{
            newAmount=50
            newReciever='0xksksdkajsdwqewqeqqwewq'
            transaction=transaction.update(wallet,newReciever,amount);
        })

        it('reduces the newAmount from the sender output',()=>{
            expect(transaction.outputs.find(output=> output.address===wallet.publicKey).amount).toEqual(wallet.balance-amount-newAmount-MINING_REWARD)
        })
        it('outputs an amount for the next reciever', () => {
            expect(transaction.outputs.find(output => output.address === newReciever).amount)
              .toEqual(newAmount);
          });
    })

  
})




