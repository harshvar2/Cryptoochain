const Blockchain=require('./Blockchain')

// const block=Block.mineBlock(Block.genesis(),'foo')
// console.log(block.toString())


const bc=new Blockchain()

for(let i=0; i<10; i++){
    console.log(bc.addBlock(`harsh${i}`).toString());
}