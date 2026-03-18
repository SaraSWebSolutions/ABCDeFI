
import React,{useEffect} from "react"
import "./Config/appkitconfig"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { AppKitProvider,AppKit } from "@reown/appkit-react-native"
import HomeScreen from "./HomeScreen"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { appKit } from "./Config/appkitconfig"
import { SafeAreaProvider  } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import AppNavigator from "./Navigation/AppNavigator"
import { Provider } from "react-redux";
import { store } from "./Store/Store"
import { Loader } from "./Components/CommanLoader"

const queryClient = new QueryClient()
export default function App() {
  //  useEffect(() => {
  //   AsyncStorage.clear()
  // }, [])
  return ( 
    <SafeAreaProvider >
<Provider store={store}>

  <QueryClientProvider client={queryClient}>
    <AppKitProvider instance={appKit} >
      <Loader/>
      <NavigationContainer>
        <AppNavigator/>
      </NavigationContainer>
        <AppKit />

    </AppKitProvider>
    </QueryClientProvider>
    </Provider>

        </SafeAreaProvider>

    )
}

