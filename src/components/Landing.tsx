/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import DropZone from './DropZone'
import Example from './Example';
import HistoryDrawer from './HistoryDrawer';
import type { RadioChangeEvent } from 'antd';
import { Input, Radio, Button } from 'antd';
import { UploadOutlined } from "@ant-design/icons";
import {
  DeleteOutlined,
  LinkOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import Locale from "../locales";
import ImageManager from '@/utils/Image';

const { TextArea } = Input;

const ALLOWED_FILES = ['image/png', 'image/jpeg', 'image/webp']

interface LandingProps {
  file: File | undefined
  setFile: (file: File | undefined) => void
  action: any,
  setAction: (data: any) => void,
  data: any
}

export default function Landing({ file, setFile, action, setAction, data }: LandingProps) {
  const productDropRef = useRef<HTMLDivElement | null>(null)
  const SceneDropRef = useRef<HTMLDivElement | null>(null)
  const inputProductFileRef = useRef<HTMLInputElement | null>(null)
  const inputSceneFileRef = useRef<HTMLInputElement | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [toggleHistory, setToggleHistory] = useState(false)

  const [dragging, setDragging] = useState(false)
  const handleDragging = useCallback((dragging: boolean) => {
    setDragging(dragging)
  }, [])

  const {
    ProductOptions,
    SceneOptions,
    LightOptions,
  } = Locale.Landing

  const handleProductFilesSelected = useCallback(async (files: FileList | Array<File>) => {
    const file = Array.from(files).filter((file) =>
      ALLOWED_FILES.includes(file.type)
    )[0]

    if (file) {
      if (file.type === 'image/png') {
        const newFile = await ImageManager.pngFileToJpgFile(file)
        setAction((preActions: any) => { return { ...preActions, productFile: newFile } });

      } else {
        setAction((preActions: any) => { return { ...preActions, productFile: file } });
      }
    }
    if (inputProductFileRef.current) {
      inputProductFileRef.current.value = ''
    }
  }, [])

  // 选中场景图
  const handleSceneFilesSelected = useCallback(async (files: FileList | Array<File>) => {
    const file = Array.from(files).filter((file) =>
      ALLOWED_FILES.includes(file.type)
    )[0]

    if (file) {
      if (file.type === 'image/png') {
        const newFile = await ImageManager.pngFileToJpgFile(file)
        setAction((preActions: any) => { return { ...preActions, sceneFile: newFile } });
      } else {
        setAction((preActions: any) => { return { ...preActions, sceneFile: file } });
      }
    }
    if (inputSceneFileRef.current) {
      inputSceneFileRef.current.value = ''
    }
  }, [])


  const onChangeProductType = ({ target: { value } }: RadioChangeEvent) => {
    setAction((preActions: any) => { return { ...preActions, productType: value } });
  };
  const onChangeProductText = ({ target: { value } }: any) => {
    setAction((preActions: any) => { return { ...preActions, productText: value } });
  };
  const onChangeSceneType = ({ target: { value } }: RadioChangeEvent) => {
    setAction((preActions: any) => { return { ...preActions, sceneType: value } });
  };
  const onChangeSceneText = ({ target: { value } }: any) => {
    setAction((preActions: any) => { return { ...preActions, sceneText: value } });
  };
  const onChangeLightType = ({ target: { value } }: RadioChangeEvent) => {
    setAction((preActions: any) => { return { ...preActions, lightType: value } });
  };
  const onDeleteProductFile = () => {
    setAction((preActions: any) => { return { ...preActions, productFile: file } });
  }
  const onDeleteSceneFile = () => {
    setAction((preActions: any) => { return { ...preActions, sceneFile: file } });
  }

  const onStart = () => {
    const startFile = action.sceneType === 'image' ? action.sceneFile : action.productFile
    setFile(startFile)
  }

  useEffect(() => {
    setIsReady(false)
    if (action.productFile) {
      if (action.sceneType === 'text') {
        if (action.sceneText) {
          setIsReady(true)
        }

      } else {
        if (action.sceneFile) {
          setIsReady(true)
        }

      }
    }
  }, [action])

  return (
    <div className="flex w-full flex-col items-center space-y-4 max-w-[800px]">
      <section className='w-full space-y-4'>
        <div className="flex justify-between">
          <div className="text-bold font-bold">{Locale.Landing.ProductTitle}</div>
          <Radio.Group
            size='small'
            options={ProductOptions}
            onChange={onChangeProductType}
            value={action.productType}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
        <div className="w-full">
          <Input type="text"
            className='w-full'
            placeholder={action.productType === 'product' ? Locale.Landing.ProductInput : Locale.Landing.ModelInput}
            allowClear
            value={action.productText}
            onChange={onChangeProductText}
          />
        </div>
        <div ref={productDropRef} className="bg-[#7728f5] opacity-60 hover:opacity-40 overflow-hidden rounded-3xl p-4 w-full">
          <DropZone
            dropBox={productDropRef}
            onDrop={(files: any) => handleProductFilesSelected(files)}
            onDrag={handleDragging}
          >
            <div
              className='flex rounded-2xl flex-col items-center justify-center border-4 border-dashed border-gray-100 px-4 py-0 text-center sm:py-8 cursor-pointer'
              onClick={() => inputProductFileRef.current?.click()}
            >
              <UploadOutlined className='text-5xl text-bold text-white' style={{ color: 'white' }} />
              <p className="text-sm text-white mx-16 mt-4 text-center font-bold opacity-100">
                {action.productType === 'product' ? Locale.Landing.ProductUpload : Locale.Landing.ModelUpload}
              </p>
              <input
                type="file"
                ref={inputProductFileRef}
                className={twMerge(
                  'absolute bottom-0 left-0 right-0 top-0',
                  'hidden'
                )}
                accept={ALLOWED_FILES.join(',')}
                onChange={(ev) =>
                  handleProductFilesSelected(ev.currentTarget.files ?? [])
                }
              />
            </div>
          </DropZone>

        </div>
        {action.productFile && <div className="show w-full flex items-center px-4 py-1 bg-[#7728f51c] rounded-xl">
          <div className='flex-1 flex space-x-2 items-end'>
            <div className="w-[20px] h-[20px] rounded-md overflow-hidden">
              <LinkOutlined />
            </div>
            <div className="text-xs text-slate-500">{action.productFile.name}</div>

          </div>
          <div className='text-lg text-[red]'>
            <DeleteOutlined onClick={onDeleteProductFile} />
          </div>
        </div>
        }
      </section>

      <section className='w-full'>
        <div className='w-full text-center text-5xl text-gray-400'>+</div>
      </section>

      <section className='w-full space-y-4'>
        <div className="flex justify-between">
          <div className="text-bold font-bold">{Locale.Landing.SceneTitle}</div>
          <Radio.Group
            size='small'
            options={SceneOptions}
            onChange={onChangeSceneType}
            value={action.sceneType}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
        {
          action.sceneType === 'image' ? (
            <div className="w-full space-y-4">
              <div ref={SceneDropRef} className="bg-[#7728f5] opacity-60 hover:opacity-40 overflow-hidden rounded-3xl p-4 w-full">
                <DropZone
                  dropBox={SceneDropRef}
                  onDrop={(files: any) => handleSceneFilesSelected(files)}
                  onDrag={handleDragging}
                >
                  <div
                    className='flex rounded-2xl flex-col items-center justify-center border-4 border-dashed border-gray-100 px-4 py-0 text-center sm:py-8 cursor-pointer'
                    onClick={() => inputSceneFileRef.current?.click()}
                  >
                    <UploadOutlined className='text-5xl text-bold text-white' style={{ color: 'white' }} />
                    <p className="text-sm text-white mx-16 mt-4 text-center font-bold opacity-100">
                      {Locale.Landing.SceneUpload}
                    </p>
                    <input
                      type="file"
                      ref={inputSceneFileRef}
                      className={twMerge(
                        'absolute bottom-0 left-0 right-0 top-0',
                        'hidden'
                      )}
                      accept={ALLOWED_FILES.join(',')}
                      onChange={(ev) =>
                        handleSceneFilesSelected(ev.currentTarget.files ?? [])
                      }
                    />
                  </div>
                </DropZone>

              </div>
              {action.sceneFile && <div className="show w-full flex items-center px-4 py-1 bg-[#7728f51c] rounded-xl">
                <div className='flex-1 flex space-x-2 items-end'>
                  <div className="w-[20px] h-[20px] rounded-md overflow-hidden">
                    <LinkOutlined />
                  </div>
                  <div className="text-xs text-slate-500">{action.sceneFile.name}</div>

                </div>
                <div className='text-lg text-[red]'>
                  <DeleteOutlined onClick={onDeleteSceneFile} />
                </div>
              </div>
              }

            </div>


          ) : (
            <div className="w-full">
              <div className="w-full hidden md:block">
                <TextArea
                  rows={8}
                  placeholder={Locale.Landing.SceneInput}
                  allowClear
                  value={action.sceneText}
                  onChange={onChangeSceneText}
                />
              </div>
              <div className="w-full block md:hidden ">
                <TextArea
                  rows={4}
                  placeholder={Locale.Landing.SceneInput}
                  allowClear
                  value={action.sceneText}
                  onChange={onChangeSceneText}
                />
              </div>
            </div>
          )
        }


        <div className='w-full'>
          <div className="w-full flex justify-between">
            <Radio.Group
              className='flex-1 text-center'
              size='small'
              options={LightOptions}
              onChange={onChangeLightType}
              value={action.lightType}
            />

          </div>
        </div>
        <div className="w-full flex justify-center p-4 space-x-4 ">
          <div className="block"></div>
          <Button
            type='primary'
            size='large'
            disabled={!isReady}
            onClick={onStart}
          >
            {Locale.Landing.StartGenerate}
          </Button>
          <HistoryOutlined className="my-button my-icon" onClick={() => setToggleHistory(true)} />
        </div>
      </section>

      <section className='w-full'>
        <div className='py-16'></div>
        <Example setFile={setFile} setAction={setAction} />
      </section>

      <HistoryDrawer
        title={Locale.History.Title}
        isOpen={toggleHistory}
        onClose={() => setToggleHistory(false)}
      />


    </div>
  )
}
