import { useState } from "react";
import useBLE from "@/hooks/useBLE"
import { Device } from "react-native-ble-plx";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native"

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
        <TouchableOpacity onPress={conn} style={styles.connectButton}>
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
        connectToDevice,
        connectedDevice
    } = useBLE();

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

    const scanForDevices = async () => {
        const isPermissionsEnabled = await requestPermissions()
        if(isPermissionsEnabled) {
            scanForPeripherals()
        }
    }

    const hideModal = () => {
        setIsModalVisible(false)
    }

    const openModal = async () => {
        scanForDevices()
        setIsModalVisible(true)
    }

    return(
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <TouchableOpacity onPress={scanForDevices} style={styles.scanButton}>
                    <Text>Scan</Text>
                </TouchableOpacity>

                <View>
                    <Text>Device List</Text>
                    <DeviceList devices={allDevices} connectToDevice={connectToDevice}/>
                </View>

                <TouchableOpacity onPress={() => allDevices.map((device) => console.log(`${device.id}-${device.name}\n`))} style={styles.scanButton}>
                    <Text>Log Devices</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scanButton: {
        backgroundColor: "#d4d4d4",
        padding: 10,
        borderRadius: 5,
        maxWidth: 100
    },
    connectButton: {
        backgroundColor: "#d4d4d4",
        padding: 10,
        borderRadius: 5,
        maxWidth: 300
    }
})

export default MainScreen