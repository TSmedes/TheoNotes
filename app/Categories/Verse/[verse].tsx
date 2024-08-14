import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, ScrollView, Pressable, Text, StyleSheet } from "react-native";
import { supabase } from "@/utils/supabase";
import NewPassage from "@/components/NewPassage";
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BookName from "@/components/BookName";

export default function Category() {
    const { verse } = useLocalSearchParams();
    const [passage, setPassage] = useState<any>([]);
    const [summary, setSummary] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [book, setBook] = useState<number>(0);
    const [chapter, setChapter] = useState<string>("");
    const [verseNumber, setVerseNumber] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [parentName, setParentName] = useState<string>("");
    const navigation = useNavigation();

    // useEffect(() => {
    //     getParentName();
    //     navigation.setOptions({ title: parentName && parentName.length > 0 ? parentName : "" });
        
    // }, [navigation, parentName]);

    useEffect(() => {
        getPassage();
        // console.log(passage);
    }, []);
    useEffect(() => {

      if(passage) {
        console.log('suc',passage)
        setSummary(passage.summary);
        setDescription(passage.description);
        setBook(passage.book_id);
        setChapter(passage.chapter);
        setVerseNumber(passage.verse);
        console.log(verse)
      }
        
    }, [passage]);


    async function getParentName() {
        const { data, error } = await supabase
            .from("SubCategory")
            .select()
            .eq("id", verse);
        if (error) {
            console.log("error", error);
        }
        else {setParentName(data[0].name);}
    }
    async function getPassage() {
      setLoading(true);
        const { data, error } = await supabase
            .from("Passage")
            .select()
            .eq("id", verse);
        if (error) {
            console.log("error", error);
        }
        setPassage(data);
        // console.log(passage)
        setLoading(false);
    }   
    async function deleteCategory(currentId: string) {
        const {data, error} = await supabase
            .from("Passage")
            .delete()
            .eq("id", currentId);
        if (error) {
            console.log("error", error.message);
        }
        getPassage();
    }
    function onClose() {
        setShowModal(false);
    }
    return (
        <View
        style={styles.container}
      >
        {loading ? (
          <Text style={styles.loading}>Loading...</Text>) : passage ? (
          <View style={styles.categoryTile}>
            <View style={styles.header}>
              <AntDesign name="pluscircle" size={24} color={"transparent"}/>
              <Text style={styles.summaryTile}>{summary}</Text>
              <Feather name="edit" size={24} color={"rgb(0,122,255)"} 
                onPress={() => setEditMode(true)}
              />
            </View>
            <View style={styles.verseString}>
              <Text style={styles.verse}>
                {/* <BookName book_id={passage?._j[0].book_id} /> */}
              </Text>
              {/* <Text style={styles.verse}>{passage?._j[0].chapter}:{passage?._j[0].verse}</Text> */}
            </View>
            {/* <Text style={styles.description}>{passage?._j[0].description}</Text> */}
          </View>
          ) : (
            <View style={styles.emptyCategory}>
              <Text style={styles.loading}>No Passage Found</Text>
            </View>
          )}
          
          

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
    loading: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginVertical: 20,
    },
    header: {
      alignItems: "center",
      justifyContent: "space-between",
      height: 75,
      marginHorizontal: 25,
      flexDirection: "row",
      width: "100%",
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
      paddingBottom: 25,
      paddingHorizontal: 15,
      minWidth: '100%',
      minHeight: 150,
      height: '100%',
      margin: 0,
      overflow: "hidden",
      backgroundColor: "#ffffff",
      borderRadius: 20,
      textAlign: "center",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    buttonText: {
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
    },
    summaryTile: {
      fontSize: 26,
      fontWeight: "bold",
      textAlign: "center",
      marginHorizontal: 5,
      // borderWidth: 1,
      // borderColor: "white",
      borderBottomColor: "black",
      // marginBottom: 20,
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
      fontSize: 20,
      textAlign: "center",
      color: "black",
      marginHorizontal: 5,
      marginVertical: 20,
      backgroundColor: 'rgb(242,242,247)',
      padding: 10,
      borderRadius: 10,
      overflow: "hidden",
      borderWidth: 0.3,
      borderColor: "rgb(142,142,147)",
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
   