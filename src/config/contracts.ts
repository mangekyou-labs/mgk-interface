import { Contract, ContractRunner, InterfaceAbi } from "ethers";
import { ZeroAddress } from "ethers";
import { Multicall__factory } from "typechain-types/factories/Multicall__factory";
import { ExchangeRouter__factory } from "typechain-types/factories/ExchangeRouter__factory";
import { GlvRouter__factory } from "typechain-types/factories/GlvRouter__factory";
import { Vault__factory } from "typechain-types/factories/Vault__factory";
import { VaultReader__factory } from "typechain-types/factories/VaultReader__factory";
import { Reader__factory } from "typechain-types/factories/Reader__factory";
import { OrderBook__factory } from "typechain-types/factories/OrderBook__factory";
import { GlpManager__factory } from "typechain-types/factories/GlpManager__factory";
import { ARBITRUM, AVALANCHE, HEDERA_TESTNET } from "./chains";

export const XGMT_EXCLUDED_ACCOUNTS = [
  "0x330eef6b9b1ea6edd620c825c9919dc8b611d5d5",
  "0xd9b1c23411adbb984b1c4be515fafc47a12898b2",
  "0xa9af22a70326e39c0b30e3e33bc5388a58b4b47c",
];

export const CONTRACTS: {
  [chainId: number]: {
    [name: string]: string;
  };
} = {
  [ARBITRUM]: {
    Vault: "0x489ee077994B6658eAfA855C308275EAd8097C4A",
    Router: "0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064",
    OrderBook: "0x09f77E8A13De9a35a7231028187e9fD5DB8a2ACB",
    VaultPriceFeed: "0x2d68011bcA022ed0E474264145F46CC4de96a002",
    GLP: "0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258",
    ShortsTracker: "0xf58eEc83Ba28ddd79390B9e90C4d3EbfF1d434D8",
    GlpManager: "0x321F653eED006AD1C29D174e17d96351BDe22649",
    VaultErrorController: "0xf46BB6dDA9709C49EfB918201D97F6474EAc5Aea",
    VaultUtils: "0x669854709Aa5B8384eAC957F528749a10d9c0F1B",
    USDG: "0x45096e7aA921f27590f8F19e457794EB09678141",
    Governable: "0x09f77E8A13De9a35a7231028187e9fD5DB8a2ACB",
    TokenManager: "0x09f77E8A13De9a35a7231028187e9fD5DB8a2ACB",
    FastPriceEvents: "0x4530b7DE1958270A2376be192a24175D795e1b07",
    PriceFeedTimelock: "0x09f77E8A13De9a35a7231028187e9fD5DB8a2ACB",
    Multicall: "0xcA11bde05977b3631167028862bE2a173976CA11",
    GMX: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
    ES_GMX: "0xf42Ae1D54fd613C9bb14810b0588FaAa09a426cA",
    StakedGmxTracker: "0x908C4D94D34924765f1eDc22A1DD098397c59dD4",
    BonusGmxTracker: "0x4d268a7d4C16ceB5a606c173Bd974984343fea13",
    FeeGmxTracker: "0xd2D1162512F927a7e282Ef43a362659E4F2a728F",
    StakedGlpTracker: "0x1aDDD80E6039594eE970E5872D247bf0414C8903",
    FeeGlpTracker: "0x4e971a87900b931fF39d1Aad67697F49835400b6",
    ExtendedGmxTracker: "0xB0D12Bf95CC1341d6C845C978daaf36F70b5910d",
    StakedGmxDistributor: "0x23208B91A98c7C1CD9FE63085BFf68311494F193",
    StakedGlpDistributor: "0x60519b48ec4183a61ca2B8e37869E675FD203b34",
    GmxVester: "0x199070DDfd1CFb69173aa2F7e20906F26B363004",
    GlpVester: "0xA75287d2f8b217273E7FCD7E86eF07D33972042E",
  },
  [AVALANCHE]: {
    Vault: "0x9ab2De34A33fB459b538c43f251eB825645e8595",
    Router: "0x5F719c2F1095F7B9fc68a68e35B51194f4b6abe8",
    OrderBook: "0x4296e307f108B2f583FF2F7B7270ee7831574Ae5",
    VaultPriceFeed: "0xfe661cbf27Da0656B7A1151a761ff194849C387A",
    GLP: "0x01234181085565ed162a948b6a5e88758CD7c7b8",
    ShortsTracker: "0x9234252975484D75Fd05f3e4f7BdbEc61956D73a",
    GlpManager: "0xe1ae4d4b06A5Fe1fc288f6B4CD72f9F8323B107F",
    VaultErrorController: "0xE41EE6c0C67A42C7Bfb7E4A6cB9cc35b5b63BF3E",
    VaultUtils: "0x2bD8Bf7C1b22E0B76fDc2E1B6E904EF4898F5E2A",
    USDG: "0xc0253c3cC6aa5Ab407b5795a04c28fB063273894",
    Governable: "0x4296e307f108B2f583FF2F7B7270ee7831574Ae5",
    TokenManager: "0x4296e307f108B2f583FF2F7B7270ee7831574Ae5",
    FastPriceEvents: "0x02b7023D43bc52bFf8a0C54A9F2ecec053523Bf6",
    PriceFeedTimelock: "0x4296e307f108B2f583FF2F7B7270ee7831574Ae5",
    Multicall: "0xcA11bde05977b3631167028862bE2a173976CA11",
    GMX: "0x62edc0692BD897D2295872a9FFCac5425011c661",
    ES_GMX: "0xFf1489227BbAAC61a9209A08929E4c2a526DdD17",
    StakedGmxTracker: "0x2bD10f8E93B3669b6d42E74eEedC65dd1B0a1342",
    BonusGmxTracker: "0x908C4D94D34924765f1eDc22A1DD098397c59dD4",
    FeeGmxTracker: "0x4d268a7d4C16ceB5a606c173Bd974984343fea13",
    StakedGlpTracker: "0x9e295B5B976a184B14aD8cd72413aD846C299660",
    FeeGlpTracker: "0xd2D1162512F927a7e282Ef43a362659E4F2a728F",
    ExtendedGmxTracker: "0xB0D12Bf95CC1341d6C845C978daaf36F70b5910d",
    StakedGmxDistributor: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
    StakedGlpDistributor: "0xDd593Cf40734199afc9207eBe9ffF23dA4Bf7720",
    GmxVester: "0x472361d3cA5F49c8E633FB50385BfaD1e018b445",
    GlpVester: "0x62331A7Bd1dfB3A7642B7db50B5509E57CA3154A",
  },
  [HEDERA_TESTNET]: {
    Vault: "0x2D641633FE39fAc1E79085dCAF91244EcBBda809",
    Router: "0x10B0628681e63a9610fec17f08A3aaE9cd1Edf3e",
    OrderBook: "0x9171bF1A725A6EDCCe44A8A124216775Eb324165",
    VaultPriceFeed: "0x50938434Ea67f71b2B34B02F7E73e9a46B3DE70",
    GLP: "0x72fa2d4Ac18741787740AAE3DEfEb2911B2627b3",
    ShortsTracker: "0xEbB9F472C853675678e797D06D33682df8b167c8",
    GlpManager: "0x9FDC5ACeBb6684EB4EfE19a36b6377CbD12175F4",
    Multicall: "0xcd03b496d75b2e0eab717673da19e32ccb5e5517",
    VaultErrorController: "0xe3E894886193E2CAF56091122B39881c73d97157",
    VaultUtils: "0x5e780ed074d621F1e27BC2eE9c725a04299cFd38",
    USDG: "0xCdd92f8983b4c0F9588DcEE98434B4f8F62ED2ef",
    Governable: "0xd4a4AD10f85a017EfB1ff3b2739cA2313fb248e2",
    TokenManager: "0xAf3C069A40fA3D438FAdcC58737F088B41b1FC0B",
    FastPriceEvents: "0xc99E1cF86CD18adbfbBE5baf77723A7d97297e4E",
    PriceFeedTimelock: "0x90085211A094C66B340E401a87295354E55A1f0b",
    ReferralStorage: "0x97bB30637DD7A71997F905Cd142cF89d2887ADb8",
    ReferralReader: "0x60dEb0256fe77143Cc96bA707e5c08622c9a23C1",
    Timelock: "0x2f536D720484Fa5AF85BDF7Fd4fc0b9C93530961",
    ShortsTrackerTimelock: "0x277Bd2D3d31F957E2bC41A10656840c469c6770d",
    VaultTimelock: "0xbD29419FbaD7c1143c885E3f24c83fD383f4A718",
    PositionUtils: "0x9e36A84bcCDb65575b095369A8569e4bdD94ad3A",
    ReferralStorageTimelock: "0x147211793495687538ec26a44156CCF2e3A4F2C1",
    PositionRouter: "0x863ee39c49A3AbadA8e903FF6ea6A1bFc3854A84",
    VaultReader: "0x976e86E971F360C00bD28c80e6f1710B0b0bBE12",
    Reader: "0x87513584DF1f082ff3a34f15EAD5d3D14C7e0639",
    OrderBookReader: "0x9b82283af98124b82dE0b96587C98946a95D45E3",
    PositionRouterReader: "0x00BEB0A5D709d0F093952fD374Dbbf3d0d21d550",
    PositionManager: "0x3c40abEEAF252f3F37F59C8D72E7624D466f8ec9",
    NATIVE_TOKEN: "0x0000000000000000000000000000000000003ad2",
    GMX: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
    ES_GMX: "0xf42Ae1D54fd613C9bb14810b0588FaAa09a426cA",
  }
};

export function getContract(chainId: number, name: string): string {
  if (!CONTRACTS[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }

  if (!CONTRACTS[chainId][name]) {
    throw new Error(`Unknown contract "${name}" for chainId ${chainId}`);
  }

  return CONTRACTS[chainId][name];
}

function makeGetContract<T extends { abi: InterfaceAbi; connect: (address: string) => unknown }>(
  name: string,
  factory: T
) {
  return (chainId: number, provider?: ContractRunner) =>
    new Contract(getContract(chainId, name), factory.abi, provider) as unknown as ReturnType<T["connect"]>;
}

export const getMulticallContract = makeGetContract("Multicall", Multicall__factory);
export const getExchangeRouterContract = makeGetContract("Router", ExchangeRouter__factory);
export const getGlvRouterContract = makeGetContract("GlvRouter", GlvRouter__factory);
export const getVaultContract = makeGetContract("Vault", Vault__factory);
export const getVaultReaderContract = makeGetContract("VaultReader", VaultReader__factory);
export const getReaderContract = makeGetContract("Reader", Reader__factory);
export const getOrderBookContract = makeGetContract("OrderBook", OrderBook__factory);
export const getGlpManagerContract = makeGetContract("GlpManager", GlpManager__factory);

export const getZeroAddressContract = (provider?: ContractRunner) => new Contract(ZeroAddress, [], provider);

export function tryGetContract(chainId: number, name: string): string | undefined {
  return CONTRACTS[chainId]?.[name];
}
