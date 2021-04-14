import React, { useRef, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { fabric } from 'fabric';
import './Home.css';

const Home: React.FC = () => {

    // reference canvas element (with id="c")
    var canvasRef = useRef<HTMLCanvasElement>(null);
    var canvas = new fabric.Canvas(canvasRef.current!);
    useEffect(()=> {
        initDrawPad();
    },[])

    const initDrawPad = () => {
        // get 2d context to draw on (the "bitmap" mentioned earlier)
        var circle = new fabric.Circle({
            radius: 20, fill: 'green', left: 100, top: 100
        });
        
        // "add" rectangle onto canvas
        canvas.add(circle);
    }   

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                <IonTitle>Draw Pad</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <canvas ref={canvasRef}/>
            </IonContent>
        </IonPage>
    );
};

export default Home;
