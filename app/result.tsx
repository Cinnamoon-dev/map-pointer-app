// src/screens/ResultScreen.tsx

import { StyleSheet, Text, View, SafeAreaView, Pressable, FlatList } from 'react-native';
import React from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import colors from '@/styles/colors'
import AntDesign from '@expo/vector-icons/AntDesign';
import { RootStackParamList } from '../types/types'; // Ajuste o caminho conforme necessário

const ResultScreen: React.FC = () => {
  // Defina o tipo para `route` usando RouteProp
  const route = useRoute<RouteProp<RootStackParamList, 'Result'>>();

  // Garantir que route.params está definido
  const points = route.params?.points ?? 0;
  const answers = route.params?.answers ? JSON.parse(route.params.answers) : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerHeader}>
        <Text style={styles.title}>Seus Resultados</Text>
      </View>

      <View style={styles.containerHeaderQuestions}>
        <Text>Perguntas Respondidas</Text>
        <Text>({answers.length}/12)</Text>
      </View>

      <View style={styles.containerQuestions}>
        <Text style={styles.scoreCard}>Erros e Acertos</Text>
        <FlatList
          numColumns={2}
          data={answers}
          keyExtractor={(item, index) => index.toString()} // Adicionando um keyExtractor único
          renderItem={({ item }) => (
            <View style={styles.containerResultsQuestions}>
              <Text>{item.question}</Text>
              {item.answer === true ? (
                <AntDesign style={{ marginLeft: 5 }} name="checkcircle" size={20} color="green" />
              ) : (
                <AntDesign style={{ marginLeft: 5 }} name="closecircle" size={20} color="red" />
              )}
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  container: {
    flex:1,
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
  }
});
