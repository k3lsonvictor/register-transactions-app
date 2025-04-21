import { apiConfig } from '@/api/api';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';

const mockData = [
  { id: '1', tipo: 'Pix', valor: 50, data: '2024-04-20', cartao: 'Inter' },
  { id: '2', tipo: 'Crédito', valor: 120, data: '2024-04-18', cartao: 'Nubank' },
];

interface Item {
  id: number;
  title: string;
  amount: number;
  bank: string;
  date: string;
}

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item>();
  const [data, setData] = useState<Item[]>([]);

  useFocusEffect(
    useCallback(() => {
      apiConfig<Item[]>({ url: '/transactions', method: 'GET' })
        .then((data) => {
          console.log('Data fetched:', data);
          setData(data);
        })
        .catch((error) => console.error('Erro ao buscar transações:', error));
    }, [])
  );

  useEffect(() => {
    apiConfig<Item[]>({ url: '/transactions', method: 'GET' })
      .then((data) => {
        console.log('Data fetched:', data);
        setData(data)
      })
      .catch((error) => console.error(error));
  }, [modalVisible])

  const handlePress = () => {
    apiConfig({ url: `/transactions/${selectedItem?.id}`, method: 'PATCH', data: { title: selectedItem?.title, amount: selectedItem?.amount, bank: selectedItem?.bank, date: selectedItem?.date } })
      .then(() => {
        console.log('Data updated');
        setModalVisible(false);
        setSelectedItem(undefined);
      })
      .catch((error) => console.error(error));
  };

  const handleDelete = (id: number) => {
    console.log('Deletando item com id:', id);
    apiConfig({ url: `/transactions/${id}`, method: 'DELETE' })
      .then(() => {
        console.log(`Item com id ${id} deletado.`);
        setData((prevData) => prevData.filter((item) => item.id !== id)); // Remove o item do estado local
      })
      .catch((error) => console.error('Erro ao deletar transação:', error));
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
            Transações
          </Text>
          {/* <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }: { item: Item }) => (
              <Swipeable
                renderRightActions={() => renderRightActions(item.id)}
              >
                <TouchableOpacity
                  onPress={() => {
                    setSelectedItem(item); // Salva o item selecionado no state
                    setModalVisible(true);
                  }}
                  style={styles.item}
                >
                  <Text>
                    {item.title} - R${item.amount} - {item.bank}
                  </Text>
                  <Text style={styles.date}>
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                  </Text>
                </TouchableOpacity>
              </Swipeable>
            )}
          /> */}
          <SwipeListView
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedItem(item); // Salva o item selecionado no state
                  setModalVisible(true);
                }}
                style={styles.item}
                activeOpacity={1}
              >
                <Text>
                  {item.title} - R${item.amount} - {item.bank}
                </Text>
                <Text style={styles.date}>
                  {new Date(item.date).toLocaleDateString('pt-BR')}
                </Text>
              </TouchableOpacity>
            )}
            renderHiddenItem={({ item }) => (
              <TouchableOpacity
                style={styles.rowBack}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.deleteText}>Deletar</Text>
              </TouchableOpacity>
            )}
            rightOpenValue={-200} // Define o quanto o item desliza para a esquerda
            disableRightSwipe // Desativa o swipe para a direita
          // onRowOpen={(rowKey, rowMap) => {
          //   const item = data.find((d) => d.id.toString() === rowKey);
          //   if (item) {
          //     handleDelete(item.id); // Deleta o item automaticamente ao deslizar
          //   }
          // }}
          />


          <TouchableOpacity style={styles.fab}>
            <Text style={styles.fabText}>＋</Text>
          </TouchableOpacity>
          {modalVisible && selectedItem && (
            <View style={styles.modal}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Editar Transação</Text>
                <Text style={{ marginBottom: 10 }}>Tipo:</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 5,
                    padding: 10,
                    width: '100%',
                    marginBottom: 10,
                  }}
                  value={selectedItem.title}
                  onChangeText={(text) => {
                    setSelectedItem((prev) => prev ? { ...prev, title: text } : undefined);
                  }}
                />
                <Text style={{ marginBottom: 10 }}>Valor:</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 5,
                    padding: 10,
                    width: '100%',
                    marginBottom: 10,
                  }}
                  value={selectedItem.amount.toString()}
                  keyboardType="numeric"
                  onChangeText={(text) => console.log('Novo valor:', text)}
                />
                <Text style={{ marginBottom: 10 }}>Cartão:</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 5,
                    padding: 10,
                    width: '100%',
                    marginBottom: 10,
                  }}
                  value={selectedItem.bank}
                  onChangeText={(text) => console.log('Novo cartão:', text)}
                />
                <Text style={{ marginBottom: 10 }}>Data:</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 5,
                    padding: 10,
                    width: '100%',
                    marginBottom: 10,
                  }}
                  value={new Date(selectedItem.date).toLocaleDateString('pt-BR')}
                  onChangeText={(text) => console.log('Nova data:', text)}
                />
                <View style={{
                  display: 'flex',
                  width: "100%"
                }}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Fechar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => handlePress()}
                  >
                    <Text style={styles.closeButtonText}>Atualizar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  rowFront: {
    backgroundColor: '#fff',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    padding: 15,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 8,
    height: 70
  },
  rowBack: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'red',
    flex: 1,
    padding: 15,
    paddingHorizontal: 80,
    marginBottom: 10,
    borderRadius: 8,
    height: 70
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 100 },
  item: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    height: 70
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#333',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: { color: 'white', fontSize: 30 },
});