import { Signer } from "../Signer";
import { constants, createPublicKey, createSign } from "crypto-browserify";
import Arweave from "arweave";
import base64url from "base64url";
import { SIG_CONFIG } from "../../constants";

export default class Rsa4096Pss implements Signer {
  readonly signatureType: number = 1;
  readonly ownerLength: number = SIG_CONFIG[1].pubLength;
  readonly signatureLength: number = SIG_CONFIG[1].sigLength;
  private readonly _publicKey: Buffer;
  public get publicKey(): Buffer {
    return this._publicKey;
  }

  constructor(private _key: string, public pk?: string) {
    if (!pk) {
      this.pk = createPublicKey({
        key: _key,
        type: "pkcs1",
        format: "pem",
      })
        .export({
          format: "pem",
          type: "pkcs1",
        })
        .toString();
    }
  }

  sign(message: Uint8Array): Uint8Array {
    return createSign("sha256").update(message).sign({
      key: this._key,
      padding: constants.RSA_PKCS1_PSS_PADDING,
    });
  }

  static async verify(
    pk: string | Buffer,
    message: Uint8Array,
    signature: Uint8Array,
  ): Promise<boolean> {
    return await Arweave.crypto.verify(
      Buffer.isBuffer(pk) ? base64url.encode(pk) : pk,
      message,
      signature,
    );
  }
}
