
const Wallet = require('./wallet')
const {MINING_REWARD,LIQUIDITY_POOL_BALENCE}=require('../config')
class BlockchainWallet{
constructor(){
    this.blockchainWallet=new Wallet();
    this.blockchainWallet.publicKey = "blockchain-wallet-address/ Liquidity Pool address "
    this.blockchainWallet.balance=LIQUIDITY_POOL_BALENCE
}
static getBlockchainWallet(MINING_REWARD){
    // this.blockchainWallet.balance=LIQUIDITY_POOL_BALENCE-MINING_REWARD
    return this.blockchainWallet;
}
}

module.exports =BlockchainWallet