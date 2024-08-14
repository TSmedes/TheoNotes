import { Text, View, StyleSheet, Pressable, FlatList } from "react-native";
import { router } from "expo-router";
import {supabase} from '../utils/supabase';
import { useEffect, useState } from "react";
import NewCategory from "@/components/NewCategory";
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


interface Category {
  id: string;
  name: string;
  page: string;
}

export default function Index() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    const { data, error } = await supabase
      .from("Categories")
      .select();
    if (error) {
      console.log("error", error);
    }
    setCategories(data || []);
    console.log(categories);
  }
  async function insertCategory(category: string) {
    const { data, error } = await supabase
      .from("Categories")
      .insert({
        name: category,
        img_url: null,
      });
    if (error) {
      console.log("error", error.message);
    }
    console.log(data);
  }

  function onClose() {
      setShowModal(false);
  }

  async function onAddCategory(category: string) {
      await insertCategory(category);
      getCategories();
      
  }
  async function deleteCategory(id: string) {
    console.log(id)
    const {data, error} = await supabase
      .from("Categories")
      .delete()
      .eq("id", id);
    if (error) {
      console.log("error", error.message);
    }
    getCategories();
  }

  return (
    <View
      style={styles.container}
    >
      <View style={styles.header}>
        <AntDesign name="pluscircle" size={24} color={categories.length > 0 ?"rgb(0,122,255)" : "transparent"}
          onPress={() => setShowModal(true)}
        />
        <Text style={{fontSize: 30, fontWeight: "bold"}}>TheoNotes</Text>
        <Feather name="edit" size={24} color={categories.length > 0 ?"rgb(0,122,255)" : "transparent"} 
          onPress={() => setEditMode(true)}
        />
      </View>
      {categories.length > 0 ? (<FlatList 
        data={categories}
        style={styles.scroll}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={{height: 100}}></View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/Categories/${item.id}`)}
          >
            <View style={styles.categoryTile}>
              <Text style={styles.buttonText}>
                {item.name}
              </Text>
              <MaterialCommunityIcons name="cross-celtic" size={48} color="black" />
            </View>
            {editMode ? (
              <View style={styles.deleteButton}>
                <Pressable
                  onPress={() => deleteCategory(item.id)}
                >
                  <AntDesign name="delete" size={32} color="rgb(255,59,48)" />
                </Pressable>
              </View>
            ) : (
              null
            )}
          </Pressable>)}
      />) : (
        <View
            style={styles.emptyCategory}
          >
            <Pressable
              onPress={() => setShowModal(true)}
            >
              <View style={{alignItems: 'center'}}>
                <AntDesign name="pluscircle" size={72} color="black" />
              </View> 
              <Text style={styles.newCategoryButton}>Add a Category</Text>
            </Pressable>
          </View>
      )}
      {editMode && categories.length > 0 && <View 
        style={styles.editCancel}
      >
        <Pressable
          onPress={() => setEditMode(false)}
        >
          <Text style={styles.editCancelText}>Exit Edit Mode</Text>
        </Pressable>
      </View>}
      <NewCategory 
        isVisible={showModal}
        onClose={onClose}
        onAddCategory={onAddCategory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 10,
    // marginTop: 75,
    // flexDirection: "column",
    // flexWrap: "wrap",
    // justifyContent: "space-around",
    // alignItems: "center",
    backgroundColor:'rgb(229,229,234)',
    // backgroundColor:'rgb(242,242,247)',
    height: "100%",
  },
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 50,
    height: 75,
    marginHorizontal: 25,
    flexDirection: "row",
  },
  scroll: {
    width: "100%",
    height: "100%",
  },
  categoryTile: {
    fontSize: 18,
    fontWeight: "bold",
    borderColor: "black",
    // borderWidth: 1,
    paddingVertical: 30,
    minWidth: '45%',
    minHeight: 150,
    margin: 20,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  newCategoryButton: {
    fontSize: 22,
    fontWeight: "bold",
    paddingTop: 30,
    minWidth: '45%',
    // minHeight: 150,
    textAlign: "center",
  },
  emptyCategory: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  editCancel: {
    position: "absolute",
    bottom: 0,
    width: '100%',
    marginBottom: 50,
    // marginHorizontal: 50,
    display: "flex",
    alignItems: "center",
  },
  editCancelText: {
    color: "black",
    overflow: "hidden",
    fontSize: 18,
    fontWeight: "bold",
    borderRadius: 20,
    backgroundColor: "red",
    width: 200,
    padding: 20,
    textAlign: "center",
  },
  deleteButton: {
    position: "absolute",
    right: 0,
    top: 0,
    margin: 35,
  }
});
 