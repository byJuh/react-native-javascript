import

const saveNote = async () => {
    const storedNotes = await AsyncStorage.getItem('user_notes');
    const notes = storedNotes ? JSON.parse(storedNotes) : {};
    
    notes[selectedDate] = notes;

    await AsyncStorage.setItem('user_notes', JSON.stringify(notes));
    
    setIsModalVisible(false);
};