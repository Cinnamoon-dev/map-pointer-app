import React, { useEffect, useState } from 'react';
import questions from '../data/questions';
import { StyleSheet, Text, SafeAreaView, View, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';  // Importa o router do expo-router
import colors from '@/styles/colors';

const API_KEY = 'S396c52b4baaf4bebad577f2329811f3e'; // Chave da OpenCage API

interface Question {
  id: number;
  question: string;
  correctAnswer: string;
  image: string;
}

const QuestionsScreen: React.FC = () => {
  const router = useRouter(); // Inicializa o router para navegação
  const data: Question[] = questions;
  const totalQuestions = data.length;
  const [points, setPoints] = useState<number>(0);
  const [index, setIndex] = useState<number>(0);
  const [answerStatus, setAnswerStatus] = useState<boolean | null>(null);
  const [answers, setAnswers] = useState<{ question: number; answer: boolean }[]>([]);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const progressPercentage = Math.floor((index / totalQuestions) * 100);

  // Função para buscar o estado a partir das coordenadas com parâmetros opcionais
  const fetchLocationData = async (lat: number, lon: number) => {
    try {
      const language = 'pt'; // Definindo a linguagem da resposta como português
      const addressOnly = 1; // Retorna apenas dados de endereço (excluindo POI)
      const limit = 1; // Retorna apenas um resultado

      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${API_KEY}&language=${language}&limit=${limit}&no_annotations=1&address_only=${addressOnly}`
      );
      const data = await response.json();
      if (data?.results?.length > 0) {
        const result = data.results[0];
        return result.components.state || result.components.country;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados de localização:', error);
      return null;
    }
  };

  // Função que lida com a verificação da resposta
  const handleVerifyAnswer = async () => {
    setIsVerifying(true);

    // Exemplo de coordenadas
    const lat = -23.55052; // Latitude
    const lon = -46.633308; // Longitude
    const locationName = await fetchLocationData(lat, lon);

    const currentQuestion = data[index];

    if (locationName && locationName.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()) {
      setPoints((prevPoints) => prevPoints + 10);
      setAnswerStatus(true);
      setAnswers((prevAnswers) => [...prevAnswers, { question: index + 1, answer: true }]);
    } else {
      setAnswerStatus(false);
      setAnswers((prevAnswers) => [...prevAnswers, { question: index + 1, answer: false }]);
    }
    setIsVerifying(false);
  };

  useEffect(() => {
    setAnswerStatus(null);
  }, [index]);

  // Função para finalizar o quiz e navegar para a tela de resultados
  const handleFinishQuiz = () => {
    router.push({
      pathname: '/result',
      params: {
        points: points,                // Passa a pontuação total
        answers: JSON.stringify(answers),  // Serializa o array de respostas para string JSON
      },
    });
  };

  const currentQuestion = data[index];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quiz</Text>
      </View>

      <View style={styles.progress}>
        <Text style={styles.headerText}>Seu Progresso</Text>
        <Text style={styles.headerText}>({index + 1}/{totalQuestions}) perguntas respondidas</Text>
      </View>

      <View style={styles.containerProgress}>
        <Text style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion?.question}</Text>
        {currentQuestion?.image && (
          <Image 
          style={styles.map} 
          source={{ uri: currentQuestion.image }} 
        />
        )}
      </View>

      <View style={styles.containerAnswer}>
        {answerStatus !== null && (
          <Text style={styles.answer}>
            {answerStatus ? 'Resposta Correta' : 'Resposta Errada'}
          </Text>
        )}

        <Pressable
          onPress={handleVerifyAnswer}
          style={[styles.button, isVerifying && styles.disabledButton]}
          disabled={isVerifying}
        >
          <Text style={styles.buttonText}>{isVerifying ? 'Verificando...' : 'Verificar Resposta'}</Text>
        </Pressable>

        {/* Finalizar Quiz ou Próxima Pergunta */}
        {index + 1 >= totalQuestions ? (
          <Pressable onPress={handleFinishQuiz} style={styles.button}>
            <Text style={styles.buttonText}>Finalizar</Text>
          </Pressable>
        ) : (
          answerStatus !== null && (
            <Pressable onPress={() => setIndex(index + 1)} style={styles.button}>
              <Text style={styles.buttonText}>Próxima Pergunta</Text>
            </Pressable>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

export default QuestionsScreen;

const styles = StyleSheet.create({
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
