import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons, AntDesign } from '@expo/vector-icons'

const WINDOW_HEIGHT = Dimensions.get('window').height;
const CAPTURE_SIZE = Math.floor(WINDOW_HEIGHT * 0.08);
export default function CameraComponent() {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [base64, setBase64] = useState("");
    const [isPreview, setIsPreview] = useState(false);
    const [image,setImage] = useState(null); 
    const cameraRef = useRef(null);
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    const switchCamera = () => {
        if (isPreview) {
            return;
        }
        setType(prevCameraType =>
            prevCameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
    };
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    async function cameraReady() {
        console.log(await cameraRef.current.getSupportedRatiosAsync());
    }
    const onSnap = async () => {
        if (cameraRef.current) {
          const options = { quality: 0.7, base64: true };
          const data = await cameraRef.current.takePictureAsync(null);
          setImage(data.uri);      
        }
      };
    return (
        <View style={styles.container}>
            <View style={styles.cameraContainer}>
            <Camera onCameraReady={cameraReady} ref={cameraRef} style={styles.camera} type={type} useCamera2Api>
 
                    <View style={styles.bottomButtonsContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={switchCamera}>
                            <MaterialIcons name='flip-camera-ios' size={34} color='#FFFFFF' />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={onSnap}
                            style={styles.capture}
                        />
                    </View>
            </Camera>
            {image && <Image source={{uri:image}} style={{flex:0.5}} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    cameraContainer: {
        flex: 1,
        flexDirection: 'column'
      },
    closeButton: {
        position: 'absolute',
        top: 35,
        right: 20,
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5A45FF',
        opacity: 0.7
    },
    captured :{
        margin : 10
    },
    bottomButtonsContainer: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: 28,
        width: '100%',
        justifyContent: 'center'
    },
    button: {
        flex: 0.1,
        alignSelf: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    capture: {
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        height: CAPTURE_SIZE,
        width: CAPTURE_SIZE,
        borderRadius: Math.floor(CAPTURE_SIZE / 2),
        marginBottom: 28,
        marginHorizontal: 30
    }
});