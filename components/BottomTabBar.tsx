import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Ajuste o caminho conforme necessário
import colors from '@/styles/colors';

const BottomTabBar: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => router.push('/')} // Navega para a página index
      >
        <MaterialIcons name="bluetooth" size={24} color="#b1d4e0" />
        <Text style={styles.tabText}>Conectar ao ESP</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => router.push('/home')} // Navega para a página home
      >
        <FontAwesome5 name="gamepad" size={24} color="#b1d4e0" />
        <Text style={styles.tabText}>Quiz</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: colors.primary,
    borderTopWidth: 1.5,
    borderTopColor: colors.quaternary,
  },
  tab: {
    width:'50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.quaternary
  },
});

export default BottomTabBar;
