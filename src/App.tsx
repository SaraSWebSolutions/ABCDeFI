
import React, { useEffect } from "react"
// this needs to be imported before anything else
import "@thirdweb-dev/react-native-adapter"
import AsyncStorage from "@react-native-async-storage/async-storage"

// import HomeScreen from "./HomeScreen"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import AppNavigator from "./Navigation/AppNavigator"
import { Provider } from "react-redux";
import { store } from "./Store/Store"
import { ThirdwebProvider, thirdwebClient, activeChain } from "./Config/thirdwebConfig"
const queryClient = new QueryClient()
export default function App() {
  return (
    <SafeAreaProvider >
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThirdwebProvider client={thirdwebClient} activeChain={activeChain}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </ThirdwebProvider>
        </QueryClientProvider>
      </Provider>
    </SafeAreaProvider>
  )
}

