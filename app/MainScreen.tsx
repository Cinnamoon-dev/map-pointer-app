import useBLE from "@/hooks/useBLE"
import React, { createContext, ReactNode, useState } from "react";
import { Device } from "react-native-ble-plx";
import ConnScreen from '../components/ConnScreen'
import { BluetoothLowEnergyApi } from "@/hooks/useBLE";
import { SafeAreaView, View, Text } from "react-native";

type BLEContextType = {
  dataBLE: BluetoothLowEnergyApi
  currentComponent: number
  setCurrentComponent: React.Dispatch<React.SetStateAction<number>>
}

type BLEProviderProps = {
  children: ReactNode
  currentComponent: number
  setCurrentComponent: React.Dispatch<React.SetStateAction<number>>
}

export const BLEContext = createContext<BLEContextType | undefined>(undefined);

const BLEProvider: React.FC<BLEProviderProps> = ({ children, currentComponent, setCurrentComponent }) => {
  const dataBLE = useBLE();
  
  return (
    <BLEContext.Provider value={{dataBLE, currentComponent, setCurrentComponent}}>
      {children}
    </BLEContext.Provider>
  )
}

const Main = () => {
  const [currentComponent, setCurrentComponent] = useState<number>(0)

  return(
    <BLEProvider currentComponent={currentComponent} setCurrentComponent={setCurrentComponent}>
      <View>
        {<ConnScreen/> && currentComponent == 0}
        {<SafeAreaView><View><Text>FOI</Text></View></SafeAreaView> && currentComponent == 1}
      </View>
    </BLEProvider>
  )
}

export default Main