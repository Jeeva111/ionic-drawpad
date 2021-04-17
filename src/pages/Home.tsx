import React, { useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { GiPencilBrush, GiTexas } from 'react-icons/gi';
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
            isDrawingMode:true,
            height: percentageToPixel(84),
            width: percentageToPixel(96, window.screen.width)
        });
    }

    const percentageToPixel = (percent: number, pixels: number = window.screen.height) => pixels * (percent/100);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                <IonTitle>Draw Pad</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonGrid style={{padding:0}}>
                    <IonRow>
                        <IonCol size="11.4">
                            <canvas 
                                ref={canvasRef}
                            />
                        </IonCol>
                        <IonCol style={{textAlign:"center"}}>
                            <IonButton shape="round" size="default" fill="outline">
                                <GiPencilBrush size={20}/>
                            </IonButton>
                            <IonButton shape="round" size="default" fill="outline">
                                <GiTexas size={20}/>
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Home;
