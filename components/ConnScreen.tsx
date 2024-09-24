import useBLE from "@/hooks/useBLE"
import { Device } from "react-native-ble-plx";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native"
import BottomTabBar from '../components/BottomTabBar'
import colors from "@/styles/colors";
import { useContext } from "react";
import { BLEContext } from "@/app/MainScreen";


type DeviceListProps = {
  devices: Device[]
  connectToDevice: (deviceId: Device) => Promise<void>
}

type DeviceItemProps = {
  device: Device
  connectToDevice: (deviceId: Device) => Promise<void>
}

const DeviceItem = (props: DeviceItemProps) => {
  const conn = () => {
    console.log(`connecting to ${props.device.id}-${props.device.name}`)
    props.connectToDevice(props.device)
  }

  return(
      <TouchableOpacity onPress={conn} style={styles.button}>
          <Text>{props.device.id}</Text>
          <Text>{props.device.name}</Text>
      </TouchableOpacity>
  )
}

const DeviceList = (props: DeviceListProps) => {
    return(
        <ScrollView >
            { props.devices.map((device, index) => 
                <DeviceItem key={index} device={device} connectToDevice={props.connectToDevice}/>
            )}
        </ScrollView>
    )
}

const MainScreen = () => {
    const {
      requestPermissions,
      scanForPeripherals,
      allDevices,
      connectToDevice
    } = useBLE();

    const AppContext = useContext(BLEContext);

    const scanForDevices = async () => {
        const isPermissionsEnabled = await AppContext?.dataBLE.requestPermissions()
        if(isPermissionsEnabled) {
            AppContext?.dataBLE.scanForPeripherals()
        }
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.containerContent}>
                <ScrollView>
                  <TouchableOpacity onPress={scanForDevices} style={styles.button}>
                      <Text style={styles.buttonText}>Scan</Text>
                  </TouchableOpacity>

                  <View>
                      <Text style={styles.text}>Device List</Text>
                      <DeviceList devices={AppContext?.dataBLE.allDevices} connectToDevice={AppContext?.dataBLE.connectToDevice}/>
                  </View>

                  <TouchableOpacity onPress={() => AppContext?.dataBLE.allDevices.map((device) => console.log(`${device.id}-${device.name}\n`))} style={styles.button}>
                      <Text style={styles.buttonText}>Log Devices</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    AppContext?.setCurrentComponent((prevState) => prevState + 1)
                  }}><Text>Next Screen</Text></TouchableOpacity>
              </ScrollView>
            </View>
            <View style={styles.bottomTabBar}>
                <BottomTabBar />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  containerContent: {
    margin: 10,
    flex: 1,
  },
  button: {
    backgroundColor: colors.tertiary,
    padding: 14,
    width: 120,
    borderRadius: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 30,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    color: colors.primary,
    fontSize: 20,
    fontWeight: '600',
  },
  bottomTabBar: {
    width: '100%',
  },
})

export default MainScreen