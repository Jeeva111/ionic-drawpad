import React, { useRef, useEffect } from 'react';
import { IonButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonPage, isPlatform, IonTitle, IonToolbar } from '@ionic/react';
import { FaBeer } from 'react-icons/fa';
import DrawingEditor from '../components/DrawingEditor';
import './Home.css';

const Home: React.FC = () => {

    var canvasRef = useRef<HTMLCanvasElement>(null);
    var ionContentRef = useRef<HTMLIonContentElement>(null);
    var drawingEditor: DrawingEditor | null = null;

    useEffect(() => {
        // This method for getting current height of the ion content element 
        document.onreadystatechange = () => {
            initDrawingEditor();
        };
    }, [])

    const initDrawingEditor = () => {
        if(canvasRef) {
            console.log(ionContentRef.current?.offsetTop);
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
                    <IonButtons slot="primary">
                        <IonButton>
                            <FaBeer />
                        </IonButton>
                    </IonButtons>
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