export enum SignatureConfig {
  ARWEAVE = 1,
  ED25519,
  ETHEREUM,
  SOLANA,
  WEBAUTH
}

interface SignatureMeta {
  sigLength: number;
  pubLength: number;
  sigName: string;
}

export const SIG_CONFIG: Record<SignatureConfig, SignatureMeta> = {
  [SignatureConfig.ARWEAVE]: {
    sigLength: 512,
    pubLength: 512,
    sigName: "arweave",
  },
  [SignatureConfig.ED25519]: {
    sigLength: 64,
    pubLength: 32,
    sigName: "ed25519",
  },
  [SignatureConfig.ETHEREUM]: {
    sigLength: 65,
    pubLength: 65,
    sigName: "ethereum",
  },
  [SignatureConfig.SOLANA]: {
    sigLength: 64,
    pubLength: 32,
    sigName: "solana",
  },
  [SignatureConfig.WEBAUTH]: {
    sigLength: 1024,
    pubLength: 1024,
    sigName: "fido2",
  },
};
