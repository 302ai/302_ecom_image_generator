/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useContext } from 'react'
import { AppContext } from '../store';
import { twMerge } from 'tailwind-merge'
import ImageManager from '@/utils/Image';
import SystemManager from '@/utils/System';
import { Button, message, Modal } from 'antd';
import { ExclamationCircleFilled } from "@ant-design/icons";
import ImageCompare from './ImageCompare';
import ActionBar from './ActionBar';
import ProgressBar from './ProgressBar';
import RatioBox from './RatioBox';
import SceneBar from './SceneBar';
import PromptModal from './PromptModal';
import VideoPlayer from "./VideoPlayer";
import ResultTypeBar from './ResultTypeBar';
import { GetTaskService, UpdateTaskService, UpdateActionService, GetActionService, GetHistorysService, UpdateHistorysService } from '@/libs/api';
import Locale from "../locales";
import dynamic from 'next/dynamic';
const ImageEditor = dynamic(() => import('@/components/ImageEditor'), {
  ssr: false,
});

type Result = {
  imageSrc: string
  prompt: string
  maskFile: File
}

interface Props {
  file: File | undefined
  action: any
  setFile: (file: File | undefined) => void
  setAction: (data: any) => void,
  generateImage: (file: File, action: any) => Promise<Result>
  generateVideo: (url: string, prompt: string) => Promise<any>
}

const RatioOptions = Locale.Landing.RatioOptions
const GenerateOptions = Locale.Landing.GenerateOptions

const ImageUpscaler: React.FC<Props> = ({ file, action, setFile, setAction, generateImage, generateVideo }) => {
  const globalState = useContext(AppContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [src, setSrc] = useState<string | undefined>(undefined)
  const [newSrc, setNewSrc] = useState<string | undefined>(undefined)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [finish, setFinish] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [maxSize, setMaxSize] = useState(16)
  const [contianerWidth, setcontainerWidth] = useState(1200)
  const [vidoeMaxWidth, setVideoMaxWidth] = useState(1200)
  const tip = useRef(false)
  const startButton = useRef<HTMLButtonElement>(null)
  const [ratioOptions, setRatioOptions] = useState(RatioOptions)
  const [ratio, setRaio] = useState(0)
  const [generateOptions,] = useState(GenerateOptions)
  const [generateType, setGenerateType] = useState('light')
  const [prompt, setPrompt] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [resultTypeOptions,] = useState(Locale.Action.ResultOptions)
  const [resultType, setResultType] = useState('image')
  const [videoSrc, setVideoSrc] = useState('')
  const [videoRatio, setVideoRatio] = useState(1)
  const { confirm } = Modal;

  useEffect(() => {
    if (!file) return
    if (!tip.current) {
      tip.current = true
      const pixelM = file.size / (1024 * 1024)
      if (pixelM > 10) {
        onReset()
        showConfirm(Locale.System.ToLarge)
      }
    }

    if (action.result) {
      const url = URL.createObjectURL(action.productFile)
      setSrc(url)
      onDone({ imageSrc: action.result, maskFile: action.maskFile })
      if (action.video) {
        setVideoSrc(action.video)
        setVideoRatio(action.ratio)
      }
    }

    const url = URL.createObjectURL(file)
    const img = new Image()
    img.src = url
    img.onload = () => {
      setImage(img)
      if (img.width && img.height) {
        const ratio = Number(img.width) / Number(img.height)
        let newOptions = JSON.parse(JSON.stringify(RatioOptions))
        newOptions[0].value = ratio
        newOptions = filterRatio(newOptions)
        setRatioOptions(newOptions)
        setRaio(ratio)
        onSize(img.width, img.height)
        const scale = Number(img.height) / Number(img.width)
        if (scale > 1.6)
          return setcontainerWidth(360)
        if (scale > 1.4)
          return setcontainerWidth(400)
        if (scale > 1.2)
          return setcontainerWidth(500)
        if (scale > 1.0)
          return setcontainerWidth(550)
        if (scale > 0.8)
          return setcontainerWidth(600)
        if (scale > 0.6)
          return setcontainerWidth(800)
      }
    }
  }, [file])

  useEffect(() => {
    if (ratio > 1.5)
      return setcontainerWidth(1200)
    if (ratio > 1.4)
      return setcontainerWidth(1100)
    if (ratio > 1.3)
      return setcontainerWidth(900)
    if (ratio > 1.2)
      return setcontainerWidth(800)
    if (ratio > 1)
      return setcontainerWidth(700)
    if (ratio > 0.8)
      return setcontainerWidth(600)
    if (ratio > 0.6)
      return setcontainerWidth(500)
    setcontainerWidth(400)
  }, [ratio])

  useEffect(() => {
    if (videoRatio > 1.5)
      return setVideoMaxWidth(1200)
    if (videoRatio > 1.4)
      return setVideoMaxWidth(1100)
    if (videoRatio > 1.3)
      return setVideoMaxWidth(900)
    if (videoRatio > 1.2)
      return setVideoMaxWidth(800)
    if (videoRatio > 1)
      return setVideoMaxWidth(700)
    if (videoRatio > 0.8)
      return setVideoMaxWidth(600)
    if (videoRatio > 0.6)
      return setVideoMaxWidth(500)
    setVideoMaxWidth(400)
  }, [videoRatio])

  const filterRatio = (options: []) => {
    const set = new Set();
    return options.filter((option) => {
      const { value } = option;
      if (set.has(value)) {
        return false;

      } else {
        set.add(value); return true;
      }
    });
  };

  const onSize = (width: number, height: number) => {
    let finalSize = 0
    const maxPixel = 4194304
    const sizes = [2, 4, 8, 16]
    sizes.forEach((size) => {
      if (width * size * height * size < maxPixel) {
        finalSize = size
      }
    })
    setMaxSize(finalSize)
  }

  const onReset = () => {
    UpdateTaskService({})
    UpdateActionService({})
    setSrc(undefined)
    setFile(undefined)
    setProcessing(false)
    setAction({
      generateTimes: 0,
      generateType: 'light',
      maskFile: null,
      prompt: '',
      productType: 'product',
      productText: '',
      productFile: null,
      sceneType: 'text',
      sceneText: '',
      sceneFile: null,
      lightType: 'None',
      result: '',
      video: '',
      ratio: 1,
    })
  }

  const onInit = () => {
    setNewSrc('')
    setProcessing(true)
    setFinish(false)
    setIsDone(false)
  }

  const onDone = (result: any) => {
    setNewSrc(result.imageSrc)
    setProcessing(false)
    setFinish(true)
  }

  const handleHistoryAdd = async (item: any) => {
    const history = { ...item, id: Date.now() }
    let historys = GetHistorysService();
    if (item.video) {
      historys = historys.slice(0, -1)
    }
    historys = [...historys, history];
    UpdateHistorysService(historys);
  };

  const onGenerate = (newAction = action) => {
    if (!file) return
    const actionData = { ...newAction }
    onInit()
    generateImage(file, actionData)
      .then(
        async (result) => {
          setIsDone(true)
          actionData.result = result.imageSrc
          actionData.prompt = result.prompt
          actionData.maskFile = null
          actionData.generateTimes += 1
          if (action.productFile) {
            const base64 = await ImageManager.fileToBase64(actionData.productFile)
            actionData.productFile = base64
          }
          if (action.sceneFile) {
            const base64 = await ImageManager.fileToBase64(actionData.sceneFile)
            actionData.sceneFile = base64
          }
          const task = GetTaskService()
          if (task && task.id) {
            UpdateActionService(actionData)
            handleHistoryAdd(actionData)
          }
          setAction((preActions: any) => {
            return { ...preActions, generateTimes: actionData.generateTimes, maskFile: result.maskFile, prompt: result.prompt }
          });
          messageApi.info(Locale.Action.DownloadImageTip);
          onDone(result)
          UpdateTaskService({})
        },
        (e) => {
          throw e
        }
      )
      .catch((e) => {
        if (e.error) {
          const error = e.error.err_code + ''
          if (error === '-10001') {
            showConfirm(Locale.Code.TokenMiss)
          }
          else if (error === '-10002') {
            showConfirm(Locale.Code.TokenInvalid)
          }
          else if (error === '-10003') {
            showConfirm(Locale.Code.InternalError)
          }
          else if (error === '-10004') {
            showConfirm(Locale.Code.AccountOut)
          }
          else if (error === '-10005') {
            showConfirm(Locale.Code.TokenExpired)
          }
          else if (error === '-10006') {
            showConfirm(Locale.Code.TotalOut)
          }
          else if (error === '-10007') {
            showConfirm(Locale.Code.TodayOut)
          }
          else if (error === '-10012') {
            showConfirm(Locale.Code.HourOut, '-10012')
          }
        } else {
          const task = GetTaskService()
          if (task && task.id) {
            const content = `${Locale.Error.NetworkError} (${Locale.System.Task} ID: ${task.id})`
            showConfirm(content);
          } else {
            showConfirm(Locale.Error.NetworkError);
          }
        }
      })
  }

  const onResetVideo = () => {
    setProcessing(false)
  }

  const onStartGenerate = () => {
    let user = window.location.hostname.split('.')[0]
    user = user.split('-')[0]
    if (['302aitool10', '302aitool10-ecom1', '302tool6', '302tool6-ecom1'].includes(user)) {
      return showUpsellConfirm()
    }
    setModalVisible(true)
  }

  const onReGenerate = () => {
    setModalVisible(true)
  }

  // 生成视频
  const onGenerateVideo = (newSrc: string | undefined, payload: any) => {
    if (!newSrc) return
    setResultType('image')
    setFinish(false)
    setIsDone(false)
    setProcessing(true)
    generateVideo(newSrc, payload)
      .then(
        (result) => {
          setIsDone(true)
          UpdateTaskService({})
          const actionData = GetActionService()
          actionData.video = result.video
          actionData.ratio = result.ratio
          UpdateActionService(actionData)
          handleHistoryAdd(actionData)
          setAction((preActions: any) => {
            return { ...preActions, video: result.video, ratio: result.ratio }
          });
          messageApi.info(Locale.Action.DownloadVideoTip);
          setTimeout(() => {
            setVideoSrc(result.video)
            setVideoRatio(result.ratio)
            setResultType('video')
            setProcessing(false)
            setFinish(true)
          }, 600)
        },
        (e) => {
          setResultType('image')
          throw e
        }
      )
      .catch((e) => {
        if (e.error) {
          const error = e.error.err_code + ''
          if (error === '-10001') {
            showConfirm(Locale.Code.TokenMiss)
          }
          else if (error === '-10002') {
            showConfirm(Locale.Code.TokenInvalid)
          }
          else if (error === '-10003') {
            showConfirm(Locale.Code.InternalError)
          }
          else if (error === '-10004') {
            showConfirm(Locale.Code.AccountOut)
          }
          else if (error === '-10005') {
            showConfirm(Locale.Code.TokenExpired)
          }
          else if (error === '-10006') {
            showConfirm(Locale.Code.TotalOut)
          }
          else if (error === '-10007') {
            showConfirm(Locale.Code.TodayOut)
          }
          else if (error === '-10012') {
            showConfirm(Locale.Code.HourOut, '-10012')
          }
          else if (error === '-10011') {
            showConfirm(Locale.Code.ErrorPrompt)
          }

        } else {
          const task = GetTaskService()
          if (task && task.id) {
            const content = `${Locale.Error.NetworkError} (${Locale.System.Task} ID: ${task.id})`
            showConfirm(content);
          } else {
            showConfirm(Locale.Error.NetworkError);
          }
        }
      })
  }

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleModalSubmit = (values: any) => {
    setModalVisible(false);
    setVideoSrc('')
    setPrompt(values.prompt)
    onGenerateVideo(newSrc, values)
  };

  const onDownloadImage = async () => {
    if (!newSrc) {
      return
    }
    const file = await ImageManager.imageToFile(newSrc)
    const localUrl = URL.createObjectURL(file as File);
    const time = SystemManager.getNowformatTime()
    let resultName = `result-${time}.png`
    SystemManager.downloadImage(localUrl, resultName)
  }

  const onDownloadVideo = () => {
    if (!videoSrc) {
      return
    }
    const time = SystemManager.getNowformatTime()
    let resultName = `result-${time}.mp4`
    SystemManager.downloadVideo(videoSrc, resultName)
  }

  const showConfirm = (content: string, code?: string) => {
    setResultType('image')
    setProcessing(false);
    setFinish(true);
    confirm({
      title: Locale.System.Notify,
      icon: <ExclamationCircleFilled />,
      okText: Locale.System.Confirm,
      content: <>
        <p>{content}</p>
        {code && code === '-10012'
          ?
          <p>
            {Locale.System.Visit}
            <a className="text-primary, underline" href={globalState.domain} target="_blank"> 302.AI </a>
            {Locale.System.Create}
          </p>
          :
          <p>{Locale.About.More}<a className="text-primary, underline" href={globalState.domain} target="_blank">302.AI</a></p>
        }
      </>,
      onOk() {
        if (newSrc) {
          onResetVideo();
        } else {
          onReset();
        }
      },
      okButtonProps: {
        style: { background: '#7728f5' }
      },
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <OkBtn />
        </>
      ),
    });
  };

  const showUpsellConfirm = () => {
    setProcessing(false);
    confirm({
      title: Locale.System.Notify,
      icon: <ExclamationCircleFilled />,
      okText: Locale.System.Confirm,
      content: <>
        <p>{Locale.System.Nosupport},</p>
        <p>{Locale.System.Visit}<a className="text-primary, underline" href={globalState.domain} target="_blank">302.AI</a>{Locale.System.Create}</p>
      </>,
      okButtonProps: {
        style: { background: '#7728f5' }
      },
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <OkBtn />
        </>
      ),
    });
  };

  const showBackConfirm = () => {
    if (!processing) {
      onReset()
      return
    }
    confirm({
      title: Locale.System.Notify,
      icon: <ExclamationCircleFilled />,
      okText: Locale.System.Confirm,
      cancelText: Locale.System.Cancel,
      content: <>
        <p>{Locale.Action.Break}</p>
      </>,
      onOk() {
        onReset()
      },
      okButtonProps: {
        style: { background: '#7728f5' }
      },
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      ),
    });
  };

  return (
    <div id="image-upscaler" className="flex w-full flex-col space-y-4 justify-center items-center">
      {
        file && <section className="show bg-base-200 flex flex-col w-full justify-center space-y-4" style={{ maxWidth: resultType === 'image' ? contianerWidth : vidoeMaxWidth }}>
          {
            newSrc && videoSrc && <div className='w-full'>
              {
                <ResultTypeBar showSize='middle' resultTypeOptions={resultTypeOptions} resultType={resultType} setResultType={setResultType} />
              }
            </div>
          }
          <div className="flex w-full items-center justify-center overflow-hidden">
            <div
              className={twMerge(
                'relative w-full transition-all duration-700',
                processing ? 'translate-y-2' : ''
              )}
            >
              {
                src ? (
                  newSrc ? <img
                    className={twMerge(
                      'w-full rounded-2xl transition-all duration-700',
                      !processing ? 'hidden' : '',
                    )}
                    src={newSrc}
                    alt="upscaler image"
                  /> : <img
                    className={twMerge(
                      'w-full rounded-2xl transition-all duration-700',
                    )}
                    src={src}
                    alt="upscaler image"
                  />
                ) : <ImageEditor file={file} setFile={setFile} ratio={ratio} isReady={isReady} setIsReady={setIsReady} setSrc={setSrc} action={action} setAction={setAction} onGenerate={onGenerate} />
              }

              {
                !processing && src && newSrc && resultType === 'image' && <div className='result w-full'>
                  <ImageCompare
                    beforeSrc={src}
                    afterSrc={newSrc}
                    initPosition={20}
                  />
                </div>

              }
              {
                videoSrc && resultType === 'video' && <div className='w-full rounded-xl overflow-hidden' style={{ background: 'rgb(245, 245, 245, 0.6)' }}>
                  <VideoPlayer
                    url={videoSrc}
                    width="100%"
                    height="auto"
                  />
                </div>
              }

              <div
                className={twMerge(
                  'scan absolute top-0 transition-all duration-200',
                  'pointer-events-none',
                  processing ? '' : 'opacity-0'
                )}
                style={{
                  height: '100%',
                  width: '100%',
                }}
              ></div>
            </div>
          </div>
        </section>
      }

      <section className="w-full max-w-[800px]">
        {
          !finish
            ? (
              processing
                ? <div className='flex-1 lg:hidden mb-4'> <ProgressBar seconds={resultType === 'image' ? 60 * 2 : 60 * 20} finish={isDone} message={resultType === 'image' ? Locale.Action.WaitImage : Locale.Action.WaitVideo} /></div>
                : <div className='flex-1 lg:hidden mb-4 flex flex-col justify-center items-center space-y-2'>
                  <RatioBox showSize="small" image={image} ratioOptions={ratioOptions} setRatioOptions={setRatioOptions} ratio={ratio} setRatio={setRaio} />
                  {action.sceneType === 'image' && <SceneBar showSize="small" generateOptions={generateOptions} generateType={generateType} action={action} setGenerateType={setGenerateType} setAction={setAction} setFile={setFile} />}
                </div>
            )
            : <div className='flex-1 lg:hidden mb-4'><ActionBar action={action} resultType={resultType} setAction={setAction} onGenerateImage={onGenerate} onGenerateVideo={onStartGenerate} onReGenerateVideo={onReGenerate} /></div>
        }

        <div className="w-full flex justify-between items-center space-x-2">
          <Button
            type='primary'
            ghost
            className="btn"
            onClick={showBackConfirm}>
            {Locale.System.Back}
          </Button>

          {
            !finish
              ? (
                processing
                  ? <div className='flex-1 hidden lg:block'><ProgressBar seconds={resultType === 'image' ? 60 * 2 : 60 * 20} finish={isDone} message={resultType === 'image' ? Locale.Action.WaitImage : Locale.Action.WaitVideo} /></div>
                  : <div className='flex-1 hidden lg:block flex flex-col justify-center items-center space-y-2'>
                    <RatioBox showSize='middle' image={image} ratioOptions={ratioOptions} setRatioOptions={setRatioOptions} ratio={ratio} setRatio={setRaio} />
                    {action.sceneType === 'image' && <SceneBar showSize='middle' generateOptions={generateOptions} generateType={generateType} action={action} setGenerateType={setGenerateType} setAction={setAction} setFile={setFile} />}
                  </div>
              )
              : <div className='flex-1 hidden lg:block'><ActionBar action={action} resultType={resultType} setAction={setAction} onGenerateImage={onGenerate} onGenerateVideo={onStartGenerate} onReGenerateVideo={onReGenerate} /></div>
          }


          {
            !newSrc
              ? <Button ref={startButton} disabled={!!processing} type='primary' onClick={() => setIsReady(true)}>{Locale.System.Start}</Button>
              : resultType === 'video' && videoSrc
                ? <Button type='primary' onClick={onDownloadVideo}>{Locale.Action.DownloadVideo}</Button>
                : <Button type='primary' onClick={onDownloadImage}>{Locale.Action.DownloadImage}</Button>
          }

        </div>
      </section>

      <section>
        {modalVisible && <PromptModal
          visible={modalVisible}
          src={newSrc}
          onSubmit={handleModalSubmit}
          onCancel={handleModalCancel}
        />}
      </section>

      <>
        {contextHolder}
      </>
    </div >
  )
}

export default ImageUpscaler
