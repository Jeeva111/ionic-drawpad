import React, { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { GiPencilBrush, GiArrowCursor } from 'react-icons/gi';
import { IonButton, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonImg, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { RenderUIProps, UIElement, UIElements, Element, SelectElement, UIOptions, defaultOption } from '../components/UIElements';
import './Home.css';

var currElementState:any = null;
const Home: React.FC = () => {

    // reference canvas element
    var canvasRef = useRef<HTMLCanvasElement>(null);
    var canvasObj:fabric.Canvas;
    var panPosition:{[key:string]:any} = {
        isDragging: false,
        lastPosX: 0,
        lastPosY: 0
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
            selection:false
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
                canvasObj.freeDrawingCursor = `url(${ cursorStyle() }) 15 15, crosshair`;
                drawingMode();
                break;
            case Element.pan:
                canvasObj.isDrawingMode = false;
                canvasObj.defaultCursor = "grab";
                break;
            default :
                break;
        }
        setCanvas(canvasObj);
        
    }

    const drawingMode = (): void => {

        if(!canvasObj) { canvasObj = canvas!; }
        canvasObj.freeDrawingBrush.color = "#FFF";
    }

    const cursorStyle = () => {
        const circle = `
            <svg width="350" height="140" viewBox="0 0 ${ 30 * 2 } ${ 30 * 2 }" xmlns="http://www.w3.org/2000/svg" style="background:#f6f7f9">
                <g fill="none" fill-rule="evenodd">
                    <path fill="#F04141" style="mix-blend-mode:multiply" d="M61.905-34.23l96.194 54.51-66.982 54.512L22 34.887z"/>
                    <circle fill="#10DC60" style="mix-blend-mode:multiply" cx="155.5" cy="135.5" r="57.5"/><path fill="#3880FF" style="mix-blend-mode:multiply" d="M208.538 9.513l84.417 15.392L223.93 93.93z"/>
                    <path fill="#FFCE00" style="mix-blend-mode:multiply" d="M268.625 106.557l46.332-26.75 46.332 26.75v53.5l-46.332 26.75-46.332-26.75z"/><circle fill="#7044FF" style="mix-blend-mode:multiply" cx="299.5" cy="9.5" r="38.5"/>
                    <rect fill="#11D3EA" style="mix-blend-mode:multiply" transform="rotate(-60 148.47 37.886)" x="143.372" y="-7.056" width="10.196" height="89.884" rx="5.098"/>
                    <path d="M-25.389 74.253l84.86 8.107c5.498.525 9.53 5.407 9.004 10.905a10 10 0 0 1-.057.477l-12.36 85.671a10.002 10.002 0 0 1-11.634 8.42l-86.351-15.226c-5.44-.959-9.07-6.145-8.112-11.584l13.851-78.551a10 10 0 0 1 10.799-8.219z" fill="#7044FF" style="mix-blend-mode:multiply"/>
                    <circle fill="#0CD1E8" style="mix-blend-mode:multiply" cx="273.5" cy="106.5" r="20.5"/>
                </g>
            </svg>
        `;
        
        return `data:image/svg+xml;base64,${ window.btoa(circle) }`;
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
    }

    const onMouseDown = (opt:any) => {

        // Pan around 
        if (currElementState['selectedOptionKey'] == Element.pan) {
            panPosition['isDragging'] = true;
            panPosition['lastPosX'] = opt.e.clientX;
            panPosition['lastPosY'] = opt.e.clientY;
        }

    }

    const onMouseUp = (opt:any) => {

        // Pan around 
        if (currElementState['selectedOptionKey'] == Element.pan) {
            panPosition['isDragging'] = false;
        }

    }

    const onMouseMove = (opt:any) => {

        if(!canvasObj) { canvasObj = canvas!; }
        if (panPosition['isDragging']) {
            canvasObj.defaultCursor = "grabbing";
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
                            <canvas ref={canvasRef} className="canvas" />
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
