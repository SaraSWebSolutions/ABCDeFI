
import React,{useEffect} from "react"
import "./Config/appkitconfig"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { AppKitProvider,AppKit } from "@reown/appkit-react-native"
import HomeScreen from "./HomeScreen"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { appKit } from "./Config/appkitconfig"
import { SafeAreaProvider  } from "react-native-safe-area-context"
const queryClient = new QueryClient()
export default function App() {
  //  useEffect(() => {
  //   AsyncStorage.clear()
  // }, [])
  return ( 
    <SafeAreaProvider >

  <QueryClientProvider client={queryClient}>
    <AppKitProvider instance={appKit} children={undefined}>
    <HomeScreen />
        <AppKit />

    </AppKitProvider>
    </QueryClientProvider>
        </SafeAreaProvider>

    )
}

