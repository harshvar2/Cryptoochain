const Transaction=require('./transaction')
const Wallet=require('./wallet')

describe('Transaction', ()=>{
    let transaction,wallet,reciver,amount;
    beforeEach(()=>{
        wallet =new Wallet();
        amount=50
        reciever ='0xadsjksdkjdhaiowq'
        transaction =Transaction.newTransaction(wallet,reciever,amount);

    })
    it('Check if the output `amount` matches the amount subtracted from wallet balence',()=>{
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance-amount)
    })
    it('output matches the `amount` added to the reciever wallet',()=>{
        expect(transaction.outputs.find(output =>output.address === reciever).amount).toEqual(amount)
    })
    describe('transaction exceeds wallet balence',()=>{
        beforeEach(() =>{
            amount=100000;
            transaction=Transaction.newTransaction(wallet,reciever,amount);
        })

        it('transaction exceeds wallet balence',()=>{
            expect(transaction).toEqual(undefined)
        })
    })
})