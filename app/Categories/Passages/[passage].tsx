import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, FlatList, Pressable, Text, StyleSheet } from "react-native";
import { supabase } from "@/utils/supabase";
import NewPassage from "@/components/NewPassage";
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BookName from "@/components/BookName";

export default function Passage() {
    const { passage } = useLocalSearchParams();
    const [category, setCategory] = useState<any>([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [parentName, setParentName] = useState<string>("");
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
            .from("SubCategory")
            .select()
            .eq("id", passage);
        if (error) {
            console.log("error", error);
        }
        else {setParentName(data[0].name);}
    }
    async function getCategory() {
        const { data, error } = await supabase
            .from("Passage")
            .select()
            .eq("parent_id", passage);
        if (error) {
            console.log("error", error);
        }
        setCategory(data);
    }   

    async function insertCategory(summary: string, description: string, book: number, chapter: number, verse: number) {
        const { data, error } = await supabase
            .from("Passage")
            .insert({
                summary: summary,
                description: description,
                book_id: book,
                chapter: chapter,
                verse: verse,
                parent_id: passage,
            });
        if (error) {
            console.log("error", error.message);
        }
    }
    async function onAddPassage(summary: string, description: string, book: number, chapter: number, verse: number) {
        await insertCategory(summary, description, book, chapter, verse);
        getCategory();
    }
    async function deleteCategory(currentId: string) {
        const {data, error} = await supabase
            .from("Passage")
            .delete()
            .eq("id", currentId);
        if (error) {
            console.log("error", error.message);
        }
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
              onPress={() => router.push(`/Categories/Verse/${item.id}`)}
            >
              <View style={styles.categoryTile}>
                <Text style={styles.buttonText}>
                  {item.summary}
                </Text>
                <View style={styles.verseString}>
                    <Text style={styles.verse}>
                    <BookName book_id={item.book_id}/>
                    </Text>
                    <Text style={styles.verse}>
                        {item.chapter}{item.verse ? `:${item.verse}` : ''}
                    </Text>
                </View>
                <Text style={styles.description}>
                    {item.description}
                </Text>
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
                <Text style={styles.newCategoryButton}>Add a Scripture</Text>
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
        <NewPassage 
          isVisible={showModal}
          onClose={onClose}
          onAddPasage={onAddPassage}
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
      paddingVertical: 25,
      paddingHorizontal: 15,
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
    verse: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
      color: "rgb(142,142,147)",
      marginHorizontal: 5,
    },
    verseString: {
      flexDirection: "row",
      justifyContent: "center",
      width: "100%",
      marginVertical: 10,
    },
    description: {
      fontSize: 16,
      textAlign: "center",
      color: "black",
      marginHorizontal: 5,
      marginTop: 5,
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
   