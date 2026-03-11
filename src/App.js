// import React from "react"
// import { AppKitProvider } from "@reown/appkit-react-native"
// import { AppKit } from "@reown/appkit-react-native"

// import { WagmiProvider } from "wagmi"
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// import { appKit, wagmiAdapter } from "./Config/appkitconfig"
// import HomeScreen from "./HomeScreen"
// import { AppKitButton } from "@reown/appkit-react-native"
// const queryClient = new QueryClient()
//   console.log(wagmiAdapter,'wagmiAdapter1');

// export default function App() {
//   // console.log(wagmiAdapter,'wagmiAdapter');
  
//   return (
//     // <AppKitProvider instance={appKit}>
//       <WagmiProvider config={wagmiAdapter?.wagmiConfig} reconnectOnMount={false}>
//         <QueryClientProvider client={queryClient}>
//           <HomeScreen />
//           <AppKit />
//         </QueryClientProvider>
//       </WagmiProvider>
//     // </AppKitProvider>
//   )
// }


import React from "react"
import "./Config/appkitconfig"
import HomeScreen from "./HomeScreen"

export default function App() {
  return <HomeScreen />
}