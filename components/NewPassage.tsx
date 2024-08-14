import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Modal } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import { supabase } from '@/utils/supabase';

interface NewPassageProps {
    isVisible: boolean;
    onClose: () => void;
    onAddPasage: (summary: string, description:string, book: number, chapter: number, verse: number) => void;
}

const NewPassage: React.FC<NewPassageProps> = ({ isVisible, onClose, onAddPasage }) => {
    const [summary, setSummary] = useState('');
    const [description, setDescription] = useState('');
    const [books, setBooks] = useState<any[]>([{key: '0', value: ''}]);
    const [book, setBook] = useState<any>();
    const [chapter, setChapter] = useState<any>();
    const [verse, setVerse] = useState<any>();

    useEffect(() => {
        getBooks();
    }, []);

    const handleAddCategory = () => {
        onAddPasage(summary, description, book, chapter, verse);
        setSummary('');
        setDescription('');
        setChapter('');
        setVerse('');
        setBook('');
        onClose();
    };

    async function getBooks() {
        const { data, error } = await supabase
            .from("books")
            .select();
        if (error) {
            console.log("error", error);
        }
        let newBooks = data?.map((book: any) => ({ key: book.id, value: book.title }))
        setBooks(books.concat(newBooks));
    }

    return (
        <Modal visible={isVisible} animationType="slide">
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', height: '60%', marginTop: 100 }}>
                <Text style={{marginVertical: 10}}>Add a new passage:</Text>
                <TextInput
                    style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginVertical: 15, minWidth: '65%', borderRadius: 5 }}
                    value={summary}
                    placeholder='Summary'
                    onChangeText={setSummary}
                />
                <TextInput
                    style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginVertical: 15, minWidth: '65%', borderRadius: 5 }}
                    value={description}
                    placeholder='Description'
                    onChangeText={setDescription}
                />
                <SelectList 
                    data={books}
                    setSelected={(val:any)=>setBook(val)}
                    save='key'
                    placeholder='Select a book from the bible'
                    boxStyles={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginVertical: 15, minWidth: '65%', borderRadius: 5 }}
                />
                <View
                    style={{ flexDirection: 'row', justifyContent: 'space-between', width: '65%', marginBottom: 15 }}
                >
                    <TextInput
                        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginVertical: 15, borderRadius: 5, flex: 1, }}
                        value={chapter}
                        placeholder='Chapter'
                        onChangeText={setChapter}
                        keyboardType='numeric'
                    />
                    <TextInput
                        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginVertical: 15, marginHorizontal: 10, borderRadius: 5, flex: 1, }}
                        value={verse}
                        placeholder='Verse'
                        onChangeText={setVerse}
                        keyboardType='numeric'
                    />
                </View>
                
                <Button title="Add" onPress={handleAddCategory} />
                <Button title="Cancel" onPress={onClose} />
            </View>
        </Modal>
    );
};

export default NewPassage;