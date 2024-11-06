/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { CropperRef, Cropper } from 'react-mobile-cropper';
import 'react-mobile-cropper/dist/style.css'

interface PropsData {
    src: string
    payload: any,
    setPayload: (data: any) => void
}

const ImageCropper = ({ src, payload, setPayload }: PropsData) => {
    const cropperRef = React.useRef<any>(null);
    const [imageRatio, setImageRatio] = React.useState(0)
    const [ratio, setRatio] = React.useState<null | Number>(null)

    React.useEffect(() => {
        if (cropperRef.current) {
            cropperRef.current.refresh();
        }
        const img = new Image()
        img.src = src
        img.onload = () => {
            setImageRatio(img.width / img.height)
        }
        img.onerror = () => {
            console.log('Load image error')
        }
    }, [src]);

    React.useEffect(() => {
        if (cropperRef.current) {
            if (payload.ratio) {
                setRatio(payload.ratio)
            } else {
                setRatio(imageRatio)
                setTimeout(() => {
                    setRatio(0)
                }, 20)

            }
            setTimeout(() => {
                cropperRef.current.zoomImage(0.1);
                setPayload((preData: any) => { return { ...preData, canvas: cropperRef.current.getCanvas() } });
            }, 30)
        }
    }, [payload.ratio])

    const onChange = (cropper: CropperRef) => {
        setPayload((preData: any) => { return { ...preData, canvas: cropperRef.current.getCanvas() } });
    };

    return (
        <Cropper
            ref={cropperRef}
            className='cropper !text-primary rounded-xl w-full h-full'
            src={src}
            onChange={onChange}
            stencilProps={{
                aspectRatio: ratio || {
                    minimum: 1 / 16,
                    maximum: 16 / 1,
                },
                movable: false,
            }}
        />
    )
};

export default ImageCropper;