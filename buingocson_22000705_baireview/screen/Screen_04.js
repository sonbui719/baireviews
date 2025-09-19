import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
//import mongoService from "../service/mongoService";

const Screen_04 = ({ route, navigation }) => {
  const { medicine } = route.params;
  const [name, setName] = useState(medicine.name);
  const [price, setPrice] = useState(String(medicine.price));
  const [image, setImage] = useState(medicine.image);
  const [star, setStar] = useState(String(medicine.star));
  const [description, setDescription] = useState(medicine.description);

  const updateMedicine = async () => {
    try {
      await mongoService.update(medicine._id, {
        name,
        price: Number(price),
        image,
        star: Number(star),
        description,
      });
      Alert.alert("Thành công", "Cập nhật thuốc thành công");
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể cập nhật");
    }
  };

  const deleteMedicine = async () => {
    try {
      await mongoService.remove(medicine._id);
      Alert.alert("Thành công", "Đã xoá thuốc");
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể xoá");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tên thuốc</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />

      <Text style={styles.label}>Giá</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Ảnh</Text>
      <TextInput value={image} onChangeText={setImage} style={styles.input} />

      <Text style={styles.label}>Số sao</Text>
      <TextInput
        value={star}
        onChangeText={setStar}
        style={styles.input}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <View style={styles.buttonRow}>
        <Button title="Cập nhật" onPress={updateMedicine} />
        <Button title="Xoá" color="red" onPress={deleteMedicine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { marginTop: 10, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginTop: 5,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default Screen_04;