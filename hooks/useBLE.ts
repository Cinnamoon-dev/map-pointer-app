/* eslint-disable no-bitwise */

import * as ExpoDevice from "expo-device"
import { useMemo, useState } from "react"
import { BleError, BleManager, Characteristic, Device } from "react-native-ble-plx"
import { PermissionsAndroid, Platform } from "react-native"

import base64 from "react-native-base64"

const ESP32_UUID = "d013b1b9-1363-4eb1-8828-767c78631c27"
const ESP32_CHARACTERISTIC = "be7a367f-ed56-40e7-aea7-272614708747"
const ESP32_NAME = "cleitinBLE"

interface BluetoothLowEnergyApi {
    requestPermissions(): Promise<boolean>
    scanForPeripherals(): void
    allDevices: Device[]
    connectToDevice: (deviceId: Device) => Promise<void>
    connectedDevice: Device | null
    data: string
    setData: React.Dispatch<any>
}

function useBLE(): BluetoothLowEnergyApi {
    const bleManager = useMemo(() => new BleManager(), [])
    const [allDevices, setAllDevices] = useState<Device[]>([])
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null)
    const [heartRate, setHeartRate] = useState<number>(-1)
    const [data, setData] = useState<string>("")

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

            if(device && device.name?.includes("cleitinBLE")) {
                setAllDevices((prevState) => {
                    if(!isDuplicateDevice(prevState, device)) {
                        return [...prevState, device]
                    }
                    return prevState
                })
            }
        })
    }

    const connectToDevice = async (device: Device) => {
        try {
            const deviceConnection = await bleManager.connectToDevice(device.id)
            setConnectedDevice(deviceConnection)

            await deviceConnection.discoverAllServicesAndCharacteristics()
            console.log("connected to device")
            bleManager.stopDeviceScan()

            startStreamingData(deviceConnection)
        } catch(e) {
            console.log("ERROR IN CONNECTION", e)
        }
    }

    const onHeartRateUpdate = (
        error: BleError | null,
        characteristic: Characteristic | null
    ) => {
        if(error) {
            console.log(error)
            return
        } else if(!characteristic?.value) {
            console.log("No data received")
            return
        }

        const rawData = base64.decode(characteristic.value)
        let innerHeartRate: number = -1

        const firstBitValue: number = Number(rawData) & 0x01

        if(firstBitValue === 0) {
            innerHeartRate = 
                Number(rawData[1].charCodeAt(0) << 8) +
                Number(rawData[2].charCodeAt(2))
        }

        setHeartRate(innerHeartRate)
    }

    const onCharacteristicUpdate = (error: BleError | null, characteristic: Characteristic | null) => {
        if(error) {
            console.log(error)
            return
        }
        if(!characteristic?.value) {
            console.log("No data received")
            return
        }

        setData(characteristic.value)
    }

    const startStreamingData = (device: Device) => {
        if(device) {
            device.monitorCharacteristicForService(
                ESP32_UUID ,
                ESP32_CHARACTERISTIC,
                onCharacteristicUpdate
            )
        } else {
            console.log("No Device Connected")
        }
    }

    return {
        scanForPeripherals,
        requestPermissions,
        allDevices,
        connectToDevice,
        connectedDevice,
        data,
        setData
    }
}

export default useBLE;