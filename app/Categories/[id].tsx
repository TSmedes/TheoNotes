import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, FlatList, Pressable, Text, StyleSheet } from "react-native";
import { supabase } from "@/utils/supabase";
import NewCategory from "@/components/NewCategory";
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Category() {
    const { id } = useLocalSearchParams();
    const [category, setCategory] = useState<any>([]);
    const [parentName, setParentName] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        getParentName();
        navigation.setOptions({ title: parentName && parentName.length > 0 ? parentName : "" });
        
        
    }, [navigation, parentName]);

    useEffect(() => {
        getCategory();
    }, []);

    async function getParentName() {
        const { data, error } = await supabase
            .from("Categories")
            .select()
            .eq("id", id);
        if (error) {
            console.log("error", error);
        }
        else {setParentName(data[0].name);}
    }
        
    async function getCategory() {
        const { data, error } = await supabase
            .from("SubCategory")
            .select()
            .eq("parent_id", id);
        if (error) {
            console.log("error", error);
        }
        setCategory(data);
    }   

    async function insertCategory(category: string) {
        const { data, error } = await supabase
            .from("SubCategory")
            .insert({
                name: category,
                parent_id: id,
            });
        if (error) {
            console.log("error", error.message);
        }
        console.log(data);
    }
    async function onAddCategory(category: string) {
        await insertCategory(category);
        getCategory();
    }
    async function deleteCategory(currentId: string) {
        console.log(currentId)
        const {data, error} = await supabase
            .from("SubCategory")
            .delete()
            .eq("id", currentId);
        if (error) {
            console.log("error", error.message);
        }
        console.log(data);
        getCategory();
    }
    function onClose() {
        setShowModal(false);
    }

    return (
        <View
        style={styles.container}
      >
        <View style={styles.header}>
          <AntDesign name="pluscircle" size={24} color={category && category.length > 0 ?"rgb(0,122,255)" : "transparent"}
            onPress={() => setShowModal(true)}
          />
          <Text style={{fontSize: 30, fontWeight: "bold"}}></Text>
          <Feather name="edit" size={24} color={category && category.length > 0 ?"rgb(0,122,255)" : "transparent"} 
            onPress={() => setEditMode(true)}
          />
        </View>
        {category && category.length > 0 ? (<FlatList 
          data={category}
          style={styles.scroll}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={{height: 100}}></View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/Categories/Passages/${item.id}`)}
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
        {editMode && category && category.length > 0 && <View 
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
   