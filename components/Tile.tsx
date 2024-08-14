import { Pressable, Text, StyleSheet } from "react-native";

type TileProps = {
    title: string;
    onPress: () => void;
    }

export default function Tile({ title, onPress } : TileProps) {
  return (
    <Pressable
      onPress={onPress}
    >
      <Text style={[styles.buttonText, {marginTop: 75}]}>{title}</Text>
    </Pressable>
  );

}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    borderColor: "black",
    borderWidth: 1,
    paddingVertical: 30,
    minWidth: '45%',
    minHeight: 150,
    marginBottom: 20,
    backgroundColor: "lightblue",
    borderRadius: 5,
    textAlign: "center",
  },
});