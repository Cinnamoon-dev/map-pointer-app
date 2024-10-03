import React, { useEffect, useState } from "react";
import { Device } from "react-native-ble-plx";
import { FlatList, Alert, SafeAreaView, Image, Pressable, View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import colors from "@/styles/colors"
import useBLE from "@/hooks/useBLE";
import questions from "@/data/questions";
import locations from "@/data/locations";
import AntDesign from "@expo/vector-icons/AntDesign";

const coordinatesPattern = new RegExp('^[1234567890]*,[1234567890]*$')
const limitsPattern = new RegExp('^[1234567890]*,[1234567890]*X[1234567890]*,[1234567890]*$')

interface Limit {
  upper_x: number
  upper_y: number
  lower_x: number
  lower_y: number
}

interface Location {
  estate: string
  upperX: number
  upperY: number
  lowerX: number
  lowerY: number
}

interface Question {
  id: number;
  question: string;
  correctAnswer: string;
  limits: Limit;
}

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

  return (
    <TouchableOpacity onPress={conn} style={styles0.button}>
      <Text>{props.device.id}</Text>
      <Text>{props.device.name}</Text>
    </TouchableOpacity>
  )
}

const DeviceList = (props: DeviceListProps) => {
  return (
    <ScrollView>
      {props.devices.map((device, index) =>
        <DeviceItem key={index} device={device} connectToDevice={props.connectToDevice} />
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
    characteristicReceived
  } = useBLE()

  const [currentComponent, setCurrentComponent] = useState<number>(1)
  const quiz: Question[] = questions;
  const estateLocations: Location[] = locations;
  const totalQuestions = quiz.length;
  const [points, setPoints] = useState<number>(0);
  const [index, setIndex] = useState<number>(0);
  const [answerStatus, setAnswerStatus] = useState<boolean | null>(null);
  const [answers, setAnswers] = useState<{ question: number; answer: boolean }[]>([]);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const progressPercentage = Math.floor((index / totalQuestions) * 100);

  const [upperLimitX, setUpperLimitX] = useState<number>(-1);
  const [upperLimitY, setUpperLimitY] = useState<number>(-1);
  const [lowerLimitX, setLowerLimitX] = useState<number>(-1);
  const [lowerLimitY, setLowerLimitY] = useState<number>(-1);

  const getLimits = () => {
    //sendCharacteristic("c")
    //setTimeout(() => {}, 200)
    //sendCharacteristic("c")
    //setTimeout(() => {}, 200)

    let i = 0
    while(limitsPattern.test(characteristicReceived) === false) {
      sendCharacteristic("c")
      setTimeout(() => {}, 200)
      console.log(i + ": " + characteristicReceived)
      i = i + 1
    }

    if (limitsPattern.test(characteristicReceived) === false) {
      Alert.alert("Não recebeu os limits")
      return
    }

    const coords = characteristicReceived.split("X").join(",").split(",")
    setLowerLimitX(parseInt(coords[0]))  
    setLowerLimitY(parseInt(coords[1]))
    setUpperLimitX(parseInt(coords[2]))
    setUpperLimitY(parseInt(coords[3]))

    console.log("u_x: ", upperLimitX)
    console.log("u_y: ", upperLimitY)
    console.log("l_x: ", lowerLimitX)
    console.log("l_y: ", lowerLimitY)
  }

  const getLimits1 = () => {
    sendCharacteristic("c")
    setTimeout(() => {}, 200)
    sendCharacteristic("c")
    setTimeout(() => {}, 200)

    if (limitsPattern.test(characteristicReceived) === false) {
      Alert.alert("Não recebeu os limits")
      return
    }

    const coords = characteristicReceived.split("X").join(",").split(",")
    setLowerLimitX(parseInt(coords[0]))  
    setLowerLimitY(parseInt(coords[1]))
    setUpperLimitX(parseInt(coords[2]))
    setUpperLimitY(parseInt(coords[3]))

    console.log("u_x: ", upperLimitX)
    console.log("u_y: ", upperLimitY)
    console.log("l_x: ", lowerLimitX)
    console.log("l_y: ", lowerLimitY)
  }

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions()
    if (isPermissionsEnabled) {
      scanForPeripherals()
    }
  }

  const handleContinueButton = () => {
    sendCharacteristic("a")

    setTimeout(() => { }, 2000)
    console.log("Ponto X: ", characteristicReceived)

    if (characteristicReceived !== 'lower') {
      Alert.alert('Coordenada não recebida', 'Por favor, aponte o laser para o ponto indicado e tente novamente.');
      return;
    }

    setCurrentComponent((prevState) => prevState + 1)
  }

  const handleBeginButton = () => {
    sendCharacteristic("b")

    setTimeout(() => { }, 2000)
    console.log("Ponto Y: ", characteristicReceived)
    console.log(characteristicReceived !== 'upper')
    console.log(!coordinatesPattern.test(characteristicReceived))

    if (characteristicReceived !== 'upper' && coordinatesPattern.test(characteristicReceived) == false) {
      Alert.alert('Coordenada não recebida', 'Por favor, aponte o laser para o ponto indicado e tente novamente.');
      return;
    }

    setCurrentComponent((prevState) => prevState + 1)
  }

  const handleVerifyAnswer = async () => {
    setIsVerifying(true);

    const isInsideSquare = (coordX: number, coordY: number) => {
      return coordX >= currentQuestion.limits.lower_x && coordX <= currentQuestion.limits.upper_x && coordY >= currentQuestion.limits.lower_y && coordY <= currentQuestion.limits.upper_y
    }

    // Pegar as coordenadas atuais do laser pointer
    // Verificar se está dentro do limite da questão atual
    sendCharacteristic("olhai cleitin")
    setTimeout(() => { }, 100)
    sendCharacteristic("olhai cleitin")
    setTimeout(() => { }, 100)

    const [coordX, coordY] = characteristicReceived.split(",") // "123,123"
    console.log(`X: ${coordX}, Y: ${coordY}`)

    const currentQuestion = questions[index];
    if (isInsideSquare(parseInt(coordX), parseInt(coordY))) {
      setPoints((prevPoints) => prevPoints + 10);
      setAnswerStatus(true);
      setAnswers((prevAnswers) => [...prevAnswers, { question: index + 1, answer: true }]);
    } else {
      setAnswerStatus(false);
      setAnswers((prevAnswers) => [...prevAnswers, { question: index + 1, answer: false }]);
    }

    setTimeout(() => { }, 5000)

    setIsVerifying(false);
  }

  const handleFinishQuiz = () => {
    setCurrentComponent((prevState) => prevState + 1)
  }

  const handleFinishButton = () => {
    setCurrentComponent(1)
  }

  useEffect(() => {
    setAnswerStatus(null);
  }, [index]);

  const currentQuestion = quiz[index];

  return (
    <SafeAreaView>
      {currentComponent === 1 &&  // Connect Device
        <SafeAreaView>
          <Text style={styles0.title}> Conexão Bluetooth </Text>
          <View style={{ marginTop: '20%' }}>
            <TouchableOpacity onPress={scanForDevices} style={styles0.button}>
              <Text style={styles0.buttonText}>Buscar Dispositivos</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: '20%' }}>
            <Text style={styles0.text}>Conectado ao Dispositivo:</Text>
            { allDevices
            ? <DeviceList devices={allDevices} connectToDevice={connectToDevice} /> 
            : <View><Text style={{ textAlign: 'center'}}>Não há dispositivos conectados</Text></View>
            } 
            
          </View>

          <TouchableOpacity onPress={() => { setCurrentComponent((prevState) => prevState + 1) }} style={styles0.continueButton}>
            <Text style={styles0.continueButtonText}>Continuar</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity onPress={() => allDevices.map((device) => console.log(`${device.id}-${device.name}\n`))} style={styles0.button}>
              <Text style={styles0.buttonText}>Log Devices</Text>
            </TouchableOpacity> */}

          {/* <TouchableOpacity onPress={() => console.log(connectedDevice)} style={styles0.button}>
              <Text style={styles0.buttonText}>Print current device</Text>
            </TouchableOpacity> */}

        </SafeAreaView>
      }
      {currentComponent === 2 && // Map lower left
        <View>
          <Text style={stylesMap.title}> Mapeamento de coordenadas </Text>
          <View style={stylesMap.containerMap}>
            <Image
              style={stylesMap.map}
              source={require('../assets/images/left-bottom-dot.png')}
            />
            <View style={stylesMap.containerText}>
              <Text style={stylesMap.text}>Mova o laser para o canto inferior esquerdo.</Text>
            </View>
          </View>
          <Pressable
            onPress={handleContinueButton}
            style={stylesMap.continueButton}
          >
            <Text style={stylesMap.continueButtonText}>Continuar</Text>
          </Pressable>
        </View>
      }
      {currentComponent === 3 && // Map top right
        <View>
          <Text style={stylesMap.title}> Mapeamento de coordenadas </Text>
          <View style={stylesMap.containerMap}>
            <Image
              style={stylesMap.map}
              source={require('../assets/images/right-top-dot.png')}
            />
            <View style={stylesMap.containerText}>
              <Text style={stylesMap.text}>Mova o laser para o canto superior direito.</Text>
            </View>
          </View>
          <Pressable
              onPress={handleBeginButton}
              style={stylesMap.continueButton}
            >
              <Text style={stylesMap.continueButtonText}>Começar</Text>
          </Pressable>
        </View>
      }
      {currentComponent === 4 && // Questions
        <View>
          <View style={stylesQuestions.header}>
            <Text style={stylesQuestions.title}>Quiz</Text>
          </View>

          <TouchableOpacity onPress={() => {
            getLimits()
          }}><Text>Get limits</Text></TouchableOpacity>

          <TouchableOpacity onPress={() => {
            getLimits1()
          }}><Text>Get limits no loop</Text></TouchableOpacity>

          <View style={stylesQuestions.progress}>
            <Text style={stylesQuestions.headerText}>Seu Progresso</Text>
            <Text style={stylesQuestions.headerText}>({index + 1}/{totalQuestions}) perguntas respondidas</Text>
          </View>

          <View style={stylesQuestions.containerProgress}>
            <Text style={[stylesQuestions.progressBar, { width: `${progressPercentage}%` }]} />
          </View>

          {/*<TouchableOpacity onPress={() => {
            sendCharacteristic("c")
            console.log(characteristicReceived)
          }}><Text>Get Limits</Text></TouchableOpacity>*/}

          <View style={stylesQuestions.questionContainer}>
            <Text style={stylesQuestions.questionText}>{currentQuestion?.question}</Text>
          </View>

          <View style={stylesQuestions.containerAnswer}>
            {answerStatus !== null && (
              <Text style={stylesQuestions.answer}>
                {answerStatus ? 'Resposta Correta' : 'Resposta Errada'}
              </Text>
            )}

            <Pressable
              onPress={handleVerifyAnswer}
              style={[stylesQuestions.button, isVerifying && stylesQuestions.disabledButton]}
              disabled={isVerifying}
            >
              <Text style={stylesQuestions.buttonText}>{isVerifying ? 'Verificando...' : 'Verificar Resposta'}</Text>
            </Pressable>

            {/* Finalizar Quiz ou Próxima Pergunta */}
            {index + 1 >= totalQuestions ? (
              <Pressable onPress={handleFinishQuiz} style={stylesQuestions.button}>
                <Text style={stylesQuestions.buttonText}>Finalizar</Text>
              </Pressable>
            ) : (
              answerStatus !== null && (
                <Pressable onPress={() => setIndex(index + 1)} style={stylesQuestions.nextQuestionButton}>
                  <Text style={stylesQuestions.nextQuestionButtonText}>Próxima Pergunta</Text>
                </Pressable>
              )
            )}
          </View>
        </View>
      }
      {currentComponent === 5 && // Resultados
        <View>
          <View style={stylesResult.containerHeader}>
            <Text style={stylesResult.title}>Suas Tentativas</Text>
          </View>

          {/*<View style={stylesResult.containerHeaderQuestions}>
            <Text>Perguntas Respondidas</Text>
            <Text>({answers.length}/6)</Text>
          </View>*/}

          <View style={stylesResult.containerQuestions}>
            <Text style={stylesResult.scoreCard}>Erros e Acertos</Text>
            <FlatList
              numColumns={2}
              data={answers}
              keyExtractor={(item, index) => index.toString()} // Adicionando um keyExtractor único
              renderItem={({ item }) => (
                <View style={stylesResult.containerResultsQuestions}>
                  <Text>{item.question}</Text>
                  {item.answer === true ? (
                    <AntDesign style={{ marginLeft: 5 }} name="checkcircle" size={20} color="green" />
                  ) : (
                    <AntDesign style={{ marginLeft: 5 }} name="closecircle" size={20} color="red" />
                  )}
                </View>
              )}
            />
            <Pressable
              onPress={handleFinishButton}
              style={stylesResult.finishButton}
            >
              <Text style={stylesResult.finishButtonText}>Voltar ao início</Text>
          </Pressable>
          </View>
        </View>
      }
    </SafeAreaView>
  )
}

const styles0 = StyleSheet.create({
  title: {
    color: colors.primary,
    fontSize: 25,
    fontWeight: '600',
    alignSelf: 'center'
  },
  searchDeviceContainer: {
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.tertiary,
    padding: 14,
    borderRadius: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: colors.primary,
    padding: 14,
    width: 120,
    borderRadius: 25,
    marginTop: '70%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  continueButtonText: {
    color: colors.quaternary,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  text: {
    marginTop: 10,
    textAlign: 'center',
    color: colors.primary,
    fontSize: 20,
    fontWeight: '600',
  }
})

const stylesMap = StyleSheet.create({
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
  continueButton: {
    backgroundColor: colors.primary,
    padding: 14,
    width: 120,
    borderRadius: 25,
    marginTop: '50%',
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


const stylesQuestions = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  title: {
    color: colors.primary,
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'center'
  },
  headerText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '500',
    alignSelf: 'center'
  },
  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  containerProgress: {
    backgroundColor: 'white',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 10,
    borderRadius: 20,
    justifyContent: 'center',
    marginTop: 20,
    marginLeft: 20,
  },
  progressBar: {
    backgroundColor: colors.tertiary,
    position: 'absolute',
    left: 0,
    height: 10,
    right: 0,
    borderRadius: 12,
    marginTop: 20,
  },
  questionContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 6,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
  },
  containerAnswer: {
    marginTop: 45,
    padding: 10,
    borderRadius: 7,
    height: 120,
  },
  answer: {
    fontSize: 17,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: colors.tertiary,
    padding: 14,
    width: 120,
    borderRadius: 25,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 30,
    marginBottom: 21,
  },
  nextQuestionButton: {
    backgroundColor: colors.primary,
    padding: 14,
    width: 120,
    borderRadius: 25,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 30,
    marginBottom: 21,
  },
  nextQuestionButtonText: {
    color: colors.quaternary,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonText: {
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  answerStatus: {
    backgroundColor: 'green',
    padding: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    borderRadius: 6,
  },
});

const stylesResult = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  containerHeader: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    color: colors.primary,
    fontSize: 25,
    fontWeight: '600',
    alignSelf: 'center'
  },
  containerHeaderQuestions: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10
  },
  containerQuestions: {
    backgroundColor: 'white',
    height: 'auto',
    borderRadius: 7,
    marginTop: 20
  },
  scoreCard: {
    color: 'black',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8
  },
  containerResultsQuestions: {
    margin: 10,
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  finishButton: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 25,
    marginTop: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  finishButtonText: {
    color: colors.quaternary,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});


export default Main