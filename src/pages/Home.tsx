import React, { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { IonButton, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { RenderUIProps, UIElement, UIElements, Element, SelectElement, UIOptions, defaultOption } from '../components/UIElements';
import './Home.css';

const Home: React.FC = () => {

    // reference canvas element
    var canvasRef = useRef<HTMLCanvasElement>(null);
    var canvasObj = null;

    // Local States
    const [forceRender, setForceRender] = useState<boolean>(false);
    const [canvas, setCanvas] = useState<fabric.Canvas|null>(null);
    const [currElement, setCurrElement] = useState<SelectElement>(defaultOption);

    // React Lifecycles
    useEffect(()=> {
        initDrawPad();
    },[])

    useEffect(() => {
    },[forceRender]);

    const initDrawPad = () => {
        canvasObj = new fabric.Canvas(canvasRef.current!,{
            isDrawingMode:true,
            height: percentageToPixel(84),
            width: percentageToPixel(96, window.screen.width)
        });
        setCanvas(canvasObj);
    }

    const percentageToPixel = (percent: number, pixels: number = window.screen.height) => pixels * (percent/100);

    const selectedOption = (elemIndex:number, optIndex:number, opt:UIElement) => {
        var updateElement:any = {};
        updateElement['selectedElement'] = elemIndex;
        updateElement['selectedOptionIndex'] = optIndex;
        updateElement['selectedOptionKey'] = opt['key'];
        UIOptions[currElement['selectedElement']]['element'][currElement['selectedOptionIndex']]['isActive'] = false;
        UIOptions[elemIndex]['element'][optIndex]['isActive'] = true;
        setCurrElement(updateElement);
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
                            <RenderUIOptions onPress={selectedOption} />
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
        {UIOptions.map((data:UIElements,elemIndex:number) => data['element'].map((option:UIElement,optIndex:number) => <IonButton shape="round" size="default" fill={option["isActive"] ? "solid" : "outline"} key={option['key']} onClick={()=>onPress(elemIndex, optIndex, option)}>{option['icon']}</IonButton>))}
        </>
    );
}

export default Home;
