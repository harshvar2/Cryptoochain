const SHA256 = require('crypto-js/sha256')
const {DIFFICULTY,MINE_RATE}=require('../config')


class Block{
    constructor(timestamp,previousBlockHash,hash,data,nounce,difficulty){
        this.timestamp = timestamp;
        this.previousBlockHash= previousBlockHash
        this.hash = hash;
        this.data = data;
        this.nounce=nounce;
        this.difficulty = difficulty||DIFFICULTY;
    }


toString() {
    return `Block -
      Timestamp : ${this.timestamp}
      Nounce:${this.nounce}
      PreviousBlockHash : ${this.previousBlockHash}
      Hash      : ${this.hash}
      Difficulty:${this.difficulty}
      Data      : ${this.data}`
  }

 static genesis() {
    return new this('Genesis time', '-----', 'f1r57-h45h', [],0,DIFFICULTY);
  }

static mineBlock(lastBlock, data) {
    const timeStamp=Date.now();
    const previousBlockHash=lastBlock.hash;
    let nounce=0;
    let hash,timestamp;
    let { difficulty } = lastBlock;
    do {
      nounce++;
      timestamp=Date.now();
      difficulty = Block.adjustDifficulty(lastBlock,timestamp);
     hash=Block.hash(timeStamp,previousBlockHash,data,nounce,difficulty);
    }
    while(hash.substring(0,difficulty)!==('0'.repeat(difficulty)));

    return new this(timeStamp,previousBlockHash,hash,data,nounce,difficulty)
}

static hash(timestamp, previousBlockHash, data,nounce,difficulty) {
    return SHA256(`${timestamp}${previousBlockHash}${data}${nounce}${difficulty}`).toString();
  }

  static blockHash(block) {
	const { timestamp, previousBlockHash, data,nounce,difficulty } = block;
  return Block.hash(timestamp, previousBlockHash, data,nounce,difficulty);
}

static adjustDifficulty(lastBlock,currentTime){
  let { difficulty } = lastBlock;
  difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1; 
  return difficulty; 
}


}


  
module.exports = Block;
