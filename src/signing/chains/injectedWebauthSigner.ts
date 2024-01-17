import { Signer } from "..";
import { SignatureConfig, SIG_CONFIG } from "../../constants";
import Arweave from "arweave";
import base64url from "base64url";

const isString = (obj: any): boolean => {
  return Object.prototype.toString.call(obj) === "[object String]"
    ? true
    : false;
};

const checkArPermissions = async (
  windowArweaveWallet,
  permissions: string[] | string,
): Promise<void> => {
  let existingPermissions: string[] = [];
  const checkPermissions = isString(permissions)
    ? [permissions]
    : (permissions as string[]);

  try {
    existingPermissions = await windowArweaveWallet.getPermissions();
  } catch {
    throw new Error("PLEASE_INSTALL_ARCONNECT");
  }

  if (checkPermissions.length === 0) {
    return;
  }

  if (
    checkPermissions.some((permission: string) => {
      return !existingPermissions.includes(permission);
    })
  ) {
    await windowArweaveWallet.connect(checkPermissions as never[]);
  }
};

export default class InjectedWebauthSigner implements Signer {
  private signer: any;
  public publicKey: Buffer;
  readonly ownerLength: number = SIG_CONFIG[SignatureConfig.WEBAUTH].pubLength;
  readonly signatureLength: number =
    SIG_CONFIG[SignatureConfig.WEBAUTH].sigLength;
  readonly signatureType: SignatureConfig = SignatureConfig.WEBAUTH;

  // 传递 Everpay 实例，以及 publicKey
  constructor({ everpay, publicKey, account }: any) {
    const sign = {
      everpay,
      account,
      getActivePublicKey: function (): any {
        return publicKey;
      },
    };
    this.signer = sign;
  }

  // 设置 PublicKey
  async setPublicKey(): Promise<void> {
    // try {
    //   await checkArPermissions(this.signer, ["ACCESS_PUBLIC_KEY"])
    // } catch {
    //   throw new Error("ACCESS_PUBLIC_KEY_PERMISSION_NEEDED")
    // }
    const fidoOwner = await this.signer.getActivePublicKey();
    this.publicKey = base64url.toBuffer(fidoOwner);
  }

  // 签名数据
  async sign(message: Uint8Array): Promise<Uint8Array> {
    if (!this.publicKey) {
      await this.setPublicKey();
    }
    console.log(123123123);
    try {
      const { sig } = this.signer.everpay.signMessageAsync(
        { isSmartAccount: true, debug: true, account: this.signer.account },
        message,
      );
      console.log(sig, "sig");
      const buf = new Uint8Array(sig);
      console.log(buf, "buf");
      return buf;
    } catch {
      throw new Error("SIGNATURE_FAILED");
    }

    // try {
    //   await checkArPermissions(this.signer, "SIGNATURE")
    // } catch {
    //   throw new Error("SIGNATURE_PERMISSION_NEEDED")
    // }

    // const algorithm = {
    //   name: "RSA-PSS",
    //   saltLength: 0
    // }

    // try {
    //   const signature = await this.signer.signature(
    //     message,
    //     algorithm
    //   )
    //   const buf = new Uint8Array(Object.values(signature))
    //   return buf
    // } catch {
    //   throw new Error("SIGNATURE_FAILED")
    // }
  }

  static async verify(
    pk: string,
    message: Uint8Array,
    signature: Uint8Array,
  ): Promise<boolean> {
    return await Arweave.crypto.verify(pk, message, signature);
  }
}
