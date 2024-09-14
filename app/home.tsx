import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../styles/colors';
// Importar hook para BLE (adapte conforme sua implementação)
import useBLE from '@/hooks/useBLE'; // Ajuste o caminho conforme necessário

const HomeScreen: React.FC = () => {
  const { connectedDevice } = useBLE(); // Desestruturar o estado de dispositivo conectado do hook useBLE

  // Handler para o botão Start Quiz
  const handleStartQuiz = () => {
    if (!connectedDevice) {
      Alert.alert('Dispositivo não conectado', 'Por favor, conecte-se a um dispositivo Bluetooth antes de iniciar o quiz.');
      return;
    } 
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../assets/images/logo.png')} // Usando require para garantir compatibilidade com o TypeScript
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

      <Pressable
        onPress={handleStartQuiz} // Acionando a função handleStartQuiz ao pressionar o botão
        style={styles.startButton}
      >
        <Text style={styles.startButtonText}>Start Quiz</Text>
      </Pressable>
    </SafeAreaView>
  );
};

// Estilos usando StyleSheet para melhor performance
const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    backgroundColor: 'white'
  },
  logo: {
    height: 370,
    width: '100%',
    resizeMode: 'contain',
  },
  rulesContainer: {
    padding: 10,
  },
  title: {
    textAlign: 'center',
    color: colors.primary,
    fontSize: 20,
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
    fontSize: 15,
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: colors.primary,
    padding: 14,
    width: 120,
    borderRadius: 25,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 30,
  },
  startButtonText: {
    color: colors.quaternary,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default HomeScreen;
