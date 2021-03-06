const Blockchain=require("./Blockchain")
const Block=require("./block")
describe("Blockchain",()=>{
    let bc,bc2;
    beforeEach(() => {
        bc=new Blockchain();
        bc2=new Blockchain();
    })

    it('the blockchain starts with genesis block',()=>{
expect(bc.chain[0]).toEqual(Block.genesis())
    })

    it('adds a new block successfully',()=>{
        const data='foo'
        bc.addBlock(data)
        expect(bc.chain[bc.chain.length - 1].data).toEqual(data)
    })

    it('validates a valid chain', ()=>{
        bc2.addBlock('foo');
        expect(bc.isValidChain(bc2.chain)).toBe(true)
    })
    it('rejects the chain with corrupt genesis', ()=>{
        bc2.chain[0].data='bad data'
        expect(bc.isValidChain(bc2.chain)).toBe(false)
    })

    it('rejects the chain with corrupt block in beetween the chain',()=>{
        bc2.addBlock('foo')
        bc2.chain[1].data='bad data'
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    })

    it('replaces the chain with valid chain',() => {
        bc2.addBlock('foo');
        bc.replaceChain(bc2.chain)
        expect((bc.chain)).toEqual(bc2.chain);
    })
    it('does not replace the chain with one of less than or equal length', () => {
        bc.addBlock('foo');
      bc.replaceChain(bc2.chain);
      expect(bc.chain).not.toEqual(bc2.chain);
    });
})