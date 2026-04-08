import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
  PermissionsAndroid,
  Platform
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "../../Utils/Colors";
import Fonts from "../../Utils/Fonts";
import { useActiveAccount, useActiveWalletChain, useActiveWalletConnectionStatus, useDisconnect, useSwitchActiveWalletChain, useConnect, useActiveWallet, ConnectButton } from 'thirdweb/react';
import { bscTestnet_custom, thirdwebClient} from '../../Config/thirdwebConfig';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store/Store';
import { useFocusEffect } from "@react-navigation/native";
import { fetchTimerIco, fetchReward, fetchRewardStatus } from '../../Store/Slices/homeSlice';
import { downloadWhitepaper } from '../../Store/Slices/authSlice';
import { ethers } from 'ethers';
import icoABI from '../../abi/ico.json';

import ReactNativeBlobUtil from 'react-native-blob-util';
import { IMAGE_URL } from '@env';
import FastImage from 'react-native-fast-image';
import { fetchProfile } from '../../Store/Slices/profileSlice';
import { WalletModal } from '../../Components/WalletModal';
import { createWallet, WalletId } from 'thirdweb/wallets';
import { PROJECT_ID } from '@env';
import { bscTestnet } from 'thirdweb/chains';
import { checkWalletInstalled, showInstallationAlert, WALLET_METADATA } from '../../Utils/WalletDetection';
import { expected_chainID, ICO_CONTRACT_ADDRESS } from './IcoScreen';


export default function HomeScreen({ navigation }: any) {
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();
  const { user, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const chain = useActiveWalletChain();
   console.log(chain, 'chain');
  const switchChain = useSwitchActiveWalletChain();
  const address = account?.address;
  const isConnected = !!account;
const dispatch = useDispatch<any>();
const [imgError, setImgError] = useState(false);

const { timerIcoData, error } = useSelector(
  (state: RootState) => state.home
);
const { rewardStatus,rewardData } = useSelector(
  (state: RootState) => state.home
);
  const { profileData } = useSelector((state: RootState) => state.profile);

  const [timeLeft, setTimeLeft] = useState({
    days: "0",
    hours: "0",
    minutes: "0",
    seconds: "0",
  });
  const [rewardShow, setRewardShow] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const activeAccount = useActiveAccount();
  const status = useActiveWalletConnectionStatus();

  const [icoStats, setIcoStats] = useState({
    startTime: 0,
    endTime: 0,
    totalCap: '0',
    totalSold: '0',
    isLoading: true
  });

  const fetchHomeScreenData = async (showLoading = true) => {
    if (showLoading) setIcoStats(prev => ({ ...prev, isLoading: true }));
    try {
      const provider = new ethers.JsonRpcProvider('https://bsc-testnet.publicnode.com');
      const icoContract = new ethers.Contract(ICO_CONTRACT_ADDRESS, icoABI, provider);


      // Fetch summary, current stage, and start time in parallel (exactly like IcoScreen)
      const [summary, stageData, startTimeBN, endTimeBN] = await Promise.all([
        icoContract.getIcoSummary(),
        icoContract.getCurrentStageData(),
        icoContract.icoStartTime(),
        icoContract.icoEndTime()
      ]);

      const [totalSoldGlobal, totalCapGlobal] = summary;

      setIcoStats({
        startTime: Number(startTimeBN),
        endTime: Number(endTimeBN),
        totalCap: ethers.formatUnits(totalCapGlobal, 18),
        totalSold: ethers.formatUnits(totalSoldGlobal, 18),
        isLoading: false
      });
    } catch (error) {
      console.error("Error fetching HomeScreen contract data:", error);
      setIcoStats(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    dispatch(fetchProfile());
    fetchHomeScreenData(true);
    dispatch(fetchRewardStatus());

    // Refresh data every 15 seconds
    const refreshInterval = setInterval(() => fetchHomeScreenData(false), 15000);
    return () => clearInterval(refreshInterval);
  }, []);

  // Per-second timer for the countdown clock
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      
      // LOGIC: If startTime is in the future, target startTime. If not, target endTime.
      let targetTime = 0;
      if (icoStats.startTime > 0 && now < icoStats.startTime) {
        targetTime = icoStats.startTime;
      } else if (icoStats.endTime > 0) {
        targetTime = icoStats.endTime;
      }

      if (!targetTime || targetTime <= now) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const diff = targetTime - now;
      const d = Math.floor(diff / 86400);
      const h = Math.floor((diff % 86400) / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [icoStats.startTime, icoStats.endTime]);




  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Exit", onPress: () => BackHandler.exitApp() },
          ]
        );
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );


  const handleWalletConnect = async (walletId: string) => {
    try {
      if (WALLET_METADATA[walletId]) {
        const isInstalled = await checkWalletInstalled(walletId);
        if (!isInstalled) {
          showInstallationAlert(walletId);
          return;
        }
      }

      const wallet = createWallet(walletId as WalletId);
      await connect(async () => {
        await wallet.connect({
          client: thirdwebClient,
          chain: bscTestnet_custom,
          walletConnect: {
            projectId: PROJECT_ID,
            appMetadata: {
              name: "ABCDefi",
              url: "https://abcdefi.com",
              description: "ABCDefi - Your DeFi Platform",
              logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLY6djbwpi-PHMMo0y-UaZbdAticD21Of3XQ&s",
            },
          },

        });
        return wallet;
      });
      setShowWalletModal(false);
    } catch (error) {
      console.log("Local handle error:", error);
    }
  };

  
  useEffect(() => {
     if (isConnected && chain && chain.id !== expected_chainID) {
       console.log('Wrong network:', chain.name || `Chain ${chain.id}`);
       try {
         switchChain(bscTestnet_custom);
 
       } catch (error) {
         console.error('Error switching chain:', error);
       }
     }
   }, [isConnected, chain, bscTestnet_custom, switchChain]);







  const requestStoragePermission = async () => {

  if (Platform.OS !== "android") return true;
 
   //  Android 13+
   if (Platform.Version >= 29) {
     return true; // no permission needed
   }
 const granted = await PermissionsAndroid.request(
     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
   );
 
   return granted === PermissionsAndroid.RESULTS.GRANTED;
};
const handleDownloadWhitepaper = async () => {
  try {
    const hasPermission = await requestStoragePermission();

      if (!hasPermission) {
        Alert.alert("Permission denied");
        return;
      }

      const res = await dispatch(downloadWhitepaper({})).unwrap();

      const fileName = res?.data?.[0]?.file;

      if (!fileName) {
        Alert.alert("File not found");
        return;
      }

      const fileUrl = encodeURI(IMAGE_URL + fileName);

      const { config, fs } = ReactNativeBlobUtil;

      const path = `${fs.dirs.DownloadDir}/${fileName}`;

      await config({
        fileCache: true,
        path: path, // 👈 important
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: path,
          title: fileName,
          description: "Downloading Whitepaper",
          mime: "application/pdf",
          mediaScannable: true,
        },
      }).fetch("GET", fileUrl);

      Alert.alert("Download started");

  } catch (err: any) {
    // console.log("Download error:", err);
    Alert.alert("Error", err?.message || "Download failed");
  }
};
const handleAnswer = (value: "yes" | "no") => {
  dispatch(fetchReward({ response: value }))
    .unwrap()
    .then(() => {
      dispatch(fetchRewardStatus()); // optional refresh
    });
};
const imageUrl = profileData?.image
  ? `${IMAGE_URL.replace(/\/$/, "")}/${profileData.image.replace(/^\//, "")}`
  : null;
// console.log("IMAGE_URL:", imgError,IMAGE_URL);
// console.log("FINAL URL:", IMAGE_URL + profileData?.image);
return (
<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
  <ScrollView
    contentContainerStyle={{ paddingBottom: 80 }}
    showsVerticalScrollIndicator={false}
  >

        <View style={styles.container}>

          {/* TOP GRADIENT AREA */}

          <LinearGradient
            colors={["#1A0048", "#5B2BD6", "#9F7BFF"]}
            style={styles.topSection}
          >

            {/* HEADER */}

            <View style={styles.header}>

  <TouchableOpacity
    onPress={() => navigation.navigate("SettingsScreen")}
    style={{ flexDirection: "row", alignItems: "center" }}
  >
    <FastImage

  key={imageUrl}
  source={
    imageUrl && !imgError
      ? { uri: imageUrl }
      : require("../../../assets/Images/place.jpg")
  }
  style={styles.avatar}
  onError={() => setImgError(true)}
  resizeMode="cover"

    defaultSource={require("../../../assets/Images/place.jpg")}

/>

                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.greet}>Welcome back !</Text>
                  <Text style={styles.name}>
                    {profileData?.name || user?.name || "Guest"}
                  </Text>
                </View>
              </TouchableOpacity>

  {/*  Separate bell */}
  <TouchableOpacity onPress={()=>navigation.navigate('NotificationScreen')} style={styles.bell}>
    <Icon name="notifications-outline" size={24} color="#FFF" />
  </TouchableOpacity>

            </View>


            {/* TIMER BOX */}

            <View style={styles.timerBox}>

              <View style={styles.timerTitleRow}>
                <View style={styles.line} />
                <Text style={styles.icoTitle}>
                  {Math.floor(Date.now() / 1000) < icoStats.startTime ? 'ICO Starts In' : 'ICO Ends In'}
                </Text>
                <View style={styles.line} />
              </View>


              <View style={styles.timerRow}>
                {[
                  timeLeft.days,
                  timeLeft.hours,
                  timeLeft.minutes,
                  timeLeft.seconds,
                ].map((item, i) => (
                  <View key={i} style={styles.timerItem}>
                    <View style={styles.timerCircle}>
                      <Text style={styles.timerNumber}>{item}</Text>
                    </View>

                    <Text style={styles.timerLabel}>
                      {["Days", "Hours", "Minutes", "Seconds"][i]}
                    </Text>
                  </View>
                ))}

              </View>

            </View>


            {/* CONNECT WALLET */}
            <View style={{ marginTop: 25 }}>
              {!isConnected ? (
                <TouchableOpacity
                  style={styles.connectWalletButton}
                  onPress={() => setShowWalletModal(true)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#7B3EF0", "#3F0D97"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.connectButtonGradient}
                  >
                    <Icon name="wallet-outline" size={20} color="#FFF" style={styles.walletIcon} />
                    <Text style={styles.connectButtonText}>Connect Wallet</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                // <View style={styles.connectedWalletContainer}>
                //   <View style={styles.walletInfo}>
                //     <Icon name="checkmark-circle" size={20} color="#4CAF50" />
                //     <Text style={styles.connectedText}>Connected</Text>
                //     <Text style={styles.addressText}>
                //       {`${address?.slice(0, 6)}....${address?.slice(-4)}`}
                //     </Text>
                //   </View>
                //   <TouchableOpacity
                //     style={styles.disconnectButton}
                //     onPress={() => wallet && disconnect(wallet)}
                //   >
                //     <Icon name="log-out-outline" size={18} color="#FF5252" />
                //   </TouchableOpacity>
                // </View>

                <ConnectButton
                  client={thirdwebClient}
                  chain={bscTestnet}
                  theme="dark"
                />
              )}
            </View>


            <Text style={styles.joinText}>
              Join ICO Before Timer Ends
            </Text>

          </LinearGradient>
          {/* JOIN ICO BUTTON */}

          <View style={styles.joinWrapper}>
            <TouchableOpacity onPress={() => navigation.navigate("ICO")}

              activeOpacity={0.8}>
              <LinearGradient
                colors={["#7B3EF0", "#3F0D97"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.joinGradient}

              >
                <Text style={styles.joinBtnText}>Join ICO  »</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>


          {/* TOKEN CARD */}

          <View style={styles.tokenCard}>

            <Text style={styles.limit}>Limited allocation remaining</Text>

            <View style={styles.tokenHeader}>

              <View>
                <Text style={styles.tokenTitle}>Token allocation</Text>
                <Text style={styles.tokenAmount}>
                  {`${(parseFloat(icoStats.totalCap) / 1e12).toFixed(1)} Trillion`}
                </Text>
              </View>

              <TouchableOpacity onPress={() => handleDownloadWhitepaper()} style={styles.downloadIcon}>
                <Icon name="download-outline" size={24} color={Colors.primary} />

                {/* <Text style={{fontSize:18,color:"#6A35FF"}}>⬇</Text> */}
              </TouchableOpacity>

            </View>

            <TouchableOpacity onPress={() => handleDownloadWhitepaper()} style={styles.whitePaper}>
              <Text style={{ color: "#fff", fontSize: 16, fontFamily: Fonts.medium, }}>
                Download White Paper
              </Text>
            </TouchableOpacity>

          </View>

          {/* JOIN ICO BUTTON */}

          {/* <View style={styles.joinWrapper}>

<LinearGradient
colors={["#7B3EF0","#3F0D97"]}
start={{x:0,y:0}}
end={{x:1,y:0}}
style={styles.joinGradient}
>

<Text style={styles.joinBtnText}>Join ICO  »</Text>

</LinearGradient>

</View>


{/* TOKEN CARD 

<View style={styles.tokenCard}>

<Text style={styles.limit}>Limited allocation remaining</Text>

<Text style={styles.tokenTitle}>Token allocation</Text>
<Text style={styles.tokenAmount}>1 Quadrillion</Text>

<TouchableOpacity style={styles.whitePaper}>
<Text style={{color:"#fff"}}>Download White Paper</Text>
</TouchableOpacity>

</View> */}


          {/* REWARD CARD */}
          {!rewardStatus ?
            <>
              <Image
                source={require("../../../assets/Images/trophy.png")}
                style={styles.trophy}
              />
              <View style={styles.rewardCard}>



                {/* REWARD BAR */}

                <LinearGradient
                  colors={["#A66CFF", "#6A35FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.rewardBar}
                >

                  <Text style={styles.rewardText}>Reward Points</Text>

              <View style={styles.rewardRight}>
                <Text style={styles.coin}>🪙</Text>
                <Text style={styles.points}>{rewardData?.points}</Text>
              </View>

                </LinearGradient>


                <Text style={styles.question}>
                  Do you want full control over your finances?
                </Text>

                <View style={styles.answerRow}>

                  <LinearGradient
                    colors={["#A88FE8", "#8A7BBF"]}
                    style={styles.answerBtn}
                  >
                    <TouchableOpacity onPress={() => handleAnswer("no")}>

                      <Text style={styles.answerText}>No</Text>
                    </TouchableOpacity>
                  </LinearGradient>

                  <LinearGradient
                    colors={["#C69AF7", "#B77CE8"]}
                    style={styles.answerBtn}

                  >
                    <TouchableOpacity onPress={() => handleAnswer("yes")}>
                      <Text style={styles.answerText}>Yes</Text>

                    </TouchableOpacity>
                  </LinearGradient>

                </View>

              </View>
            </> : null}



          {/* </View> */}

        </View>

      </ScrollView>

      {/* Wallet Modal */}
      <WalletModal
        visible={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onWalletConnect={handleWalletConnect}
      />

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1
  },
  tokenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10
  },

  topSection: {
    padding: 20,
    paddingBottom: 90,
    // borderBottomLeftRadius:30,
    // borderBottomRightRadius:30
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 52 / 2
  },

  greet: {
    color: "#ccc",
    fontSize: 14,
    fontFamily: Fonts.regular
  },

  name: {
    color: "#fff",
    fontSize: 20,
    fontFamily: Fonts.bold,
    fontWeight: "700"
  },

  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center"
  },


  /* TIMER BOX */

  timerBox: {
    marginTop: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    borderRadius: 22,
    padding: 20
  },

  timerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.4)"
  },

  icoTitle: {
    color: "#fff",
    marginHorizontal: 10,
    fontSize: 16,
    fontFamily: Fonts.medium,
    fontWeight: "600"
  },

  timerRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  timerItem: {
    alignItems: "center"
  },

  timerCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center"
  },

  timerNumber: {
    color: "#fff",
    fontSize: 22,
    fontFamily: Fonts.bold,
    fontWeight: "700"
  },

  timerLabel: {
    color: "#eee",
    marginTop: 6,
    fontFamily: Fonts.medium,
  },


  walletBtn: {
    backgroundColor: "rgba(255,255,255,0.25)",
    marginTop: 25,
    padding: 14,
    borderRadius: 15,
    alignItems: "center"
  },

  walletText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: Fonts.semiBold,
  },

  walletAddress: {
    color: "#fff",
    fontSize: 14,
    fontFamily: Fonts.regular,
    marginTop: 10,
    textAlign: "center",
    opacity: 0.8
  },

  joinText: {
    textAlign: "center",
    color: "#fff",
    marginTop: 20,
    fontFamily: Fonts.regular,
  },




  noBtn: {
    backgroundColor: "#E5E5E5",
    paddingHorizontal: 35,
    paddingVertical: 10,
    borderRadius: 20
  },

  yesBtn: {
    backgroundColor: "#C084FC",
    paddingHorizontal: 35,
    paddingVertical: 10,
    borderRadius: 20
  },

  rewardCard: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 25,
    top: -42,
    paddingBottom: 20,
    overflow: "hidden",
    elevation: 6,
    alignSelf: 'center',
    width: "85%",
  },

  trophy: {
    width: "90%",
    alignSelf: 'center',
    height: 260,
    marginTop: 20,
    borderRadius: 12,
  },

  rewardBar: {
    position: "absolute",
    //top:-5,
    alignSelf: "center",
    width: "95%",
    borderRadius: 40,
    paddingVertical: 13,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 6
  },

  rewardText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    fontWeight: "600"
  },

  rewardRight: {
    flexDirection: "row",
    alignItems: "center"
  },

  coin: {
    marginRight: 6
  },

  points: {
    color: "#fff",
    fontWeight: "700"
  },

  question: {
    textAlign: "center",
    marginTop: 60,
    fontSize: 18,
    fontFamily: Fonts.medium,
    fontWeight: "500",
    paddingHorizontal: 30
  },

  answerRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 25
  },

  answerBtn: {
    paddingHorizontal: 35,
    paddingVertical: 5,
    borderRadius: 12
  },

  answerText: {
    color: "#fff",
    fontSize: 16,

    fontFamily: Fonts.semiBold,
  },
  joinWrapper: {
    alignItems: "center",
    marginTop: -20,
    zIndex: 10
  },

  joinGradient: {
    paddingHorizontal: 110,
    paddingVertical: 14,
    borderRadius: 40,
    shadowColor: "#3F0D97",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    top: -40,
  },

  joinBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  },


  // tokenCard:{
  //   marginHorizontal:20,
  //   padding:22,
  //   backgroundColor:"#fff",
  //   borderRadius:22,
  //   elevation:8,
  //   marginTop:-20
  // },

  tokenCard: {
    marginHorizontal: 20,
    padding: 22,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 15, borderBottomRightRadius: 15,
    elevation: 8,
    marginTop: -60
  },



  downloadIcon: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
    alignItems: "center"
  },

  limit: {
    color: "red",
    textAlign: "center",
    fontSize: 13,
    fontFamily: Fonts.regular,
    marginTop: 10,
  },

  tokenTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    fontWeight: "600"
  },

  tokenAmount: {
    color: "#888",
    marginTop: 2,
    fontFamily: Fonts.regular,
  },

  whitePaper: {
    backgroundColor: "#6A35FF",
    padding: 14,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20
  },

  // Custom Wallet Button Styles
  connectWalletButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  connectButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  walletIcon: {
    marginRight: 8,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    fontWeight: '600',
  },
  connectedWalletContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  connectedText: {
    color: '#4CAF50',
    fontSize: 14,
    fontFamily: Fonts.medium,
    marginLeft: 8,
  },
  addressText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.regular,
    marginLeft: 12,
    opacity: 0.8,
  },
  disconnectButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});