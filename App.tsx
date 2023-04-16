import React, { Component } from 'react';
import { Camera } from 'expo-camera';
import { Button, ImageBackground, StyleSheet, Text, View,Image, TextInput } from 'react-native';

class App extends Component {
  state = {
    showTextInputs: false,
    sessionId: '',
    personId: '',
    firstScreen: true,
    verifyScreen: false,
    cameraScreen: false,
  };
  constructor(props: any) {
    super(props);
    
  }

  handleVerifyPress = () => {
    this.setState({
      firstScreen: false,
      verifyScreen: true,
    });
  };

  startCamera = () => {
    this.setState({
      firstScreen: false,
      verifyScreen: false,
      cameraScreen: true,
    }, () => {
      console.log("Camera Pressed", this.state.sessionId, this.state.personId);
    });
  };

  render() {
    const { sessionId, personId, firstScreen, verifyScreen, cameraScreen } = this.state;

    return (
      <View style={styles.container}>
        {firstScreen && <Image source={require('./assets/UbLogo.png')} style={styles.imageBackground}></Image>}
        {firstScreen && (
          <View style={styles.buttonContainer}>
            <Button title="Enroll" onPress={() => console.log("Button 1 pressed")} />
            <Button title="Verify" onPress={this.handleVerifyPress} />
          </View>
        )}
        {verifyScreen && (
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Session ID"
              placeholderTextColor='black'
              value={sessionId}
              onChangeText={(text) => this.setState({ sessionId: text })}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Person ID"
              placeholderTextColor='black'
              value={personId}
              onChangeText={(text) => this.setState({ personId: text })}
            />
            <Button title="Take Picture" onPress={this.startCamera} />
          </View>
        )}
        {cameraScreen && (
          <View style={styles.container}>
            <Camera>

            </Camera>
          </View>
        )}
      </View>
    );
  }
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

export default App;