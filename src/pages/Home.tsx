import React, { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { IonButton, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { RenderUIProps, UIElement, UIElements, UIOptions } from '../components/UIElements';
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

    const selectOption = (opt:UIElement) => {
        console.log(opt);
    }

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
                            <canvas ref={canvasRef} />
                        </IonCol>
                        <IonCol style={{textAlign:"center"}}>
                            <RenderUIOptions onPress={selectOption} />
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonFooter>
                    <IonToolbar>
                        <IonTitle size="small" slot="end">Powered by <a className="powered" href="http://fabricjs.com/" target="_blank">Fabric.JS</a></IonTitle>
                    </IonToolbar>
                </IonFooter>
            </IonContent>
        </IonPage>
    );
};

const RenderUIOptions: React.FC<RenderUIProps> = (props:RenderUIProps) => {
    const { onPress } = props;
    return (
        <>
        {UIOptions.map((data:UIElements) => data['element'].map((option:UIElement) => <IonButton shape="round" size="default" fill="outline" key={option['key']} onClick={()=>onPress(option)}>{option['icon']}</IonButton>))}
        </>
    );
}

export default Home;
