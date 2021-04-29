import React, { useRef, useEffect, useState } from 'react';
import { Gestures } from "react-gesture-handler";
import { fabric } from 'fabric';
import { FaPencilAlt } from 'react-icons/fa';
import { IonButton, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { Cursor } from '../components/index';
import { RenderUIProps, UIElement, UIElements, Element, SelectElement, UIOptions, defaultOption } from '../components/UIElements';
import './Home.css';

var currElementState:any = null;
const Home: React.FC = () => {

    // reference canvas element
    var canvasRef = useRef<HTMLCanvasElement>(null);
    var colorPickerRef = useRef<HTMLInputElement>(null);
    var canvasObj:fabric.Canvas;
    var panPosition:{[key:string]:any} = {
        isDragging: false,
        lastPosX: 0,
        lastPosY: 0
    }
    var touchEvents: {[key:string]:any} = {
        scale: 1,
        lastScale: 1
    }

    // Local States
    const [forceRender, setForceRender] = useState<boolean>(false);
    const [canvas, setCanvas] = useState<fabric.Canvas|null>(null);
    const [currElement, setCurrElement] = useState<SelectElement>(defaultOption);

    // React Lifecycles
    useEffect(()=> {
        initDrawPad();
    },[]);

    useEffect(()=>{
        currElementState = currElement;
    },[currElement])

    useEffect(() => {
    },[forceRender]);

    const initDrawPad = () => {
        canvasObj = new fabric.Canvas(canvasRef.current!,{
            isDrawingMode:true,
            height: percentageToPixel(84),
            width: percentageToPixel(96, window.screen.width),
            allowTouchScrolling:false
        });
        eventHandler(canvasObj);
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
        updateFabric(opt);
        setCurrElement(updateElement);
    }

    const updateFabric = (opt:UIElement):void => {
        
        if(!canvasObj) { canvasObj = canvas!; }
        
        switch(opt['key']) {
            case Element.cursor:
                canvasObj.isDrawingMode = false;
                canvasObj.defaultCursor = "default";
                break;
            case Element.pencil:
                canvasObj.isDrawingMode = true;
                canvasObj.freeDrawingCursor = `url(${Cursor.customCursor({icon: FaPencilAlt})}) , crosshair`;
                drawingMode();
                break;
            case Element.pan:
                canvasObj.isDrawingMode = false;
                canvasObj.defaultCursor = "grab";
                break;
            case Element.palette:
                canvasObj.isDrawingMode = false;
                colorPickerRef.current?.click();
                break;
            default :
                break;
        }
        setCanvas(canvasObj);
        
    }

    const drawingMode = (): void => {
        if(!canvasObj) { canvasObj = canvas!; }
        canvasObj.freeDrawingBrush.color = "#000";
    }

    const getDrawCursor = () => {
        const brushColor = 'hotpink';
        const brushSize = 30;
        const circle = `
            <svg
                height="${ brushSize }"
                fill="${ brushColor }"
                viewBox="0 0 ${ brushSize * 2 } ${ brushSize * 2 }"
                width="${ brushSize }"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    cx="50%"
                    cy="50%"
                    r="${ brushSize }" 
                />
            </svg>
        `;
        
        return `data:image/svg+xml;base64,${ window.btoa(circle) }`;
    };

    const eventHandler = (canvasObj:fabric.Canvas) => {
        canvasObj.on("mouse:down",onMouseDown);
        canvasObj.on("mouse:up",onMouseUp);
        canvasObj.on("mouse:move",onMouseMove);
        canvasObj.on("mouse:wheel",onMouseWheel);
        // canvasObj.on("touch:gesture", touchPressHandler);
    }

    const touchPressHandler = (opt: any) => {
        opt.e.preventDefault();
        opt.e.stopPropagation();
        console.log(opt.e);
    }

    const onMouseDown = (opt:any) => {

        // Pan around 
        if (currElementState['selectedOptionKey'] == Element.pan) {
            canvasObj.defaultCursor = "grabbing";
            panPosition['isDragging'] = true;
            panPosition['lastPosX'] = opt.e.clientX;
            panPosition['lastPosY'] = opt.e.clientY;
        }

    }

    const onMouseUp = (opt:any) => {

        // Pan around 
        if (currElementState['selectedOptionKey'] == Element.pan) {
            canvasObj.defaultCursor = "grab";
            panPosition['isDragging'] = false;
        }

    }

    const onMouseMove = (opt:any) => {

        if(!canvasObj) { canvasObj = canvas!; }
        if (panPosition['isDragging']) {
            var vpt = canvasObj.viewportTransform!;
            vpt[4] += opt.e.clientX - panPosition['lastPosX'];
            vpt[5] += opt.e.clientY - panPosition.lastPosY;
            canvasObj.requestRenderAll();
            panPosition.lastPosX = opt.e.clientX;
            panPosition.lastPosY = opt.e.clientY;
        }

    }

    const onMouseWheel = (opt: any) => {

        if(!canvasObj) { canvasObj = canvas!; }
        var delta = opt.e.deltaY;
        var zoom = canvasObj.getZoom()!;
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        var zoomPoint = new fabric.Point(opt.e.pageX, opt.e.pageY);
        canvasObj.zoomToPoint(zoomPoint, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();

    }

    const touchPinchZoom = (event: HammerInput) => {
        touchEvents.scale = 1;
        if (event.type == "pinch") {
            touchEvents.scale = Math.max(.999, Math.min(touchEvents.lastScale * (event.scale), 4));
        }
        if(!canvasObj) { canvasObj = canvas!; }
        var zoomPoint = new fabric.Point(event.center.x, event.center.y);
        canvasObj.zoomToPoint(zoomPoint, touchEvents.scale);
        event.preventDefault();
    }

    const touchPinchStart = (event: HammerInput) => {
        canvasObj.isDrawingMode = false;
    }

    const touchPinchEnd = (event: HammerInput) => {
        touchEvents.lastScale = touchEvents.scale;;
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
                        <IonCol size="11">
                            <Gestures
                                recognizers={{
                                    Pinch: {
                                        events: {
                                            pinchstart: touchPinchStart,
                                            pinchend: touchPinchEnd,
                                            pinch: touchPinchZoom
                                        }
                                    }
                                }}
                            >
                            <canvas ref={canvasRef} className="canvas" />
                            </Gestures>
                        </IonCol>
                        <IonCol style={{textAlign:"center"}}>
                            <RenderUIOptions onPress={selectedOption} />
                            <IonButton shape="round" size="default" fill={"outline"} key={"eky"}>
                                <input type="color" ref={colorPickerRef} style={{display:'hidden'}}/>
                            </IonButton>
                            
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
        {UIOptions.map((data:UIElements,elemIndex:number) => data['status'] === true ? data['element'].map((option:UIElement,optIndex:number) => option['status'] === true ? <IonButton shape="round" size="default" fill={option["isActive"] ? "solid" : "outline"} key={option['key']} onClick={()=>onPress(elemIndex, optIndex, option)}>{option['icon']}</IonButton>: null) : null )}
        </>
    );
}

export default Home;
