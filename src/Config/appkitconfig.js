// import "@walletconnect/react-native-compat"
// import "react-native-get-random-values"
// import "react-native-url-polyfill/auto"

// import { createAppKit } from "@reown/appkit-react-native"
// import { WagmiAdapter } from "@reown/appkit-wagmi-react-native"
// import { mainnet } from "wagmi/chains"
// console.log("WagmiAdapter:", WagmiAdapter)
// export const projectId = "2e9c8afcbe7e32decdd58606e2a25418"

// export const networks = [mainnet]

// export const wagmiAdapter = new WagmiAdapter({
//   projectId,
//   networks
// })

// export const appKit = createAppKit({
//   adapters: [wagmiAdapter],
//   networks,
//   projectId,
//   metadata: {
//     name: "WalletApp",
//     description: "Wallet Example",
//     url: "https://example.com",
//     icons: []
//   }
// })




import { createAppKit } from "@reown/appkit-react-native"
import { EthersAdapter } from "@reown/appkit-ethers-react-native"

export const projectId = "2e9c8afcbe7e32decdd58606e2a25418"

const metadata = {
  name: "WalletConnect",
  description: "WalletConnect Demo",
  url: "https://example.com",
  icons: []
}

export const ethersAdapter = new EthersAdapter()

export const appKit = createAppKit({
  adapters: [ethersAdapter],
  projectId,
  metadata
})