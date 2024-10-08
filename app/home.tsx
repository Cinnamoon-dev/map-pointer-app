import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabBar from '../components/BottomTabBar'
import { useRouter } from 'expo-router';
import colors from '../styles/colors';
import useBLE from '@/hooks/useBLE'; 

const HomeScreen = () => {
  const router = useRouter();
  const { connectedDevice } = useBLE(); 

  // Handler para o botão Start Quiz
  const handleStartQuiz = () => {
    console.log("Dispositivo conectado: " , connectedDevice?.name)
    if (connectedDevice?.name != "cleitinBLE") {
      Alert.alert('Dispositivo não conectado', 'Por favor, conecte-se a um dispositivo Bluetooth antes de iniciar o quiz.');
      return;
    }
    router.push('/mapX')
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <Image
        style={styles.logo}
        source={require('../assets/images/logo-all-primary.png')} // Usando require para garantir compatibilidade com o TypeScript
      />

      <View style={styles.rulesContainer}>
        <Text style={styles.title}>Regras do Quiz</Text>
        <View style={styles.rulesList}>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleDot}>•</Text>
            <Text style={styles.ruleText}>
              Para cada pergunta respondida corretamente, você ganha 5 pontos
            </Text>
          </View>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleDot}>•</Text>
            <Text style={styles.ruleText}>
              Não há penalidade para perguntas respondidas incorretamente
            </Text>
          </View>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleDot}>•</Text>
            <Text style={styles.ruleText}>
              Você deve responder todas as perguntas
            </Text>
          </View>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleDot}>•</Text>
            <Text style={styles.ruleText}>
              Faça o seu melhor
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.startButtonContainer}>
        <Pressable
          onPress={handleStartQuiz} // Acionando a função handleStartQuiz ao pressionar o botão
          style={styles.startButton}
        >
          <Text style={styles.startButtonText}>Começar Quiz</Text>
        </Pressable>
      </View>
      </ScrollView>
      <View style={styles.bottomTabBar}>
        <BottomTabBar />
      </View>   
    </SafeAreaView>
  );
};

// Estilos usando StyleSheet para melhor performance
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: 'white',
    flex: 1,
  },
  logo: {
    height: 290,
    width: '100%',
    resizeMode: 'contain',
  },
  rulesContainer: {
    padding: 10,
  },
  title: {
    textAlign: 'center',
    color: colors.primary,
    fontSize: 22,
    fontWeight: '600',
  },
  rulesList: {
    padding: 10,
    backgroundColor: colors.quaternary,
    borderRadius: 6,
    marginTop: 15,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  ruleDot: {
    color: colors.primary,
  },
  ruleText: {
    marginLeft: 4,
    color: colors.primary,
    fontSize: 17,
    fontWeight: '500',
  },
  startButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: '6%'
  },
  startButton: {
    backgroundColor: colors.primary,
    padding: 14,
    width: 150,
    borderRadius: 25,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 30,
    marginBottom: 21,
  },
  startButtonText: {
    color: colors.quaternary,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomTabBar: {
    width: '100%',
  },
});

export default HomeScreen;
