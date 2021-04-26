import React, { useRef, useEffect } from 'react';
import { IonButton, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import DrawingEditor from '../components/DrawingEditor';
import './Home.css';

const Home: React.FC = () => {

    var canvasRef = useRef<HTMLCanvasElement>(null);
    var ionContentRef = useRef<HTMLIonContentElement>(null);
    var drawingEditor: DrawingEditor | null = null;

    useEffect(() => {
        // This method for getting correct height of the ion content element 
        document.onreadystatechange = () => {
            initDrawingEditor();
        };
    }, [])

    const initDrawingEditor = () => {
        if(canvasRef) {
            var canvasHeight: number = (window.innerHeight - ionContentRef.current?.offsetTop!);
            var canvasWidth: number = window.innerWidth;
            drawingEditor = new DrawingEditor(canvasRef.current!, canvasHeight, canvasWidth);
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                <IonTitle>DrawPAD</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen ref={ionContentRef}>
                <canvas ref={canvasRef} className="canvas"/>
                {/* <IonFooter>
                    <IonToolbar>
                        <IonTitle size="small" slot="end">Powered by <a className="powered" href="http://fabricjs.com/" target="_blank">Fabric.JS</a></IonTitle>
                    </IonToolbar>
                </IonFooter> */}
            </IonContent>
        </IonPage>
    );
};

export default Home;
