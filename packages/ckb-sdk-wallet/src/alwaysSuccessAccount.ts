import { hexToBytes, SHA3 } from '@nervosnetwork/ckb-sdk-utils'
import RPC from '@nervosnetwork/ckb-sdk-rpc'
import { Options } from '@nervosnetwork/ckb-sdk-utils/lib/ecpair'
import Account from './account'

class AlwaysSuccessAccount extends Account {
  public _verifyTypeHash: string | undefined

  public _rpc: RPC

  public alwaysSuccess = {
    cellHash: '',
    scriptOutPoint: {
      hash: '',
      index: 0,
    },
  }

  public genesisBlock: any

  constructor(sk: Uint8Array | string, rpc: RPC, options?: Options) {
    super(sk, rpc, options)
    this._rpc = rpc
    // load genesis block and set always_success_script_out_point, always_success_cell_hash
    this.loadGenesisBlock()
  }

  loadGenesisBlock = () => {
    this._rpc
      .getBlockHash(0)
      .then(hash => this._rpc.getBlock(hash))
      .then(block => {
        this.genesisBlock = block
        const alwaysSuccessScriptOutPoint = {
          hash: block.commitTransactions[0].hash,
          index: 0,
        }
        const s = new SHA3(256)
        s.update(Buffer.from(hexToBytes(block.commitTransactions[0].outputs[0].data)), 'binary')
        const alwaysSuccessCellHash = s.digest('hex')
        this.alwaysSuccess = {
          cellHash: alwaysSuccessCellHash,
          scriptOutPoint: {
            hash: alwaysSuccessScriptOutPoint.hash || '',
            index: alwaysSuccessScriptOutPoint.index,
          },
        }
        this.deps = [this.alwaysSuccess.scriptOutPoint]
        this.unlockScript.reference = `0x${this.alwaysSuccess.cellHash}`
        console.log('ready')
      })
  }

  // get unlockScript() {
  //   return {
  //     version: 0,
  //     reference: `0x${this.alwaysSuccess.cellHash}`,
  //     args: [],
  //     signedArgs: [],
  //   }
  // }

  // TODO: install
}

export default AlwaysSuccessAccount
