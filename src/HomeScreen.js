// import React from 'react'
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
// import { useAppKit } from '@reown/appkit/react'
// import { useAccount } from 'wagmi'

// export default function HomeScreen() {

//   const { open } = useAppKit()
//   const { address, isConnected } = useAccount()

//   return (
//     <View style={styles.container}>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => open()}
//       >
//         <Text style={styles.text}>Connect Wallet</Text>
//       </TouchableOpacity>

//       {isConnected && (
//         <Text style={styles.address}>
//           Wallet: {address}
//         </Text>
//       )}

//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex:1,
//     justifyContent:'center',
//     alignItems:'center'
//   },
//   button:{
//     backgroundColor:'black',
//     padding:15,
//     borderRadius:10
//   },
//   text:{
//     color:'white'
//   },
//   address:{
//     marginTop:20
//   }
// })

import React from "react";
import { View } from "react-native";
import { AppKitButton } from "@reown/appkit-react-native";

export default function HomeScreen() {
  console.log("homeScren");
  
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <AppKitButton />
    </View>
  );
}