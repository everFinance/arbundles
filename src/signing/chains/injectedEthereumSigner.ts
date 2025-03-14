import { ethers } from "ethers";
import { Signer } from "..";
import { SignatureConfig, SIG_CONFIG } from "../../constants";

export default class InjectedEthereumSigner implements Signer {
  private signer: ethers.providers.JsonRpcSigner;
  public publicKey: Buffer;
  readonly ownerLength: number = SIG_CONFIG[SignatureConfig.ETHEREUM].pubLength;
  readonly signatureLength: number =
    SIG_CONFIG[SignatureConfig.ETHEREUM].sigLength;
  readonly signatureType: SignatureConfig = SignatureConfig.ETHEREUM;

  constructor(provider: ethers.providers.Web3Provider) {
    this.signer = provider.getSigner();
  }

  async setPublicKey(): Promise<void> {
    const address = "sign this message to get public key";
    const signedMsg = await this.signer.signMessage(address);
    const hash = await ethers.utils.hashMessage(address);
    const recoveredKey = ethers.utils.recoverPublicKey(
      ethers.utils.arrayify(hash),
      signedMsg,
    );
    this.publicKey = Buffer.from(ethers.utils.arrayify(recoveredKey));
  }

  async sign(message: Uint8Array): Promise<Uint8Array> {
    if (!this.publicKey) {
      await this.setPublicKey();
    }
    let sig = ""
    if ((window as any).ethereum.isSafeheron) {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum)
      const address = await provider.getSigner().getAddress()
      const hash = ethers.utils.hashMessage(message)
      sig = await provider.send("eth_sign", [address, hash])
    } else {
      sig = await this.signer.signMessage(message);
    }
    return Buffer.from(sig.slice(2), "hex");
  }

  static verify(
    pk: Buffer,
    message: Uint8Array,
    signature: Uint8Array,
  ): boolean {
    const address = ethers.utils.computeAddress(pk);
    return ethers.utils.verifyMessage(message, signature) === address;
  }
}
