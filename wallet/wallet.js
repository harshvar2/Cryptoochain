const {INITIAL_BALENCE}=require('../config')
const ChainUtil=require('../chain-util')
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
}
module.exports =Wallet;