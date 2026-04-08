
import React, { useEffect } from "react"
// this needs to be imported before anything else
import "@thirdweb-dev/react-native-adapter"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import AppNavigator from "./Navigation/AppNavigator"
import { Provider } from "react-redux";
import { store } from "./Store/Store"
import { ThirdwebProvider, thirdwebClient } from "./Config/thirdwebConfig"
import { Loader } from "./Components/CommanLoader"
import { useAutoConnect } from "thirdweb/react"

const queryClient = new QueryClient()

function AutoConnectHandler() {
  useAutoConnect({
    client: thirdwebClient,
  });
  return null;
}

export default function App() {
  return (
    <SafeAreaProvider >
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThirdwebProvider>
            <AutoConnectHandler />
            <NavigationContainer>
              <AppNavigator />
              <Loader/>
            </NavigationContainer>
          </ThirdwebProvider>
        </QueryClientProvider>
      </Provider>
    </SafeAreaProvider>
  )
}

