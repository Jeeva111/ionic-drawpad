import React, { useRef, useEffect, useState } from 'react';
import { IonButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonPage, isPlatform, IonTitle, IonToolbar, IonRow, IonRadioGroup, IonList, IonItem, IonRadio, IonLabel, IonListHeader } from '@ionic/react';
import DrawingEditor from '../components/DrawingEditor';
import { DrawAddComponent } from '../components/Interface';
import './Home.css';

const Home: React.FC = () => {

    var canvasRef = useRef<HTMLCanvasElement>(null);
    var ionContentRef = useRef<HTMLIonContentElement>(null);
    var drawingEditor: DrawingEditor | null = null;
    const [forceUpdate, setForceUpdate] = useState<boolean>(false);

    useEffect(() => {
        // This method for getting current height of the ion content element 
        document.onreadystatechange = () => {
            initDrawingEditor();
        };
    }, [])

    const initDrawingEditor = () => {
        if(canvasRef) {
            var canvasHeight: number = (window.innerHeight - ionContentRef.current?.offsetTop!);
            var canvasWidth: number = window.innerWidth;
            drawingEditor = new DrawingEditor(canvasRef.current!, canvasHeight, canvasWidth);
            const components: DrawAddComponent = [
                { id: 'lineDisplayComponent', type: 'line' },
                { id: 'rectangleDisplayComponent', type: 'rect' },
                { id: 'ovalDisplayComponent', type: 'oval' },
                { id: 'triangleDisplayComponent', type: 'triangle' },
                { id: 'textDisplayComponent', type: 'text' },
                { id: 'polylineDisplayComponent', type: 'polyline' },
                { id: 'deleteComponent', type: 'delete'},
                { id: 'fillColorComponent', type: 'fillColorChooser' },
                { id: 'lineColorComponent', type: 'lineColorChooser' }
            ];
            //Add the components to the DrawingEditor, which will render them.
            drawingEditor.addComponents(components);
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>DrawPAD</IonTitle>
                    <IonButtons slot="primary">
                        <div id="polylineDisplayComponent" />
                        <div id="lineDisplayComponent" />
                        <div id="rectangleDisplayComponent" />
                        <div id="ovalDisplayComponent" />
                        <div id="triangleDisplayComponent" />
                        <div id="textDisplayComponent" />
                        <div id="deleteComponent" />
                    </IonButtons>
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                            <div className="btn-toolbar">
                                <label className="col-form-label controlLabel d-inline">Lines:</label>
                                <div id="lineColorComponent"></div>

                                <div className="separator"></div>

                                <label className="col-form-label controlLabel ">Fill:</label>
                                <div id="fillColorComponent"></div>
                            </div>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
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