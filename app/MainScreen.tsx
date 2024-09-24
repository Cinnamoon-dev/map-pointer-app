import useBLE from "@/hooks/useBLE"
import React, { createContext, ReactNode, useState } from "react";
import { Device } from "react-native-ble-plx";
import ConnScreen from '../components/ConnScreen'
import { BluetoothLowEnergyApi } from "@/hooks/useBLE";

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
      {<ConnScreen/> && currentComponent == 0}
    </BLEProvider>
  )
}