import moment from 'moment/moment';
import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import 'moment/locale/pt-br';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMap } from '@fortawesome/free-regular-svg-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Modal, FlatList } from 'react-native';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

let currentDate = moment().format('YYYY-MM-DD');
let currentDateCursive = moment().locale('pt-br').format('DD [de] MMMM [de] YYYY');

export default function TelaPrincipal(){

    const navigation = useNavigation();

    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [notes, setNotes] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalNotaVisible, setIsModalNotaVisible] = useState(false);
    const [inputText, setInputText] = useState('');
    const [pdfList, setPdfList] = useState([]);

    

    const openModal = (date) => {
        setIsModalVisible(true);
    };

    const salvarData = (date) => {
        setSelectedDate(date);
        setInputText(notes[date] || '');

        if(notes[date]){
            setIsModalNotaVisible(true);
        }

        setInputText('');
    }
    
    const saveNote = () => {
        setNotes((prevNotes) => ({
            ...prevNotes,
            [selectedDate]: [...(prevNotes[selectedDate] || []), inputText],
        }));
        setIsModalVisible(false);
    };

    const receituario = async () => {
        navigation.navigate('Receituario');
        const pdfListString = await AsyncStorage.getItem('pdfList');
        if (pdfListString) {
            setPdfList(JSON.parse(pdfListString)); // Transforma em objeto
        }
    }

    return(
        <View style={styles.container}>
            <View style={styles.areaLogo}> 
                <Image source={require('../assets/logo.png')}/>
            </View>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.calendarCard}>
                    <View style ={styles.clnd}>
                        <Calendar
                            style={styles.calendario}
                            onDayPress={(day) => salvarData(day.dateString)}
                            markedDates={{
                            ...Object.keys(notes).reduce((acc, date) => {
                                acc[date] = { marked: true, dotColor: 'blue' };
                                return acc;
                            }, {}),
                            [selectedDate]: { selected: true, selectedColor: 'orange' },
                            }}
                        />
                        <TouchableOpacity 
                            style={styles.btnAdd} 
                            onPress={(day) => openModal(day.dateString)}
                        >
                            <View style ={styles.btnContainer}>
                                
                                <FontAwesomeIcon icon={faCirclePlus} size={40} style={{color: "#63E6BE"}} />
                                <Text style ={styles.btnTexto}> Adicionar Nota na Data Selecionada </Text>

                            </View>    
                        </TouchableOpacity>
                    </View>
                </View>
                
                <Modal visible={isModalVisible} transparent={true} animationType="slide">
                    <View style={styles.modalBackground}>
                        <View style={styles.centeredView}>
                            <Text style={styles.modalTitle}>Adicionar Nota em {moment(selectedDate).format('DD/MM/YYYY')}</Text>
                                <TextInput
                                    style={styles.input}
                                    multiline = {true}
                                    autoCorrect = {true}
                                    value={inputText}
                                    onChangeText={setInputText}               
                                    placeholder={'Escreva aqui...'}
                                    placeholderTextColor={'#989898'}
                                />
                            
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity 
                                    style={styles.btnModal}
                                    onPress={saveNote}
                                >
                                    <Text style={styles.textoModal}> Salvar </Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={styles.btnModal}
                                    onPress={() => {setIsModalVisible(false); setInputText("")}}
                                >
                                    <Text style={styles.textoModal}> Cancelar </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {notes[selectedDate] && (
                    <Modal visible={isModalNotaVisible} transparent={true} animationType="slide">
                        <View style={styles.modalBackground}>
                                <View style={styles.centeredView}>
                                    <Text style={styles.modalTitle}> Notas em {moment(selectedDate).format('DD/MM/YYYY')}</Text>

                                    <FlatList
                                        data={notes[selectedDate]} // Array de notas para a data selecionada
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <Text style={styles.noteItem}>{item}</Text>
                                        )}
                                    />

                                    <TouchableOpacity 
                                        style={styles.btnModal}
                                        onPress={() => setIsModalNotaVisible(false)}
                                    >
                                        <Text style={styles.textoModal}> Fechar </Text>
                                    </TouchableOpacity>
                                </View>
                        </View>
                    </Modal>
                )}
                
                <View style={styles.firstCard}>
                    <View style={styles.areaData}>
                        <Text style={styles.texto}> Remédios do Dia </Text>
                        <Text style={styles.textoData}> {currentDateCursive} </Text>
                    </View>
                    
                    <TouchableOpacity style={styles.btnAbrir}>
                        <Text style={styles.textoAbrir}> Abrir </Text>
                    </TouchableOpacity>
                    <View style={styles.secondCard}>
                    
                    </View> 
                </View>

                <View style={styles.firstCard} >
                        
                    <Text style={styles.textoReceita}> Receituário </Text>
                        
                    <TouchableOpacity 
                        style={styles.btnAbrirReceita}
                        onPress={receituario}
                    >
                        <Text style={styles.textoAbrir}> Abrir </Text>
                    </TouchableOpacity>
                    <View style={styles.secondCard}>
                        <View style={{ alignItems: 'center'}}>
                            <FlatList
                                data={pdfList}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => _openPdf(item.uri)}>
                                        <Text style={styles.pdfItem}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View> 
                </View>

                <View style={styles.firstCard} >
                        
                    <View style={styles.areaFarmacias}>
                        <FontAwesomeIcon icon={faMap} size={30} style={styles.icon}/>
                        <Text style={styles.textoFarmacias}> Farmácias Próximas </Text>   
                    </View>
                    

                    <View style={styles.secondCard}>
                        
                    </View> 
                  </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center'
    },
    areaLogo:{
        width: 410,
        height: 110,
        elevation: 5,
        borderBottomLeftRadius: 57,
        borderBottomRightRadius: 57,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    clnd:{
        justifyContent: 'center',
        marginTop: 60
    },
    calendario:{
        width: 320,
        height: 100,
        justifyContent: 'center',
        borderRadius: 57,
        margin: 20,
    },
    calendarCard:{
        backgroundColor: '#fff',
        width: 364,
        height: 400,
        elevation: 5,
        borderRadius: 57,
        borderWidth: 1,
        justifyContent: 'center',
        marginBottom: 50
    },
    btnAdd:{
        marginTop: 100,
        marginLeft: -20,
        width: 400,
    },
    btnTexto:{
        marginTop: 10,
        marginLeft: 10,
        fontSize: 15,
        fontWeight: 'bold',
        fontStyle: 'italic',
        textDecorationLine: 'underline'
    },
    btnContainer:{
        flexDirection: 'row',
        justifyContent: 'center'
    },
    firstCard:{
        backgroundColor: '#fff',
        width: 364,
        height: 290,
        elevation: 5,
        borderRadius: 57,
        borderWidth: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 50
    },
    secondCard:{
        backgroundColor: '#fff',
        width: 362,
        height: 239,
        elevation: 5,
        borderBottomLeftRadius: 57,
        borderBottomRightRadius: 57,
        position: 'absolute',
        top: 50,
        borderWidth: 1
    },
    scroll:{
        flexDirection: 'column',
        alignContent: 'center',
        paddingTop: 35
    },
    texto:{
        fontSize: 20,
        color: '#222B45',
    },
    btnAbrir:{
        width: 54,
        height: 24,
        backgroundColor: '#0097B2',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        marginTop: 12,
        marginLeft: 15
    },
    textoAbrir:{
        color:'#fff'
    },
    textoData:{
        fontSize: 12,
        color: '#8F9BB3'
    },
    areaData:{
        flexDirection: 'column',
        alignItems: 'center',
        margin: 2,
        marginLeft: 50
    },
    textoReceita:{
        fontSize: 24,
        color: '#222B45',
        marginTop: 10,
        marginLeft: 60,
        marginRight: 10
    },
    btnAbrirReceita:{
        width: 54,
        height: 24,
        backgroundColor: '#B20000',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        marginTop: 16,
        marginLeft: 15
    },
    areaFarmacias:{
        flexDirection: 'row',
        justifyContent:'center'
    },
    icon:{
        marginTop: 13,
        margin: 10,
        marginLeft: 30,
        color: '#222B45'
    },
    textoFarmacias:{
        fontSize: 24,
        color: '#222B45',
        marginTop: 10,
        marginRight: 10
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
        marginTop: 20,
        color: 'black',
    },
    input:{
        width: 264,
        height: 200,
        backgroundColor: '#E0E0E0',
        borderColor: '#CDF8FF',
        borderRadius: 8,
        borderWidth: 1,
        margin: 10,
        fontSize: 15,
        padding: 10
      },
    noteContainer: {
        marginTop: 20,
    },
    centeredView: {
        height: 457,
        width: 338,
        borderRadius: 57,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoModal:{
        color: 'white',
        fontSize: 16
    },
    btnModal:{
        width: 90,
        height: 40,
        backgroundColor: '#00B383',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    noteItem: {
        fontSize: 20,
        justifyContent: 'center',
        alignSelf: 'center',
        margin: 10
    },
    pdfItem: {
        color: '#007BFF',
        fontSize: 20,
    },
})

LocaleConfig.locales['pt-br'] = {
    monthNames: [ "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ],
    monthNamesShort: [ "Jan.", "Fev.", "Mar", "Abr", "Mai", "Jun", "Jul.", "Ago", "Set.", "Out.", "Nov.", "Dez." ],
    dayNames: [ "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado" ],
    dayNamesShort: ["Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sáb."]
  };
  
  LocaleConfig.defaultLocale = 'pt-br';