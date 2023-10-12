import React, { Component } from 'react';
import { Camera,CameraType,FlashMode, AutoFocus, PermissionResponse  } from 'expo-camera';
import { Button, ImageBackground, StyleSheet, Text, View,Image, TextInput, TouchableOpacity, Alert, } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import base64 from 'base64-js'
import axios from "axios";
import 'react-native-get-random-values';
import * as Crypto from 'expo-crypto';
import Spinner from 'react-native-loading-spinner-overlay';


const client = axios.create({
  baseURL: process.env.BASEURL,
});




class App extends Component {
  
  camera: Camera
  state = {
    showTextInputs: false,
    sessionId: '',
    personId: '',
    firstScreen: true,
    verifyScreen: false,
    cameraScreen: false,
    enrollScreen: false,
    cameraType: CameraType.back,
    flash: FlashMode.on,
    focus: AutoFocus.off,
    setCapturedImageLeft: null,
    setCapturedImageRight: null,
    rightPhoto : false,
    leftPhoto: false,
    cameraPreview: false,
    savingStarted: false,
    verifyRequest: false,
    enrollRequest: false,
    Annotated_Left: null,
    Annotated_Right: null,
    verifyResponsePreview: false,
    verifyResponsePreviewLeft:false,
    verifyResponsePreviewRight:false,
    verifyResponsePreviewScore : false,
    enrollResponsePreview: false,
    enrollResponseMessage : '',
    verifyResponseMessage : '',
    segmentedFingerprintMap : [],
    enhancedFingerprintMap : [],
    enrolledFingerprintMap : [],
    verification_Scores : null,
    loading : false,
  };
  constructor(props: any) {
    super(props);
    
  }
  // generate uniqueId
  generateSessionId() {
    const UUID = Crypto.randomUUID();
    console.log('Your UUID: ' + UUID);

    // const unique_id = uuid();
    const small_id = UUID.slice(0,8)
    return small_id;
  }
  // generate uniqueId
  generatePersonId() {
    // const unique_id = uuid();
    const UUID = Crypto.randomUUID();
    console.log('Your UUID: ' + UUID);

    // const unique_id = uuid();
    const small_id = UUID.slice(0,8)
    return small_id;
  }

  handleVerifyPress = () => {
    this.setState({
      firstScreen: false,
      verifyScreen: true,
      verifyRequest: true,
      enrollRequest: false,
      sessionId: this.generateSessionId(),
      verifyResponsePreview: false,
      verifyResponsePreviewLeft:false,
      verifyResponsePreviewRight:false,
      verifyResponsePreviewScore : false,
      enrollResponsePreview: false,
      enrollResponseMessage : '',
      verifyResponseMessage : '',
    });
  };

  handleEnrollPress = () => {
    this.setState({
      firstScreen: false,
      enrollScreen: true,
      enrollRequest: true,
      verifyRequest: false,
      verifyResponsePreview: false,
      verifyResponsePreviewLeft:false,
      verifyResponsePreviewRight:false,
      verifyResponsePreviewScore : false,
      enrollResponsePreview: false,
      enrollResponseMessage : '',
      verifyResponseMessage : '',
      sessionId: this.generateSessionId(),
      personId: this.generatePersonId()
    });
  };

  // startCamera = () => {
  //   this.setState({
  //     firstScreen: false,
  //     verifyScreen: false,
  //     cameraScreen: true,
  //   }, async () => {
  //     this.state.permissionstatus, this.state.requestPermission = Camera.useCameraPermissions();
  //     console.log("Camera Pressed", this.state.sessionId, this.state.personId);
  //   });
  // };

  startCamera = async () => {
    console.log('url',client.getUri())
    const response = await client.get("/api");
    // const getImageresp = await this.getImages();
    if (response.status === 200) {

      const perm = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      if (perm.status != 'granted') {
        console.log("Not granted")
      }
      const { status } = await Camera.requestCameraPermissionsAsync()
      let { permissions } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      console.log(status)
      if (status === 'granted') {
        this.setState({
          firstScreen: false,
          verifyScreen: false,
          enrollScreen : false,
          leftPhoto: true,
        })
      } else {
        Alert.alert('Access denied')
      }
    }
    else {
      console.log('Server not available')
    }
  }

  __handleFlashMode = () => {
    // if (this.state.setFlashMode === 'on') {
    //   this.setState({
    //     setFlashMode: 'off'
    //   })    
    // } else if (this.state.setFlashMode === 'off') {
    //   this.setState({
    //     setFlashMode: 'on'
    //   })    
    // } else {
    //   this.setState({
    //     setFlashMode: 'off'
    //   })    
    // }
    console.log("Set flash Mode", this.state.flash)
  }

  __switchCamera = () => {
    if (this.state.cameraType === 'back') {
      this.setState({
        setCameraType: 'front'
      })
    } else {
      this.setState({
        setCameraType: 'back'
      })
    }
  }
  __takePicture = async () => {
    
    this.camera.takePictureAsync().then(photo => {
      if (this.state.rightPhoto == false) {
        this.setState({ setCapturedImageLeft: photo })
        this.setState({ leftPhoto: false })
        this.setState({ rightPhoto: true })
      }
      else {
        this.setState({ setCapturedImageRight: photo })
        this.setState({ rightPhoto: false })
        this.setState({ cameraPreview : true})
        // this.savePhotos()
      }
    })
  }

  retakePicture = () => {
    this.setState({
      setCapturedImageLeft: null,
      setCapturedImageRight: null,
      cameraPreview: false,
    })
    this.startCamera()
  }

  goHome = () => {
    this.setState ({
      showTextInputs: false,
      sessionId: '',
      // personId: '',
      firstScreen: true,
      verifyScreen: false,
      cameraScreen: false,
      cameraType: CameraType.back,
      flash: FlashMode.on,
      setCapturedImageLeft: null,
      setCapturedImageRight: null,
      rightPhoto : false,
      leftPhoto: false,
      cameraPreview: false,
      savingStarted: false,
      verifyRequest: false,
      enrollRequest: false,
      Annotated_Left: null,
      Annotated_Right: null,
      verifyResponsePreview: false,
      verifyResponsePreviewLeft:false,
      verifyResponsePreviewRight:false,
      verifyResponsePreviewScore : false,
      enrollResponsePreview: false,
      enrollResponseMessage : '',
      verifyResponseMessage : '',
      segmentedFingerprintMap : [],
      enhancedFingerprintMap : [],
      enrolledFingerprintMap : [],
      verification_Scores : null,
    })
  }

  nextHand = () => {
    if(this.state.verifyResponsePreviewLeft) {
      this.setState ({
        verifyResponsePreviewLeft:false,
        verifyResponsePreviewScore : false,
        verifyResponsePreviewRight:true,
      })
    }
    else if (this.state.verifyResponsePreviewRight) {
      this.setState ({
        verifyResponsePreviewRight:false,
        verifyResponsePreviewLeft:false,
        verifyResponsePreviewScore : true,
      })
    }
    else if (this.state.verifyResponsePreviewScore) {
      this.setState ({
        verifyResponsePreviewRight:false,
        verifyResponsePreviewLeft:true,
        verifyResponsePreviewScore : false,
      })
    }
  }
  

  savePhotos = async () => {
    console.log("saving strted")
    this.setState({ savingStarted: true, loading :true })
    try {
      await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'images/')
    }
    catch (error) {
      console.log("Directory creation: ", error)
    }
    if (this.state.setCapturedImageLeft != null && this.state.setCapturedImageRight != null) {
      try {
        const base64Image = await FileSystem.readAsStringAsync(this.state.setCapturedImageLeft.uri, { encoding: 'base64' });
        // this.webSocket.send(JSON.stringify({ photo: base64Image, type: "Picture_Left", sessionid: this.state.setsessionid, personid: this.state.setpersonid, setting: this.state.setsetting }));
        var byteArray = base64.toByteArray(base64Image)
        console.log("<<<<<<", byteArray.length);

        // await FileSystem.moveAsync({
        //   from: this.state.setCapturedImageLeft.uri,
        //   to: FileSystem.documentDirectory + 'images/fingerprint_left.png'
        // })
        const asset = await MediaLibrary.createAssetAsync(this.state.setCapturedImageLeft.uri);
        const album = await MediaLibrary.getAlbumAsync('Download');
        if (album == null) {
          await MediaLibrary.createAlbumAsync('Download', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }

        console.log("saved Image")
      }
      catch (error) {
        console.log("File save: ", error)
      }

      try {
        const base64 = await FileSystem.readAsStringAsync(this.state.setCapturedImageRight.uri, { encoding: 'base64' });
        console.log("Length: ", base64.length);
        // this.webSocket.send(JSON.stringify({ photo: base64, type: "Picture_Right", sessionid: this.state.setsessionid, personid: this.state.setpersonid, setting: this.state.setsetting }));
        // await FileSystem.moveAsync({
        //   from: this.state.setCapturedImageRight.uri,
        //   to: FileSystem.documentDirectory + 'images/fingerprint_right.png'
        // })
        const asset = await MediaLibrary.createAssetAsync(this.state.setCapturedImageRight.uri);
        const album = await MediaLibrary.getAlbumAsync('Download');
        if (album == null) {
          await MediaLibrary.createAlbumAsync('Download', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
        console.log("saved Image")
      }
      catch (error) {
        console.log("File save: ", error)
      }
      try {
      await this.sendImages()
      if(this.state.verifyRequest){
        this.setState ({verifyResponsePreview : true,
          verifyResponsePreviewLeft:true,loading:false})
      }
      if(this.state.enrollRequest){
        this.setState ({enrollResponsePreview : true,loading:false})
      }
      this.setState ({
        showTextInputs: false,
        sessionId: '',
        // personId: '',
        firstScreen: true,
        verifyScreen: false,
        cameraScreen: false,
        cameraType: CameraType.back,
        flash: FlashMode.on,
        setCapturedImageLeft: null,
        setCapturedImageRight: null,
        rightPhoto : false,
        leftPhoto: false,
        cameraPreview: false,
        savingStarted: false,
      })
      }
      catch (error){
        console.log(error)
      }
    }
  }
  sendImages = async () => {
    const response = await client.post("/api", {
      type: "Authenticate",
      personid: this.state.personId,
      sessionid: this.state.sessionId,
    });
    const status = response.status;

    if (status === 200) {
      const base64Image_left = await FileSystem.readAsStringAsync(this.state.setCapturedImageLeft.uri, { encoding: 'base64' });
      console.log("Length: ", base64Image_left.length);
      // const response_left = await client.post("/api", {
      //   type: "Picture_Left",
      //   personid: this.state.personId,
      //   sessionid: this.state.sessionId,
      //   setting: "default",
      //   photo: base64Image_left,
      // });
      const base64Image_right = await FileSystem.readAsStringAsync(this.state.setCapturedImageRight.uri, { encoding: 'base64' });
      console.log("Length: ", base64Image_right.length);
      console.log('startTime',new Date())

      if (this.state.verifyRequest) {
        
        const response_verify = await client.post("/api", {
          type: "Verify",
          personid: this.state.personId,
          sessionid: this.state.sessionId,
          setting: "default",
          Picture_Right: base64Image_right,
          Picture_Left: base64Image_left,
        });
        if (response_verify.status === 200) {
          console.log("verify successful")
          this.state.verifyResponseMessage = response_verify.data;
          this.state.verification_Scores = response_verify.data.full_scores;
          await this.getImages();
          console.log('EndTime Verify',new Date())
        }
        else {
          console.log("verify Failed")
          this.state.verifyResponseMessage = 'Verification Failed';
        }
      }

      if (this.state.enrollRequest) {
        const response_enroll = await client.post("/api", {
          type: "Enroll",
          personid: this.state.personId,
          sessionid: this.state.sessionId,
          setting: "default",
          Picture_Right: base64Image_right,
          Picture_Left: base64Image_left,
        });
        if (response_enroll.status === 200) {
          console.log("enroll successful")
          this.state.enrollResponseMessage = 'Enrollment Successful';
          console.log('EndTime Enroll',new Date())
        }
        else {
          console.log("enroll Failed")
          this.state.enrollResponseMessage = 'Enrollment Failed';
        }
        return response_enroll;
      }
    }
    
  }

  getImages = async () => {
    console.log("getImages",this.state.sessionId,this.state.personId)
    // get annotated images
    const response = await client.get("/images",{
      params: {
        sessionid: this.state.sessionId,
        personid: this.state.personId,
        imagetype: 'Annotated',
        }
      });
      if (response.status === 200) {
        console.log("getImages successful")
        if(response.data.hasOwnProperty('Annotated_Left')){
          console.log("Annotated_Left")
          this.setState({
            Annotated_Left: 'data:image/jpg;base64,' + response.data.Annotated_Left,
          })
        }
        if(response.data.hasOwnProperty('Annotated_Right')){
          console.log("Annotated_Right")
          this.setState({
            Annotated_Right: 'data:image/jpg;base64,' + response.data.Annotated_Right,
          })
        }
      }

      // get segmented images
      const response_segmented = await client.get("/images",{
        params: {
          sessionid: this.state.sessionId,
          personid: this.state.personId,
          imagetype: 'Segmented',
        }});
        if (response_segmented.status === 200) {
          console.log("getImages successful")
          if(response_segmented.data.hasOwnProperty('Segmented_fingerprintLeft0')){
            console.log("Segmented_fingerprintLeft0")
            this.state.segmentedFingerprintMap['Segmented_fingerprintLeft0'] =  'data:image/jpg;base64,' + response_segmented.data.Segmented_fingerprintLeft0
          }
          if(response_segmented.data.hasOwnProperty('Segmented_fingerprintLeft1')){
            console.log("Segmented_fingerprintLeft1")
            this.state.segmentedFingerprintMap['Segmented_fingerprintLeft1'] = 'data:image/jpg;base64,' + response_segmented.data.Segmented_fingerprintLeft1
          }
          if(response_segmented.data.hasOwnProperty('Segmented_fingerprintLeft2')){
            console.log("Segmented_fingerprintLeft2")
            this.state.segmentedFingerprintMap['Segmented_fingerprintLeft2'] = 'data:image/jpg;base64,' + response_segmented.data.Segmented_fingerprintLeft2
          }
          if(response_segmented.data.hasOwnProperty('Segmented_fingerprintLeft3')){
            console.log("Segmented_fingerprintLeft3")
            this.state.segmentedFingerprintMap['Segmented_fingerprintLeft3'] = 'data:image/jpg;base64,' + response_segmented.data.Segmented_fingerprintLeft3
            
          }
          if(response_segmented.data.hasOwnProperty('Segmented_fingerprintRight0')){
            console.log("Segmented_fingerprintRight0")
            this.state.segmentedFingerprintMap['Segmented_fingerprintRight0'] = 'data:image/jpg;base64,' + response_segmented.data.Segmented_fingerprintRight0
            
          }
          if(response_segmented.data.hasOwnProperty('Segmented_fingerprintRight1')){
            console.log("Segmented_fingerprintRight1")
            this.state.segmentedFingerprintMap['Segmented_fingerprintRight1'] = 'data:image/jpg;base64,' + response_segmented.data.Segmented_fingerprintRight1
            
          }
          if(response_segmented.data.hasOwnProperty('Segmented_fingerprintRight2')){
            console.log("Segmented_fingerprintRight2")
            this.state.segmentedFingerprintMap['Segmented_fingerprintRight2'] = 'data:image/jpg;base64,' + response_segmented.data.Segmented_fingerprintRight2
            
          }
          if(response_segmented.data.hasOwnProperty('Segmented_fingerprintRight3')){
            console.log("Segmented_fingerprintRight3")
            this.state.segmentedFingerprintMap['Segmented_fingerprintRight3'] = 'data:image/jpg;base64,' + response_segmented.data.Segmented_fingerprintRight3
            
          }
        }

        // get Enhanced images
      const response_enhanced = await client.get("/images",{
        params: {
          sessionid: this.state.sessionId,
          personid: this.state.personId,
          imagetype: 'Enhanced',
        }});
        if (response_enhanced.status === 200) {
          console.log("getImages successful")
          if(response_enhanced.data.hasOwnProperty('Enhanced_fingerprintLeft0')){
            console.log("Enhanced_fingerprintLeft0")
            this.state.enhancedFingerprintMap['Enhanced_fingerprintLeft0'] =  'data:image/jpg;base64,' + response_enhanced.data.Enhanced_fingerprintLeft0
          }
          if(response_enhanced.data.hasOwnProperty('Enhanced_fingerprintLeft1')){
            console.log("Enhanced_fingerprintLeft1")
            this.state.enhancedFingerprintMap['Enhanced_fingerprintLeft1'] = 'data:image/jpg;base64,' + response_enhanced.data.Enhanced_fingerprintLeft1
          }
          if(response_enhanced.data.hasOwnProperty('Enhanced_fingerprintLeft2')){
            console.log("Enhanced_fingerprintLeft2")
            this.state.enhancedFingerprintMap['Enhanced_fingerprintLeft2'] = 'data:image/jpg;base64,' + response_enhanced.data.Enhanced_fingerprintLeft2
          }
          if(response_enhanced.data.hasOwnProperty('Enhanced_fingerprintLeft3')){
            console.log("Enhanced_fingerprintLeft3")
            this.state.enhancedFingerprintMap['Enhanced_fingerprintLeft3'] = 'data:image/jpg;base64,' + response_enhanced.data.Enhanced_fingerprintLeft3
            
          }
          if(response_enhanced.data.hasOwnProperty('Enhanced_fingerprintRight0')){
            console.log("Enhanced_fingerprintRight0")
            this.state.enhancedFingerprintMap['Enhanced_fingerprintRight0'] = 'data:image/jpg;base64,' + response_enhanced.data.Enhanced_fingerprintRight0
            
          }
          if(response_enhanced.data.hasOwnProperty('Enhanced_fingerprintRight1')){
            console.log("Enhanced_fingerprintRight1")
            this.state.enhancedFingerprintMap['Enhanced_fingerprintRight1'] = 'data:image/jpg;base64,' + response_enhanced.data.Enhanced_fingerprintRight1
            
          }
          if(response_enhanced.data.hasOwnProperty('Enhanced_fingerprintRight2')){
            console.log("Enhanced_fingerprintRight2")
            this.state.enhancedFingerprintMap['Enhanced_fingerprintRight2'] = 'data:image/jpg;base64,' + response_enhanced.data.Enhanced_fingerprintRight2
            
          }
          if(response_enhanced.data.hasOwnProperty('Enhanced_fingerprintRight3')){
            console.log("Enhanced_fingerprintRight3")
            this.state.enhancedFingerprintMap['Enhanced_fingerprintRight3'] = 'data:image/jpg;base64,' + response_enhanced.data.Enhanced_fingerprintRight3
            
          }
        }

        const response_enrolled = await client.get("/images",{
          params: {
            sessionid: this.state.sessionId,
            personid: this.state.personId,
            imagetype: 'Enrolled',
          }});
          if (response_enrolled.status === 200) {
            console.log("get Enrolled Images successful")
            //annotated images
            if(response_enrolled.data.hasOwnProperty('Annotated_Left')){
              console.log("Annotated_Left")
              this.state.enrolledFingerprintMap['Annotated_Left'] = 'data:image/jpg;base64,' + response_enrolled.data.Annotated_Left
            }
            if(response_enrolled.data.hasOwnProperty('Annotated_Right')){
              console.log("Annotated_Right")
              this.state.enrolledFingerprintMap['Annotated_Right'] = 'data:image/jpg;base64,' + response_enrolled.data.Annotated_Right
            }
            //segmented images
            if(response_enrolled.data.hasOwnProperty('Segmented_fingerprintLeft0')){
              console.log("Segmented_fingerprintLeft0")
              this.state.enrolledFingerprintMap['Segmented_fingerprintLeft0'] =  'data:image/jpg;base64,' + response_enrolled.data.Segmented_fingerprintLeft0
            }
            if(response_enrolled.data.hasOwnProperty('Segmented_fingerprintLeft1')){
              console.log("Segmented_fingerprintLeft1")
              this.state.enrolledFingerprintMap['Segmented_fingerprintLeft1'] = 'data:image/jpg;base64,' + response_enrolled.data.Segmented_fingerprintLeft1
            }
            if(response_enrolled.data.hasOwnProperty('Segmented_fingerprintLeft2')){
              console.log("Segmented_fingerprintLeft2")
              this.state.enrolledFingerprintMap['Segmented_fingerprintLeft2'] = 'data:image/jpg;base64,' + response_enrolled.data.Segmented_fingerprintLeft2
            }
            if(response_enrolled.data.hasOwnProperty('Segmented_fingerprintLeft3')){
              console.log("Segmented_fingerprintLeft3")
              this.state.enrolledFingerprintMap['Segmented_fingerprintLeft3'] = 'data:image/jpg;base64,' + response_enrolled.data.Segmented_fingerprintLeft3
              
            }
            if(response_enrolled.data.hasOwnProperty('Segmented_fingerprintRight0')){
              console.log("Segmented_fingerprintRight0")
              this.state.enrolledFingerprintMap['Segmented_fingerprintRight0'] = 'data:image/jpg;base64,' + response_enrolled.data.Segmented_fingerprintRight0
              
            }
            if(response_enrolled.data.hasOwnProperty('Segmented_fingerprintRight1')){
              console.log("Segmented_fingerprintRight1")
              this.state.enrolledFingerprintMap['Segmented_fingerprintRight1'] = 'data:image/jpg;base64,' + response_enrolled.data.Segmented_fingerprintRight1
              
            }
            if(response_enrolled.data.hasOwnProperty('Segmented_fingerprintRight2')){
              console.log("Segmented_fingerprintRight2")
              this.state.enrolledFingerprintMap['Segmented_fingerprintRight2'] = 'data:image/jpg;base64,' + response_enrolled.data.Segmented_fingerprintRight2
              
            }
            if(response_enrolled.data.hasOwnProperty('Segmented_fingerprintRight3')){
              console.log("Segmented_fingerprintRight3")
              this.state.enrolledFingerprintMap['Segmented_fingerprintRight3'] = 'data:image/jpg;base64,' + response_enrolled.data.Segmented_fingerprintRight3
            }

            // enhanced images
            if(response_enrolled.data.hasOwnProperty('Enhanced_fingerprintLeft0')){
              console.log("Enhanced_fingerprintLeft0")
              this.state.enrolledFingerprintMap['Enhanced_fingerprintLeft0'] =  'data:image/jpg;base64,' + response_enrolled.data.Enhanced_fingerprintLeft0
            }
            if(response_enrolled.data.hasOwnProperty('Enhanced_fingerprintLeft1')){
              console.log("Enhanced_fingerprintLeft1")
              this.state.enrolledFingerprintMap['Enhanced_fingerprintLeft1'] = 'data:image/jpg;base64,' + response_enrolled.data.Enhanced_fingerprintLeft1
            }
            if(response_enrolled.data.hasOwnProperty('Enhanced_fingerprintLeft2')){
              console.log("Enhanced_fingerprintLeft2")
              this.state.enrolledFingerprintMap['Enhanced_fingerprintLeft2'] = 'data:image/jpg;base64,' + response_enrolled.data.Enhanced_fingerprintLeft2
            }
            if(response_enrolled.data.hasOwnProperty('Enhanced_fingerprintLeft3')){
              console.log("Enhanced_fingerprintLeft3")
              this.state.enrolledFingerprintMap['Enhanced_fingerprintLeft3'] = 'data:image/jpg;base64,' + response_enrolled.data.Enhanced_fingerprintLeft3
              
            }
            if(response_enrolled.data.hasOwnProperty('Enhanced_fingerprintRight0')){
              console.log("Enhanced_fingerprintRight0")
              this.state.enrolledFingerprintMap['Enhanced_fingerprintRight0'] = 'data:image/jpg;base64,' + response_enrolled.data.Enhanced_fingerprintRight0
              
            }
            if(response_enrolled.data.hasOwnProperty('Enhanced_fingerprintRight1')){
              console.log("Enhanced_fingerprintRight1")
              this.state.enrolledFingerprintMap['Enhanced_fingerprintRight1'] = 'data:image/jpg;base64,' + response_enrolled.data.Enhanced_fingerprintRight1
              
            }
            if(response_enrolled.data.hasOwnProperty('Enhanced_fingerprintRight2')){
              console.log("Enhanced_fingerprintRight2")
              this.state.enrolledFingerprintMap['Enhanced_fingerprintRight2'] = 'data:image/jpg;base64,' + response_enrolled.data.Enhanced_fingerprintRight2
              
            }
            if(response_enrolled.data.hasOwnProperty('Enhanced_fingerprintRight3')){
              console.log("Enhanced_fingerprintRight3")
              this.state.enrolledFingerprintMap['Enhanced_fingerprintRight3'] = 'data:image/jpg;base64,' + response_enrolled.data.Enhanced_fingerprintRight3
              
          }
        }  
    }
  

  render() {
    const { sessionId, personId, firstScreen, verifyScreen, cameraScreen, enrollScreen } = this.state;

    return (
      <View style={styles.container}>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.loading}
          //Text with the Spinner
          textContent={'Loading...'}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
        {firstScreen && <Image source={require('./assets/UbLogo.png')} style={styles.imageBackground}></Image>}
        {firstScreen && (
          <View style={styles.buttonContainer}>
            <Button title="Enroll" onPress={this.handleEnrollPress} />
            <Button title="Verify" onPress={this.handleVerifyPress} />
          </View>
        )}
        {verifyScreen && (
          <View style={styles.textInputContainer}>
            {/* <TextInput
              style={styles.textInput}
              placeholder="Session ID"
              placeholderTextColor='black'
              value={sessionId}
              onChangeText={(text) => this.setState({ sessionId: text })}
            /> */}
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
        {enrollScreen && (
          <View style={styles.textInputContainer}>
            {/* <TextInput
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
            /> */}
            <Button title="Take Picture" onPress={this.startCamera} />
          </View>
        )}
        {this.state.rightPhoto && (
          <View style={styles.container}>
            <Camera type = {this.state.cameraType}
                flashMode={this.state.flash}
                autoFocus = {this.state.focus}
                focusDepth={0.9}
                zoom={0.01}
                ref={(r) => {
                  this.camera = r
                  }}
                >
                  <View
                  style={{
                    flex: 1,
                    width: '100%',
                    backgroundColor: 'transparent',
                    flexDirection: 'row'
                  }}>
                  <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
                    <View style={{
                      position: "absolute",
                      top: -100,
                      right: 0,
                      borderTopWidth: 240, borderLeftWidth: 220, borderBottomWidth: 240,
                      borderColor: "black",
                      zIndex: -20,
                      opacity: 0.7,
                      elevation: -20,
                      width: '130%', height: '130%',
                      borderTopLeftRadius: 350,
                      borderBottomLeftRadius: 400
                    }}></View>
                  </View>
                  {/* {this.state.startRecording ? (<View style={{ position: 'absolute', elevation: 100, zIndex: 100, right: 0, padding: 10, backgroundColor: 'black', opacity: 0.7 }}><Text style={{ color: 'white' }}> <FontAwesome5 name="dot-circle" color="#00ff14" /> Recoding Started</Text></View>) : (<View></View>)}
                  {this.state.startRecording ? (
                    <View style={{
                      position: 'absolute',
                      top: '10%',
                      alignSelf: 'center', zIndex: 100,
                      width: '100%', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Text style={{
                        paddingLeft: 20, paddingRight: 20,
                        paddingTop: 10, paddingBottom: 10,
                        backgroundColor: 'black', opacity: 0.7,
                        color: 'white', fontSize: 25,
                        borderRadius: 100
                      }}>{this.state.countDown}</Text>
                    </View>) : (<View></View>)} */}
                  <View
                    style={{
                      position: 'absolute',
                      left: '5%',
                      top: '10%',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                  </View>
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      flexDirection: 'row',
                      flex: 1,
                      width: '100%',
                      padding: 20,
                      justifyContent: 'center',
                      backgroundColor: "transparent",
                      opacity: 0.7,
                      alignItems: 'center',
                    }}
                  >
                    <TouchableOpacity
                      onPress={this.__switchCamera}
                      style={{
                        borderRadius: 1000,
                        height: 50,
                        width: 50,
                        borderColor: '#fff',
                        borderWidth: 2,
                        backgroundColor: this.state.cameraType === 'back' ? 'transparent' : '#fff',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Text style={{
                        fontSize: 30,
                        color: this.state.cameraType === 'back' ? '#fff' : '#fff'
                      }}>
                        <MaterialIcons name="switch-camera" size={24} color={this.state.cameraType === 'back' ? '#fff' : 'black'} />
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        alignSelf: 'center',
                        flex: 1,
                        alignItems: 'center',
                      }}
                    >
                      <TouchableOpacity
                        onPress={this.__takePicture}
                        style={{
                          width: 70,
                          height: 70,
                          bottom: 0,
                          borderRadius: 50,
                          backgroundColor: '#fff'
                        }}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={this.__handleFlashMode}
                      style={{
                        backgroundColor: this.state.flash == FlashMode.off ? 'transparent' : '#fff',
                        borderRadius: 1000,
                        height: 50,
                        width: 50,
                        borderColor: '#fff',
                        borderWidth: 2,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                      <Text
                        style={{
                          fontSize: 30
                        }}>
                        <MaterialIcons name="flash-on" size={24} color={this.state.flash == FlashMode.off ? '#fff' : 'black'} />
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

            </Camera>
          </View>
        )}
        {this.state.leftPhoto && (
          <View style={styles.container}>
            <Camera type = {this.state.cameraType}
                flashMode={this.state.flash}
                autoFocus = {this.state.focus}
                focusDepth={0.9}
                zoom={0.01}
                ref={(r) => {
                  this.camera = r
                  }}
                >
                  <View
                  style={{
                    flex: 1,
                    width: '100%',
                    backgroundColor: 'transparent',
                    flexDirection: 'row'
                  }}>
                  <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
                    <View style={{
                      borderTopWidth: 240, borderRightWidth: 220, borderBottomWidth: 240,
                      borderColor: "black",
                      opacity: 0.7,
                      width: '130%', height: '130%',
                      borderTopRightRadius: 350,
                      borderBottomRightRadius: 400
                    }}></View>
                  </View>
                  {/* {this.state.startRecording ? (<View style={{ position: 'absolute', elevation: 100, zIndex: 100, right: 0, padding: 10, backgroundColor: 'black', opacity: 0.7 }}><Text style={{ color: 'white' }}> <FontAwesome5 name="dot-circle" color="#00ff14" /> Recoding Started</Text></View>) : (<View></View>)}
                  {this.state.startRecording ? (
                    <View style={{
                      position: 'absolute',
                      top: '10%',
                      alignSelf: 'center', zIndex: 100,
                      width: '100%', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Text style={{
                        paddingLeft: 20, paddingRight: 20,
                        paddingTop: 10, paddingBottom: 10,
                        backgroundColor: 'black', opacity: 0.7,
                        color: 'white', fontSize: 25,
                        borderRadius: 100
                      }}>{this.state.countDown}</Text>
                    </View>) : (<View></View>)} */}
                  <View
                    style={{
                      position: 'absolute',
                      left: '5%',
                      top: '10%',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                  </View>
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      flexDirection: 'row',
                      flex: 1,
                      width: '100%',
                      padding: 20,
                      justifyContent: 'center',
                      backgroundColor: "transparent",
                      opacity: 0.7,
                      alignItems: 'center',
                    }}
                  >
                    <TouchableOpacity
                      onPress={this.__switchCamera}
                      style={{
                        borderRadius: 1000,
                        height: 50,
                        width: 50,
                        borderColor: '#fff',
                        borderWidth: 2,
                        backgroundColor: this.state.cameraType === 'back' ? 'transparent' : '#fff',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Text style={{
                        fontSize: 30,
                        color: this.state.cameraType === 'back' ? '#fff' : '#fff'
                      }}>
                        <MaterialIcons name="switch-camera" size={24} color={this.state.cameraType === 'back' ? '#fff' : 'black'} />
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        alignSelf: 'center',
                        flex: 1,
                        alignItems: 'center',
                      }}
                    >
                      <TouchableOpacity
                        onPress={this.__takePicture}
                        style={{
                          width: 70,
                          height: 70,
                          bottom: 0,
                          borderRadius: 50,
                          backgroundColor: '#fff'
                        }}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={this.__handleFlashMode}
                      style={{
                        backgroundColor: this.state.flash == FlashMode.off ? 'transparent' : '#fff',
                        borderRadius: 1000,
                        height: 50,
                        width: 50,
                        borderColor: '#fff',
                        borderWidth: 2,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                      <Text
                        style={{
                          fontSize: 30
                        }}>
                        <MaterialIcons name="flash-on" size={24} color={this.state.flash == FlashMode.off ? '#fff' : 'black'} />
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

            </Camera>
          </View>
        )}
        {this.state.cameraPreview && this.state.setCapturedImageLeft && this.state.setCapturedImageRight && (
              <CameraPreview photoLeft={this.state.setCapturedImageLeft}
                photoRight={this.state.setCapturedImageRight}
                savePhoto={this.savePhotos}
                retakePicture={this.retakePicture} />
            )}
        {this.state.verifyResponsePreview && this.state.verifyResponsePreviewLeft && (
              <VerifyScreenPreview_Left photoLeft={this.state.Annotated_Left}
                // photoRight={this.state.Annotated_Left_Enroll}
                goHome={this.goHome}
                nextHand = {this.nextHand}
                segmentedFingerprintMap = {this.state.segmentedFingerprintMap}
                enhancedFingerprintMap = {this.state.enhancedFingerprintMap}
                enrolledFingerprintMap = {this.state.enrolledFingerprintMap}
                 />
            )}
        {this.state.verifyResponsePreview && this.state.verifyResponsePreviewRight && (
              <VerifyScreenPreview_Right photoLeft={this.state.Annotated_Right}
                // photoRight={this.state.Annotated_Right_Enroll}
                goHome={this.goHome}
                nextHand = {this.nextHand}
                segmentedFingerprintMap = {this.state.segmentedFingerprintMap}
                enhancedFingerprintMap = {this.state.enhancedFingerprintMap}
                enrolledFingerprintMap = {this.state.enrolledFingerprintMap}
                 />
            )}
        {this.state.verifyResponsePreview && this.state.verifyResponsePreviewScore && (
              <VerifyScreenPreview_Scores 
                goHome={this.goHome}
                nextHand = {this.nextHand}
                verifyResponseMessage = {this.state.verifyResponseMessage}
                scores = {this.state.verification_Scores}
                segmentedFingerprintMap = {this.state.segmentedFingerprintMap}
                enhancedFingerprintMap = {this.state.enhancedFingerprintMap}
                enrolledFingerprintMap = {this.state.enrolledFingerprintMap}
                 />
            )}
        {this.state.enrollResponsePreview && (
          <View style={styles.textInputContainer}>
            {
              <><Text style={{
                paddingLeft: 20, paddingRight: 20,
                paddingTop: 10, paddingBottom: 10,
                backgroundColor: 'black', opacity: 0.7,
                color: 'white', fontSize: 25,
                borderRadius: 100
              }} selectable={true}>
                {this.state.personId}
              </Text>
              <Text style={{
                paddingLeft: 20, paddingRight: 20,
                paddingTop: 10, paddingBottom: 10,
                backgroundColor: 'black', opacity: 0.7,
                color: 'white', fontSize: 25,
                borderRadius: 100
              }}>{this.state.enrollResponseMessage}</Text></>
            }
          </View>
          
        )}
      </View>
    );
  }
}

const CameraPreview = ({ photoLeft, photoRight, retakePicture, savePhoto }: any) => {
  return (
    <View style={{ height: '100%', width: '100%', alignItems: 'center' }}>
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        justifyContent: 'center',
        marginTop: 15
      }}>
        <View
          style={{
            backgroundColor: 'white',
            width: 200,
            borderColor: '#a5a5a5',
            borderWidth: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            margin: 10,
            padding: 5,
            borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: photoLeft.uri}}
            style={{ height: 300 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 15,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 3 }}>Left</Text>
        </View>

        <View
          style={{
            backgroundColor: 'white',
            width: 200,
            borderColor: '#a5a5a5',
            borderWidth: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            margin: 10,
            padding: 5,
            borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: photoRight.uri }}
            style={{ height: 300 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 15,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 3 }}>Right</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={savePhoto}
        style={{
          width: '80%',
          borderRadius: 4,
          backgroundColor: '#14274e',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: 40,
          position: 'absolute',
          bottom: 60,
          marginBottom: 20,
          marginTop: 20
        }}>
        <Text
          style={{
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
          
          Submit Request
            </Text>
      </TouchableOpacity>


      <TouchableOpacity
        onPress={retakePicture}
        style={{
          width: '80%',
          borderRadius: 4,
          backgroundColor: '#14274e',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: 40,
          position: 'absolute',
          bottom: 0,
          marginBottom: 20,
          marginTop: 20
        }}>
        <Text
          style={{
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
          Retake Fingerprint
            </Text>
      </TouchableOpacity>
    </View>
  )
}
const VerifyScreenPreview_Left = ({ photoLeft, goHome ,nextHand,segmentedFingerprintMap,enhancedFingerprintMap, enrolledFingerprintMap }: any) => {
  return (
    <View style={{ height: '100%', width: '100%', alignItems: 'center' }}>
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        justifyContent: 'center',
        // marginTop: 0
      }}>
        <View
          style={{
            backgroundColor: 'white',
            width: '45%',
            borderColor: '#a5a5a5',
            borderWidth: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            margin: 5,
            padding: 5,
            borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: photoLeft }}
            style={{ height: 250 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 5,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>Verification</Text>
        </View>

        <View
          style={{
            backgroundColor: 'white',
            width: '45%',
            borderColor: '#a5a5a5',
            borderWidth: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            margin: 5,
            padding: 5,
            borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enrolledFingerprintMap['Annotated_Left'] }}
            style={{ height: 250 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 5,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>Enrolled</Text>
        </View>

        {/* segmented images */}
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: segmentedFingerprintMap['Segmented_fingerprintLeft0'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>LeftIndex</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: segmentedFingerprintMap['Segmented_fingerprintLeft1'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>LeftMiddle</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: segmentedFingerprintMap['Segmented_fingerprintLeft2'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>LeftRing</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: segmentedFingerprintMap['Segmented_fingerprintLeft3'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>LeftLittle</Text>
        </View>
        <Text style={{ width: '100%',fontSize: 10, textAlign: 'center', marginTop: 0 }}>Verification Images</Text>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enrolledFingerprintMap['Segmented_fingerprintLeft0'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>LeftIndex</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enrolledFingerprintMap['Segmented_fingerprintLeft1'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>LeftMiddle</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enrolledFingerprintMap['Segmented_fingerprintLeft2'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>LeftRing</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enrolledFingerprintMap['Segmented_fingerprintLeft3'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>LeftLittle</Text>
        </View>
        <Text style={{width: '100%', fontSize: 10, textAlign: 'center', marginTop: 0 }}>Enrolled Images</Text>

        {/* Enhanced images */}
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            // borderColor: '#a5a5a5',
            // borderWidth: 0,
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.8,
            // shadowRadius: 2,
            // margin: 0,
            // padding: 0,
            // borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enhancedFingerprintMap['Enhanced_fingerprintLeft0'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>LeftIndex</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            // borderColor: '#a5a5a5',
            // borderWidth: 0,
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.8,
            // shadowRadius: 2,
            // margin: 0,
            // padding: 0,
            // borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enhancedFingerprintMap['Enhanced_fingerprintLeft1'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>LeftMiddle</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            // borderColor: '#a5a5a5',
            // borderWidth: 0,
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.8,
            // shadowRadius: 2,
            // margin: 0,
            // padding: 0,
            // borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enhancedFingerprintMap['Enhanced_fingerprintLeft2'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>LeftRing</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            // borderColor: '#a5a5a5',
            // borderWidth: 0,
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.8,
            // shadowRadius: 2,
            // margin: 0,
            // padding: 0,
            // borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enhancedFingerprintMap['Enhanced_fingerprintLeft3'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>LeftLittle</Text>
        </View>
        <Text style={{ width: '100%',fontSize: 10, textAlign: 'center', marginTop: 0 }}>Verification Images</Text>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            // borderColor: '#a5a5a5',
            // borderWidth: 0,
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.8,
            // shadowRadius: 2,
            // margin: 0,
            // padding: 0,
            // borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enrolledFingerprintMap['Enhanced_fingerprintLeft0'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>LeftIndex</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            // borderColor: '#a5a5a5',
            // borderWidth: 0,
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.8,
            // shadowRadius: 2,
            // margin: 0,
            // padding: 0,
            // borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enrolledFingerprintMap['Enhanced_fingerprintLeft1'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>LeftMiddle</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            // borderColor: '#a5a5a5',
            // borderWidth: 0,
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.8,
            // shadowRadius: 2,
            // margin: 0,
            // padding: 0,
            // borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enrolledFingerprintMap['Enhanced_fingerprintLeft2'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>LeftRing</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            // borderColor: '#a5a5a5',
            // borderWidth: 0,
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.8,
            // shadowRadius: 2,
            // margin: 0,
            // padding: 0,
            // borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enrolledFingerprintMap['Enhanced_fingerprintLeft3'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>LeftLittle</Text>
        </View>
        <Text style={{width: '100%', fontSize: 10, textAlign: 'center', marginTop: 0 }}>Enrolled Images</Text>
          
      </View>
          <View style={styles.buttonContainer}>
            <Button title="Home" onPress={goHome} /> 
            <Button title="Right Hand" onPress={nextHand} />
          </View>
    </View>
  )
}

const VerifyScreenPreview_Right = ({ photoLeft, goHome ,nextHand,segmentedFingerprintMap,enhancedFingerprintMap, enrolledFingerprintMap }: any) => {
  return (
    <View style={{ height: '100%', width: '100%', alignItems: 'center' }}>
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        justifyContent: 'center',
        // marginTop: 0
      }}>
        <View
          style={{
            backgroundColor: 'white',
            width: '45%',
            borderColor: '#a5a5a5',
            borderWidth: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            margin: 5,
            padding: 5,
            borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: photoLeft }}
            style={{ height: 250 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 5,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>Verification</Text>
        </View>

        <View
          style={{
            backgroundColor: 'white',
            width: '45%',
            borderColor: '#a5a5a5',
            borderWidth: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            margin: 5,
            padding: 5,
            borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enrolledFingerprintMap['Annotated_Right'] }}
            style={{ height: 250 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 5,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>Enrolled</Text>
        </View>

        {/* segmented images */}
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: segmentedFingerprintMap['Segmented_fingerprintRight0'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>RightIndex</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: segmentedFingerprintMap['Segmented_fingerprintRight1'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>RightMiddle</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: segmentedFingerprintMap['Segmented_fingerprintRight2'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>RightRing</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: segmentedFingerprintMap['Segmented_fingerprintRight3'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>RightLittle</Text>
        </View>
        <Text style={{ width: '100%', fontSize: 10, textAlign: 'center', marginTop: 0 }}>Verification Images</Text>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enrolledFingerprintMap['Segmented_fingerprintRight0'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>RightIndex</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enrolledFingerprintMap['Segmented_fingerprintRight1'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>RightMiddle</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enrolledFingerprintMap['Segmented_fingerprintRight2'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>RightRing</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enrolledFingerprintMap['Segmented_fingerprintRight3'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>RightLittle</Text>
        </View>
        <Text style={{ width: '100%',fontSize: 10, textAlign: 'center', marginTop: 0 }}>Enrolled Images</Text>

        {/* Enhanced images */}
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            // borderColor: '#a5a5a5',
            // borderWidth: 0,
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.8,
            // shadowRadius: 2,
            // margin: 0,
            // padding: 0,
            // borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enhancedFingerprintMap['Enhanced_fingerprintRight0'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>RightIndex</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            // borderColor: '#a5a5a5',
            // borderWidth: 0,
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.8,
            // shadowRadius: 2,
            // margin: 0,
            // padding: 0,
            // borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enhancedFingerprintMap['Enhanced_fingerprintRight1'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>RightMiddle</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            // borderColor: '#a5a5a5',
            // borderWidth: 0,
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.8,
            // shadowRadius: 2,
            // margin: 0,
            // padding: 0,
            // borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enhancedFingerprintMap['Enhanced_fingerprintRight2'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>RightRing</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            // borderColor: '#a5a5a5',
            // borderWidth: 0,
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.8,
            // shadowRadius: 2,
            // margin: 0,
            // padding: 0,
            // borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enhancedFingerprintMap['Enhanced_fingerprintRight3'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>RightLittle</Text>
        </View>
        <Text style={{ width: '100%',fontSize: 10, textAlign: 'center', marginTop: 0 }}>Verification Images</Text>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            // borderColor: '#a5a5a5',
            // borderWidth: 0,
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.8,
            // shadowRadius: 2,
            // margin: 0,
            // padding: 0,
            // borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enrolledFingerprintMap['Enhanced_fingerprintRight0'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>RightIndex</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            // borderColor: '#a5a5a5',
            // borderWidth: 0,
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.8,
            // shadowRadius: 2,
            // margin: 0,
            // padding: 0,
            // borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enrolledFingerprintMap['Enhanced_fingerprintRight1'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>RightMiddle</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            // borderColor: '#a5a5a5',
            // borderWidth: 0,
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.8,
            // shadowRadius: 2,
            // margin: 0,
            // padding: 0,
            // borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enrolledFingerprintMap['Enhanced_fingerprintRight2'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>RightRing</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            width: '24%',
            // borderColor: '#a5a5a5',
            // borderWidth: 0,
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.8,
            // shadowRadius: 2,
            // margin: 0,
            // padding: 0,
            // borderRadius: 5,
            justifyContent: 'center'
          }}>
          <ImageBackground
            source={{ uri: enrolledFingerprintMap['Enhanced_fingerprintRight3'] }}
            resizeMode='center'
            style={{ height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                padding: 0,
                justifyContent: 'flex-end'
              }}>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 0 }}>RightLittle</Text>
        </View>
        <Text style={{ width: '100%',fontSize: 10, textAlign: 'center', marginTop: 0 }}>Enrolled Images</Text>
          

      </View>
          <View style={styles.buttonContainer}>
            <Button title="Home" onPress={goHome} /> 
            <Button title="Verification Results" onPress={nextHand} />
          </View>
    </View>
  )
}

const VerifyScreenPreview_Scores = ({goHome, nextHand,verifyResponseMessage, scores, segmentedFingerprintMap, enhancedFingerprintMap, enrolledFingerprintMap} : any) => {
  return (
    <View style={{ height: '100%', width: '100%', alignItems: 'center' }}>
      <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 20,
      }}>
        <View style={{
          marginTop: 10,
          marginBottom: 10,
          padding: 10,
          backgroundColor: '#f0f0f0',
          borderRadius: 5,
        }}>
        <Text style={{
          fontSize: 18,
        }}>{verifyResponseMessage['message']}</Text>
        </View>
        <View style={{
          marginBottom: 10,
          padding: 10,
          backgroundColor: '#f0f0f0',
          borderRadius: 5,
        }}>
        <Text style={{
          fontSize: 18,
        }}>{verifyResponseMessage['Prediction']}</Text>
        </View>
        <View style={{
          marginBottom: 10,
          padding: 10,
          backgroundColor: '#f0f0f0',
          borderRadius: 5,
        }}>
        <Text style={{
          fontSize: 18,
        }}>{verifyResponseMessage['score']}</Text>
        </View>
      <View style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 20,fontWeight: 'bold',marginBottom: 10,}}>Left Hand</Text>
        <View style={{
          marginBottom: 10,
          padding: 10,
          backgroundColor: '#f0f0f0',
          borderRadius: 5,
        }}>
        <Text style={{
          fontSize: 18,
        }}>LeftIndex: {scores['LeftIndex']}</Text>
        </View>
        <View  style={{
          marginBottom: 10,
          padding: 10,
          backgroundColor: '#f0f0f0',
          borderRadius: 5,
        }}>
        <Text style={{
          fontSize: 18,
        }}>LeftMiddle: {scores['LeftMiddle']}</Text>
        </View>
        <View style={{
          marginBottom: 10,
          padding: 10,
          backgroundColor: '#f0f0f0',
          borderRadius: 5,
        }}>
        <Text style={{
          fontSize: 18,
        }}>LeftRing: {scores['LeftRing']}</Text>
        </View>
        <View style={{
          marginBottom: 10,
          padding: 10,
          backgroundColor: '#f0f0f0',
          borderRadius: 5,
        }}>
        <Text style={{
          fontSize: 18,
        }}>LeftLittle: {scores['LeftLittle']}</Text>
        </View>
      </View>

      <View style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 20,fontWeight: 'bold',marginBottom: 10,}}>Right Hand</Text>
        <View  style={{
          marginBottom: 10,
          padding: 10,
          backgroundColor: '#f0f0f0',
          borderRadius: 5,
        }}>
        <Text style={{
          fontSize: 18,
        }}>RightIndex: {scores['RightIndex']}</Text>
        </View>
        <View  style={{
          marginBottom: 10,
          padding: 10,
          backgroundColor: '#f0f0f0',
          borderRadius: 5,
        }}>
        <Text style={{
          fontSize: 18,
        }}>RightMiddle: {scores['RightMiddle']}</Text>
        </View>
        <View  style={{
          marginBottom: 10,
          padding: 10,
          backgroundColor: '#f0f0f0',
          borderRadius: 5,
        }}>
        <Text style={{
          fontSize: 18,
        }}>RightRing: {scores['RightRing']}</Text>
        </View>
        <View  style={{
          marginBottom: 10,
          padding: 10,
          backgroundColor: '#f0f0f0',
          borderRadius: 5,
        }}>
        <Text style={{
          fontSize: 18,
        }}>RightLittle: {scores['RightLittle']}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Home" onPress={goHome} /> 
        <Button title="LeftHand" onPress={nextHand} />
      </View>
      </View>
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  textInputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  textInput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: "80%",
    fontSize: 15,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});

export default App;




