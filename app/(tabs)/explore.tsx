import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { apiConfig } from '@/api/api';

// Defina os tipos das rotas
type TabParamList = {
  index: undefined; // Tela "Transações"
  explore: undefined; // Tela "Nova Transação"
};

export default function TransactionForm() {
  // Tipando o useNavigation
  const navigation = useNavigation<NavigationProp<TabParamList>>();

  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<number>();
  const [bank, setBank] = useState<string>();
  const [date, setate] = useState(new Date().toISOString().slice(0, 10));

  const salvar = () => {
    console.log({ title, amount, bank, date });
    apiConfig({ url: '/transactions', method: 'POST', data: { title, amount, bank } })
      .then((response) => {
        console.log('date saved:', response);
        setTitle('');
        setAmount(undefined);
        setBank('');
        setate(new Date().toISOString().slice(0, 10));
        navigation.navigate('index'); // Agora o TypeScript reconhece "index" como válido
      })
      .catch((error) => {
        console.error('Erro ao salvar transação:', error);
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 20,
            }}
          >
            Nova Transação
          </Text>
          <TextInput
            placeholder="title (Pix, Crédito...)"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="amount"
            keyboardType="numeric"
            value={amount?.toString() || ''}
            onChangeText={(text) => setAmount(text ? parseFloat(text) : undefined)}
            style={styles.input}
          />
          <TextInput
            placeholder="Cartão"
            value={bank}
            onChangeText={setBank}
            style={styles.input}
          />
          <TextInput
            placeholder="date"
            value={date}
            onChangeText={setate}
            style={styles.input}
          />
          <Button title="Salvar" onPress={salvar} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 100 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
});