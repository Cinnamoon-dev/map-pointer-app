import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import useBLE from "@/hooks/useBLE"
import { useState } from "react";
import { Device } from "react-native-ble-plx";

type DeviceListProps = {
    devices: Device[]
}

const DeviceList = (props: DeviceListProps) => {
    return(
        <View>
            { props.devices.map((device) => 
                <View>
                    <Text>{device.id}</Text>
                    <Text>{device.name}</Text>
                </View>
            )}
        </View>
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
        <View style={styles.container}>
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    connectButton: {
        backgroundColor: "#d4d4d4",
        padding: 10,
        borderRadius: 5,
    }
})

export default MainScreen