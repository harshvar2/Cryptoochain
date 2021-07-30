const Block=require('./block');
const {DIFFICULTY}=require('../config')
describe('Block', ()=>{
    let data,lastBlock,block;
    beforeEach(() => {
         data='foo'
         lastBlock=Block.genesis();
         block=Block.mineBlock(lastBlock,data)
    })

    it('sets the `data` to match the input',()=>{
        expect(block.data).toEqual(data)
    })

    it('sets the `previousBlockHash` to match the hash of the last block',()=>{
        expect(block.previousBlockHash).toEqual(lastBlock.hash)
    })
    it('generates hash that matches difficulty block',()=>{
        expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty))
        console.log(block.toString())

    })
    it('lower the difficulty for a slower generated block',()=>{
        // 300000 will make it insanely slow
        expect(Block.adjustDifficulty(block,block.timestamp + 300000)).toEqual(block.difficulty - 1);
    });
    it('raise the difficulty for a faster generated block',()=>{
        expect(Block.adjustDifficulty(block,block.timestamp + 1)).toEqual(block.difficulty + 1);
    });
})