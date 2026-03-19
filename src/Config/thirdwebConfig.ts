import { ThirdwebProvider } from "thirdweb/react";
import { createThirdwebClient, defineChain } from "thirdweb";
// import {bscTestnet} from 'viem/chains'
import { bsc, polygon } from "thirdweb/chains";
import { config } from "process";
import { THIRDWEB_CLIENT_ID } from "@env";

// load from env
const clientId = THIRDWEB_CLIENT_ID || "fallback-client-id";

export const thirdwebClient = createThirdwebClient({
  clientId: clientId,

});

export { ThirdwebProvider };

export const bscTestnet_custom = /*#__PURE__*/ defineChain({
  id: 97,
  name: 'BNB Smart Chain Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'tBNB',
  },
  rpcUrls: {
    default: { http: ['https://bnb-testnet.api.onfinality.io/public'] },
  },
  blockExplorers: {
    default: {
      name: 'BscScan',
      url: 'https://testnet.bscscan.com',
      apiUrl: 'https://api-testnet.bscscan.com/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 17422483,
    },
  },
  testnet: true,
})




const activeChain = bscTestnet_custom;
export { activeChain };

const chains = [bscTestnet_custom,bsc];
export { chains };
