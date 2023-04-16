import { Camera } from 'expo-camera';
import { useState } from 'react';
import { Button, ImageBackground, StyleSheet, Text, View,Image, TextInput } from 'react-native';

export default function App() {

  const [showTextInputs, setShowTextInputs] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [personId, setPersonId] = useState('');
  const [firstScreen, setfirstScreen] = useState(true);
  const [verifyScreen, setverifyScreen] = useState(false);
  const [cameraScreen, setCameraScreen] = useState(false);

  const handleVerifyPress = () => {
    setfirstScreen(false)
    setverifyScreen(true);
  };

  const startCamera = () => {
    setfirstScreen(false)
    setverifyScreen(false)
    setCameraScreen(true)
    console.log("camera Pressed",sessionId,personId)
    
  };
  
  return (
    <View style={styles.container}>
      {firstScreen && <Image source={require('./assets/UbLogo.png')} style={styles.imageBackground}></Image>}
      {firstScreen && (<View style={styles.buttonContainer}>
        <Button title="Enroll" onPress={() => console.log("Button 1 pressed")} />
        <Button title="Verify" onPress={handleVerifyPress} />
      </View>)}
      {verifyScreen && (
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Session ID"
            placeholderTextColor = 'black'
            value={sessionId}
            onChangeText={setSessionId}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Person ID"
            placeholderTextColor = 'black'
            value={personId}
            onChangeText={setPersonId}
          />
          <Button title="Take Picture" onPress={startCamera} />
        </View>
      )}
      {cameraScreen && (
        <View style={styles.container}>
          <Camera >
            
          </Camera>
          </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'contain',
    // Add your image styles here
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    // Add your button container styles here
  },
  textInputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    // Add your text input container styles here
  },
  textInput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: "80%",
    fontSize: 15,
    // Add your text input styles here
  },
});
