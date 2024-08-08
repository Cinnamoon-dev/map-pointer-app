/* eslint-disable no-bitwise */

import * as ExpoDevice from "expo-device"
import { useMemo, useState } from "react"
import { BleManager, Device } from "react-native-ble-plx"
import { PermissionsAndroid, Platform } from "react-native"


interface BluetoothLowEnergyApi {
    requestPermissions(): Promise<boolean>
    scanForPeripherals(): void
    allDevices: Device[]
}

function useBLE(): BluetoothLowEnergyApi {
    const bleManager = useMemo(() => new BleManager(), [])
    const [allDevices, setAllDevices] = useState<Device[]>([])

    const requestAndroid31Permissions = async () => {
        const bluetoothScanPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
                title: "Scan Permission",
                message: "App requires Bluetooth scanning",
                buttonPositive: "OK"
            }
        )

        const bluetoothConnectPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
                title: "Connection Permission",
                message: "App requires Bluetooth connecting",
                buttonPositive: "OK"
            }
        )

        const bluetoothFineLocationPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
                title: "Fine Location",
                message: "App requires fine location",
                buttonPositive: "OK"
            }
        )

        return (
            bluetoothScanPermission === "granted" &&
            bluetoothConnectPermission === "granted" &&
            bluetoothFineLocationPermission === "granted"
        )
    }

    const requestPermissions = async () => {
        if(Platform.OS === "android") {
            if((ExpoDevice.platformApiLevel ?? -1) < 31) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Location Permission",
                        message: "Bluetooth requires location",
                        buttonPositive: "OK"
                    }
                )

                return granted === PermissionsAndroid.RESULTS.GRANTED
            }
            else {
                const isAndroid31PermissionGranted = await requestAndroid31Permissions()
                return isAndroid31PermissionGranted
            }
        }
        else {
            return true
        }
    }

    const isDuplicateDevice = (devices: Device[], nextDevice: Device) => 
        devices.findIndex((device) => nextDevice.id === device.id) > -1

    const scanForPeripherals = () => {
        bleManager.startDeviceScan(null, null, (error, device) => {
            if(error) {
                console.log(error)
            }
            // TODO
            // Change here to choose ESP32 device name
            if(device && device.name?.includes("CorSense")) {
                setAllDevices((prevState) => {
                    if(!isDuplicateDevice(prevState, device)) {
                        return [...prevState, device]
                    }
                    return prevState
                })
            }
        })
    }

    return {
        scanForPeripherals,
        requestPermissions,
        allDevices
    }
}

export default useBLE;