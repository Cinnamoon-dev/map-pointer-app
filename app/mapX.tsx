import { StyleSheet, Pressable, Image, View, Text, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '@/styles/colors'
import { useRouter } from 'expo-router'
import base64 from "react-native-base64";
import useBLE from "@/hooks/useBLE"


//Implementar recebimento do ponto x recebido pelo esp para realizar o cálculo de escala do mapa utilizado

const map = () => {
  const router = useRouter();
  const coordenateX = ''
  const {connectedDevice} = useBLE();
  const ESP32_UUID = "d013b1b9-1363-4eb1-8828-767c78631c27"
  const ESP32_CHARACTERISTIC = "be7a367f-ed56-40e7-aea7-272614708747"

  // Handler para o botão Start Quiz
  const handleContinueButton = () => {
    if (coordenateX == '') {
      Alert.alert('Coordenada não recebida', 'Por favor, aponte o laser para o ponto indicado e tente novamente.');
      //return;
    }
    connectedDevice?.writeCharacteristicWithResponseForService(ESP32_UUID, ESP32_CHARACTERISTIC, base64.encode(coordenateX))
    router.push('/mapY')
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}> Mapeamento de coordenadas </Text>
      <View style={styles.containerMap}>
        <Image
          style={styles.map}
          source={require('../assets/images/left-bottom-dot.png')}
        />
        <View style={styles.containerText}>
          <Text style={styles.text}>Mova o laser para o canto inferior esquerdo.</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress= {handleContinueButton}
          style={styles.continueButton}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default map

const styles = StyleSheet.create({
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
