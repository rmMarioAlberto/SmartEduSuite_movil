import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native'; // Asegúrate de importar Button
import { scanQR } from "../../../src/services/clases/pasarLista";

export default function QRScanner() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    const handleBarCodeScanned = async ({ type, data }) => {
        if (scanned) return; // Evitar escaneos múltiples
        setScanned(true);
        console.log('Código escaneado:', { type, data });

        try {
            const parsedData = JSON.parse(data);
            const response = await scanQR(
                parsedData.classId,
                parsedData.startTime,
                parsedData.validDuration,
                parsedData.qrIdentifier
            );

            // Mostrar el mensaje de la respuesta
            Alert.alert('Resultado del escaneo', response.message, [
                { text: 'OK', onPress: () => setScanned(false) }
            ]);
        } catch (error) {
            console.error('Error al procesar el código QR:', error);
            Alert.alert('Error', error.message, [
                { text: 'OK', onPress: () => setScanned(false) }
            ]);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
            >
                {/* Overlay que cubre toda la pantalla */}
                <View style={styles.overlay}>
                    {/* Cuatro vistas para crear el efecto de recorte */}
                    <View style={styles.topOverlay} />
                    <View style={styles.middleRow}>
                        <View style={styles.sideOverlay} />
                        <View style={styles.transparentArea} />
                        <View style={styles.sideOverlay} />
                    </View>
                    <View style={styles.bottomOverlay} />
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topOverlay: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    middleRow: {
        flexDirection: 'row',
    },
    sideOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    transparentArea: {
        width: 250,
        height: 250,
        borderWidth: 5,
        borderColor: 'white',
        backgroundColor: 'transparent',
    },
    bottomOverlay: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
});