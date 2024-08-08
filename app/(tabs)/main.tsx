import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import useBLE from "@/hooks/useBLE"
import { useState } from "react";

const MainScreen = () => {
    const {
        requestPermissions,
        scanForPeripherals,
        allDevices
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
            <TouchableOpacity onPress={openModal}>
                <Text>Connect</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 100
    }
})

export default MainScreen