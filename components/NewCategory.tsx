import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal } from 'react-native';

interface NewCategoryProps {
    isVisible: boolean;
    onClose: () => void;
    onAddCategory: (category: string) => void;
}

const NewCategory: React.FC<NewCategoryProps> = ({ isVisible, onClose, onAddCategory }) => {
    const [category, setCategory] = useState('');

    const handleAddCategory = () => {
        onAddCategory(category);
        setCategory('');
        onClose();
    };

    return (
        <Modal visible={isVisible} animationType="slide">
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', height: '60%', marginTop: 100 }}>
                <Text style={{marginVertical: 10}}>Add a new category:</Text>
                <TextInput
                    style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginVertical: 15, minWidth: '65%', borderRadius: 5 }}
                    value={category}
                    onChangeText={setCategory}
                />
                <Button title="Add" onPress={handleAddCategory} />
                <Button title="Cancel" onPress={onClose} />
            </View>
        </Modal>
    );
};

export default NewCategory;