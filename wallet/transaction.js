const ChainUtil=require('../chain-util')
class Transaction{
    constructor(){
        this.id=ChainUtil.id()
        this.input=null;
        this.outputs=[];
    }

    static newTransaction(senderWallet,reciever,amount){

        const transaction=new this();
        if(amount>senderWallet.balance){
            console.log(`Amount:${amount} exceeds balance`)
            return;
        }
        transaction.outputs.push(...[
            {amount:senderWallet.balance-amount,address:senderWallet.publicKey},
            {amount,address:reciever}
        ])
        return transaction;
    }
}
module.exports = Transaction