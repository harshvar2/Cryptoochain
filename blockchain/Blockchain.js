const Block=require("./block")
class Blockchain{
    constructor(){
        this.chain=[Block.genesis()];
    }
    addBlock(data){
        
        const block=Block.mineBlock(this.chain[this.chain.length-1],data);
        this.chain.push(block);
        return block;
    }

    isValidChain(chain){
        //check first block in chain matches with genesis block
        if(JSON.stringify(chain[0])!==JSON.stringify(Block.genesis()))
        return false;

        for (let i=1; i<chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i-1];
            if (
              block.previousBlockHash !== lastBlock.hash ||
              block.hash !== Block.blockHash(block) //To check if the block data has not been changed
            ) {
              return false;
            }
          }

        return true;
    }

 replaceChain(newChain){
        if(newChain.length<=this.chain.length)
        return ;
        else if(!this.isValidChain(newChain))
        {
            console.log("New chain is not valid")
            return;
        }
        this.chain=newChain;
        console.log("Successfully replace blockchain with new chain")

    }


}
module.exports=Blockchain;