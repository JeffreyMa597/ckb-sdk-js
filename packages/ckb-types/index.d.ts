/**
 * @see https://github.com/nervosnetwork/ckb/blob/develop/rpc/src/types/blockchain.rs for more infomation
 */

declare namespace CKBComponents {
  export type LocalNodeId = string
  export type Hash = string
  export type BlockNumber = number
  export type Capacity = number
  export type ProposalShortId = string
  export interface INode {
    url: string
  }
  export interface IMethod {
    name: string
    method: string
    paramsFormatters: Function[]
    resultFormatters?: Function
  }
  /**
   * RPC Units
   */

  /* eslint-disable max-len */
  /**
   * @typedef IScript, lock or unlock script
   * @description IScript, the script model in CKB. CKB scripts use UNIX standard execution environment. Each script binary should contain a main function with the following signature `int main(int argc, char* argv[]);`. CKB will concat `signed_args` and `args`, then use the concatenated array to fill `argc/argv` part, then start the script execution. Upon termination, the executed `main` function here will provide a return code, `0` means the script execution succeeds, other values mean the execution fails.
   * @property version, script version, used to resolve incompatible upgrade.
   * @property args, normal arguments.
   * @property reference, point to its dependency, if your script already exists on CKB, you can use this field to reference the script instead of including it again. You can just put the script hash in this reference field, then list the cell containing the script as an outpoint in deps field in the current transaction. CKB will automatically locate cell and load the binary from there and use it as script `binary` part. Notice this only works when you don't provide a `binary` field value, otherwise the value in the `binary` field always take precedence.
   * @property binary, its dependency, ELF formatterd binary containing the actual RISC-V based script
   * @property signed_args, signed arguments, used to enable script sharing: assume 2 CKB users both want to use secp256k1 algorithm to secure their cells, in order to do this, they will need scripts for secp256k1 verification, the scripts will also need to include their public key respectively. If they put public key directly in the script binary, the difference in public keys will lead to different script binaries, which is quite a waste of resource considering the majority part of 2 scripts here is exeactly the same. To solve this problem, they can each put their public key in `signed_args` part of the script model, then leverage the same secp256k1 script binary. By this way they can save as much resource as they can while preserving different ownerships. This might not be a huge save when we are talking 2 users, but as the number of users grow, the resource we can save with this scheme is huge.
   * @tutorial Each script has a `type_hash` which uniquely identifies the script, for example, the `type_hash` of unlock script, is exactly the corresponding `lock` script field value in the referenced cell, when calculating type hash for a script, `version`, `bianry`, `reference` and `signed_args` will all be used.
   */
  /* eslint-enable max-len */
  export interface IScript {
    version: number
    args: Uint8Array[]
    reference?: Hash
    binary?: Uint8Array
    signedArgs: Uint8Array[]
  }

  /**
   * @typedef ICellInput, cell input in a transaction
   * @property previousOutput, point to its P1 cell
   * @property unlock, unlock script
   */
  export interface ICellInput {
    prevOutput: IOutPoint
    unlock: IScript
  }

  /**
   * @typedef ICellOutput, cell output in a transaction
   * @property capacity, the capacity of the genereated P1 cell
   * @property data, cell data
   * @property lock, lock hash
   * @property contract, lock script
   */
  export interface ICellOutput {
    capacity: Capacity
    data: Uint8Array
    lock: Hash
    type?: IScript
  }

  /**
   * @typedef IOutPoint, used to refer a generated cell by transaction hash and output index
   * @property hash, transaction hash
   * @property index, index of cell output
   */
  export interface IOutPoint {
    hash: Hash
    index: number
  }

  /**
   * @typedef ITransaction, transaction object
   * @property version, transaction version
   * @property deps, transaction deps
   * @property inputs, cell inputs in the transaction
   * @property outputs, cell outputs in the transaction
   * @property hash, transaction hash
   */
  export interface ITransaction {
    version: number
    deps: IOutPoint[]
    inputs: ICellInput[]
    outputs: ICellOutput[]
    hash?: Hash
  }

  /**
   * @typedef @ISeal
   * @property nonce
   * @property proof
   */
  export interface ISeal {
    nonce: number // u64
    proof: Uint8Array
  }

  /**
   * @typedef IBlockHeader, header of a block
   * @property version
   * @property parentHash
   * @property timestamp
   * @property number
   * @property txsCommit
   * @property txsProposal
   * @property difficulty
   * @property cellbaseId
   * @property unclesHash
   * @property unclesCount
   * @property seal
   * @property hash
   */
  export interface IBlockHeader {
    version: number
    parentHash: Hash
    timestamp: TimeStamp
    number: number
    txsCommit: Hash
    txsProposal: Hash
    difficulty: Hash
    cellbaseId: Hash
    unclesHash: Hash
    unclesCount: number
    seal: ISeal
    hash: Hash
  }

  /**
   * @typedef IUncleBlock, uncle block object
   * @property header, block header
   * @property cellbase, transaction
   * @property proposalTransactions
   */

  interface IUncleBlock {
    header: IBlockHeader
    cellbase: ITransaction
    proposalTransactions: ProposalShortId[]
  }

  /**
   * @typedef IBlock, block object
   * @property header, block header
   * @property uncles, uncle blocks
   * @property commitTransactions
   * @property proposalTransactions
   */
  export interface IBlock {
    header: IBlockHeader
    uncles: IUncleBlock[]
    commitTransactions: ITransaction[]
    proposalTransactions: ProposalShortId[]
  }

  /**
   * @typedef ICell, cell object
   * @property capacty, cell capacity
   * @property lock, lock hash
   */
  export interface ICell extends ICellOutput {}

  /**
   * @typedef ICell, cell object
   * @property capacty, cell capacity
   * @property lock, lock hash
   * @property outPoint
   */

  export interface ICellWithOutPoint extends ICell {
    outPoint: IOutPoint
  }

  export interface ICellByTypeHash {
    capacity: Capacity
    lock: Hash
    outPoint: IOutPoint
  }

  export enum CellStatus {
    LIVE = 'live',
  }
}