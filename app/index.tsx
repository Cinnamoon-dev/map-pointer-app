import React, { useState } from "react";
import { Device } from "react-native-ble-plx";
import { Alert, SafeAreaView, Image, Pressable, View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import colors from "@/styles/colors"
import useBLE from "@/hooks/useBLE";

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
      <TouchableOpacity onPress={conn} style={styles0.button}>
          <Text>{props.device.id}</Text>
          <Text>{props.device.name}</Text>
      </TouchableOpacity>
  )
}

const DeviceList = (props: DeviceListProps) => {
    return(
        <ScrollView>
            { props.devices.map((device, index) => 
                <DeviceItem key={index} device={device} connectToDevice={props.connectToDevice}/>
            )}
        </ScrollView>
    )
}

const Main = () => {
  const {
    requestPermissions,
    sendCharacteristic,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    data
  } = useBLE()
  const [currentComponent, setCurrentComponent] = useState<number>(1)

  const scanForDevices = async () => {
      const isPermissionsEnabled = await requestPermissions()
      if(isPermissionsEnabled) {
          scanForPeripherals()
      }
  }

  const handleContinueButton = () => {
    sendCharacteristic("a")

    setTimeout(() => {}, 2000)
    console.log("Ponto X: ", data)

    if (data !== 'lower') {
      Alert.alert('Coordenada não recebida', 'Por favor, aponte o laser para o ponto indicado e tente novamente.');
      return;
    }

    setCurrentComponent((prevState) => prevState + 1)
  }

  return(
      <SafeAreaView>
        {currentComponent === 1 && 
          <SafeAreaView>
            <View><Text>Componente numero 1</Text></View>
            <TouchableOpacity onPress={() => setCurrentComponent((prevState) => prevState - 1)} style={styles0.button}><Text>Go Back</Text></TouchableOpacity>

            <TouchableOpacity onPress={scanForDevices} style={styles0.button}>
              <Text style={styles0.buttonText}>Scan</Text>
            </TouchableOpacity>

            <View>
              <Text style={styles0.text}>Device List</Text>
              <DeviceList devices={allDevices} connectToDevice={connectToDevice} />
            </View>

            <TouchableOpacity onPress={() => allDevices.map((device) => console.log(`${device.id}-${device.name}\n`))} style={styles0.button}>
              <Text style={styles0.buttonText}>Log Devices</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              setCurrentComponent((prevState) => prevState + 1)
            }}><Text>Next Screen</Text></TouchableOpacity>
          </SafeAreaView> 
        }
        {currentComponent === 2 && 
          <View>
            <View><Text>Componente numero 2</Text></View>
            <TouchableOpacity onPress={() => setCurrentComponent((prevState) => prevState - 1)} style={styles0.button}><Text>Go Back</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => console.log(connectedDevice)}><Text>Print current device</Text></TouchableOpacity>
          </View> 
        }
        {currentComponent === 3 &&
          <View>
            <Text style={stylesMapX.title}> Mapeamento de coordenadas </Text>
            <View style={stylesMapX.containerMap}>
              <Image
                style={stylesMapX.map}
                source={require('../assets/images/left-bottom-dot.png')}
              />
              <View style={stylesMapX.containerText}>
                <Text style={stylesMapX.text}>Mova o laser para o canto inferior esquerdo.</Text>
              </View>
            </View>
            <View style={stylesMapX.buttonContainer}>
              <Pressable
                onPress={handleContinueButton}
                style={stylesMapX.continueButton}
              >
                <Text style={stylesMapX.continueButtonText}>Continuar</Text>
              </Pressable>
            </View>
          </View>
        }
      </SafeAreaView>
  )
}

const styles0 = StyleSheet.create({
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

const stylesMapX = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  containerMap: {
    margin: 10
  },
  title: {
    color: colors.primary,
    fontSize: 25,
    fontWeight: '600',
    alignSelf: 'center'
  },
  map: {
    height: 370,
    width: '100%',
    resizeMode: 'contain',
  },
  containerText: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.quaternary,
  },
  text: {
    marginLeft: 4,
    color: colors.primary,
    fontSize: 17,
    fontWeight: '500',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: '6%'
  },
  continueButton: {
    backgroundColor: colors.primary,
    padding: 14,
    width: 120,
    borderRadius: 25,
    marginLeft: 'auto',
    marginRight: 'auto',

  },
  continueButtonText: {
    color: colors.quaternary,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
})

export default Main