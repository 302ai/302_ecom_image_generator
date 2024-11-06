'use client'
import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Image as Img, Transformer, KonvaNodeComponent } from "react-konva";
import ImageManager from "@/utils/Image";

interface ImageEditorProps {
  file: File
  setFile: (file: File | undefined) => void
  ratio: any
  isReady: boolean,
  setIsReady: (d: boolean) => void
  setSrc: (src: string) => void
  action: any,
  setAction: (data: any) => void
  onGenerate: (data?: any) => void,
}

const ImageEditor: React.FC<ImageEditorProps> = ({ file, setFile, ratio, isReady, setIsReady, setSrc, action, setAction, onGenerate }) => {
  const containerRef = useRef<any>(null);
  const imageRef = useRef<any>(null);
  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  const [scale, setScale] = useState(0.2);
  const [rotation,] = useState(0);
  const [imageDrag, setImageDrag] = useState(true);
  const [containerWidth, setContainerWidth] = useState(0);
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [sceneImage, setSceneImage] = useState<HTMLImageElement | null>(null)
  const [sceneUrl, setSceneUrl] = useState('');

  const pngToJpg = async (originUrl: any) => {
    return new Promise((resolve) => {
      const originImage = new Image()
      originImage.onload = () => {
        const newCanvas = document.createElement('canvas')
        newCanvas.width = originImage.width * 1
        newCanvas.height = originImage.height * 1
        const newContext = newCanvas.getContext('2d')
        if (newContext) {
          newContext.drawImage(
            originImage,
            0,
            0,
            newCanvas.width,
            newCanvas.height,
          )
          const imageData = newContext.getImageData(0, 0, newCanvas.width, newCanvas.height)
          newContext.putImageData(imageData, 0, 0)
          const newUrl = newCanvas.toDataURL("image/jpeg")
          resolve(newUrl)
        }
      }
      originImage.src = originUrl
    })
  }

  const handleTransform = () => {
    if (trRef.current && imageRef.current) {
      trRef.current.setNode(imageRef.current);
      trRef.current.getLayer()?.batchDraw();
    }
  };

  const handleDownload = async () => {
    setImageDrag(false)
    setTimeout(async () => {
      let dataURL = stageRef.current.toDataURL({ pixelRatio: 4 });
      dataURL = await pngToJpg(dataURL)
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'canvas.jpeg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setImageDrag(true)
    }, 100)
  };

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setTimeout(() => {
          const newWidth = containerRef.current.offsetWidth
          setContainerWidth(newWidth);
          if (image?.width) {
            const conWidth = Number(newWidth)
            const imgWidth = Number(image.width)
            const imgScale = (conWidth - 200) / imgWidth
            setScale(imgScale)
            handleTransform()
          }

        }, 30)
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [image, ratio]);

  useEffect(() => {
    if (action.productFile) {
      const productUrl = URL.createObjectURL(action.productFile)
      const productImg = new Image()
      productImg.onload = () => {
        setImage(productImg)
      }
      productImg.src = productUrl
    }

    if (action.sceneType === 'image' && action.sceneFile) {
      const sceneUrl = URL.createObjectURL(action.sceneFile)
      setSceneUrl(sceneUrl)
      const sceneImg = new Image()
      sceneImg.onload = () => {
        setSceneImage(sceneImg)
      }
      sceneImg.src = sceneUrl
    }

  }, [action])

  useEffect(() => {
    if (isReady) {
      setIsReady(false)
      const handleProcess = async () => {
        setImageDrag(false)
        setTimeout(async () => {
          let dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
          dataURL = await pngToJpg(dataURL)
          const newFile = await ImageManager.imageToFile(dataURL)
          setSrc(dataURL)
          setAction((preActions: any) => { return { ...preActions, productFile: newFile } });
          const newActionData = { ...action, productFile: newFile }
          onGenerate(newActionData)
          setImageDrag(true)
        }, 30)
      };
      handleProcess()
    }
  }, [isReady, setIsReady, setSrc, setFile, action, setAction, onGenerate])

  if (!image) return null

  return (
    <div ref={containerRef} id="image-editor" className="w-full">
      <div className=" w-full relative overflow-hidden bg-white border-[1px] border-solid border-[rgba(222,222,222,1)] rounded-2xl shadow-sm">
        <Stage ref={stageRef} width={Math.floor(containerWidth)} height={Math.floor(containerWidth / ratio)} className="w-full">
          {<Layer>
            <Rect
              width={Math.floor(containerWidth)}
              height={Math.floor(containerWidth / ratio)}
              fill="#ffffff"
            />
          </Layer>}
          {
            sceneImage && action.generateType === 'light-bg' && <Layer>
              <Img
                opacity={imageDrag ? 0.3 : 0}
                width={containerWidth}
                height={containerWidth / ratio}
                image={sceneImage}
              />
            </Layer>
          }
          <Layer>
            <Img
              image={image}
              ref={imageRef}
              draggable
              rotation={rotation}
              scaleX={scale}
              scaleY={scale}
              onDragEnd={handleTransform}
              onTransformEnd={handleTransform}
              x={100}
              y={50}
              align="center"
            />
            <Transformer ref={trRef} visible={imageDrag} />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default ImageEditor;