import { useState } from "react";
import useBLE from "@/hooks/useBLE"
import { Device } from "react-native-ble-plx";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native"

type DeviceListProps = {
    devices: Device[]
}

const DeviceList = (props: DeviceListProps) => {
    return(
        <ScrollView >
            { props.devices.map((device) => 
                <View>
                    <Text>{device.id}</Text>
                    <Text>{device.name}</Text>
                </View>
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
                <TouchableOpacity onPress={openModal} style={styles.connectButton}>
                    <Text>Connect</Text>
                </TouchableOpacity>

                <View>
                    <Text>Device List</Text>
                    <DeviceList devices={allDevices}/>
                </View>

                <TouchableOpacity onPress={() => console.log(allDevices)} style={styles.connectButton}>
                    <Text>Show Devices</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    connectButton: {
        backgroundColor: "#d4d4d4",
        padding: 10,
        borderRadius: 5,
    }
})

export default MainScreen