import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import ImageCropper from './ImageCropper';
import RatioBar from './RatioBar';
import Locale from "../locales";

const { TextArea } = Input;

interface RatioModalProps {
  visible: any,
  src: string | undefined,
  onCancel: () => void,
  onSubmit: (data: any) => void,
}

export const PHOTO_DEFAULT_PAYLOAD = {
  prompt: '',
  canvas: null,
  model: 'luma',
  ratio: 0,
  label: '1:1',
}

const RatioModal = ({ visible, src, onCancel, onSubmit }: RatioModalProps) => {
  const [form] = Form.useForm();
  const [payload, setPayload] = useState(PHOTO_DEFAULT_PAYLOAD)
  const [show, setShow] = useState(false)

  const handleChange = ({ target }: any) => {
    setPayload((preData: any) => { return { ...preData, prompt: target.value } });
  }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit(payload);
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 200)
  }, [])


  return (
    <Modal open={visible} onCancel={onCancel} footer={null} closable={false} width={600} className='w-full max-w-[300px] sm:max-w-[800px]'>
      <div className="w-full">
        <Form form={form} onFinish={handleSubmit} className='w-full space-y-2'>

          <div className="w-full">
            {src && show &&
              <ImageCropper src={src} payload={payload} setPayload={setPayload} />
            }
          </div>

          <div className="w-full">
            <RatioBar payload={payload} setPayload={setPayload} />
          </div>

          <div className="w-full">
            <TextArea rows={2} placeholder={Locale.Action.CreatVideoPrompt} onChange={handleChange} />
          </div>

          <div className='w-full flex justify-between '>
            <Button onClick={onCancel}>
              {Locale.System.Cancel}
            </Button>
            <Button type="primary" htmlType="submit">
              {Locale.System.Confirm}
            </Button>
          </div>

        </Form>

      </div>

    </Modal >
  );
}
export default RatioModal;