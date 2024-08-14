import { Text } from "react-native";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";

export default function BookName(book_id: any) {
    const [bookName, setBookName] = useState<string>("");
    useEffect(() => {
        getBookName(book_id);
    }, []);
    async function getBookName(book_id: any) {
        const { data, error } = await supabase
            .from("books")
            .select()
            .eq("id", book_id.book_id);
        if (error) {
            console.log("error", error);
        } else {
            setBookName(data[0].title);
        }
        
    }
    return <Text>{bookName}</Text>;
}