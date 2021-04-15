import React, { useRef, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { fabric } from 'fabric';
import './Home.css';

const Home: React.FC = () => {

    // reference canvas element
    var canvasRef = useRef<HTMLCanvasElement>(null);
    var canvas = null;
    useEffect(()=> {
        initDrawPad();
    },[])

    const initDrawPad = () => {

        canvas = new fabric.Canvas(canvasRef.current!,{
            isDrawingMode:true
        });
    }   

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                <IonTitle>Draw Pad</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <canvas 
                    ref={canvasRef}
                    style={{height:"100%", width:"100%"}}
                />
            </IonContent>
        </IonPage>
    );
};

export default Home;
