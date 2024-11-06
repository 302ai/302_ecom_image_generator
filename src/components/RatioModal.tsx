/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Button } from 'antd';
import Locale from "../locales";

interface RatioModalProps {
  visible: any,
  size: any,
  onCancel: () => void,
  onSubmit: (data: any) => void,
}

const RatioModal = ({ visible, size, onCancel, onSubmit }: RatioModalProps) => {
  const [form] = Form.useForm();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    const { width, height } = values;
    if (width && height) {
      const ratio = parseInt(width) / parseInt(height);
      setIsButtonDisabled(!(ratio > 1 / 4 && ratio < 4 / 1));
    } else {
      setIsButtonDisabled(true);
    }
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit(values);
      form.resetFields();
    });
  };

  // use
  useEffect(() => {
    form.setFieldsValue(size)
  }, [])

  return (
    <Modal open={visible} onCancel={onCancel} footer={null} className='w-full max-w-[200px] sm:max-w-[320px]'>
      <div className='py-2 font-bold'>{Locale.Ratio.Title}</div>
      <Form form={form} onFinish={handleSubmit} onValuesChange={handleFormChange}>
        <div className="flex mb-[-20px] space-x-2 items-top">
          <Form.Item name="width" label="" rules={[{ required: true, message: Locale.Ratio.WidthTip }]}>
            <InputNumber placeholder={Locale.Ratio.Width} />
          </Form.Item>
          <div className="text-xl text-slate-500">:</div>
          <Form.Item name="height" label="" rules={[{ required: true, message: Locale.Ratio.HeightTip }]}>
            <InputNumber placeholder={Locale.Ratio.Height} />
          </Form.Item>
          <Form.Item className='flex-1 flex justify-end'>
            <Button type="primary" htmlType="submit" disabled={isButtonDisabled}>
              {Locale.Ratio.Submit}
            </Button>
          </Form.Item>

        </div>
      </Form>
    </Modal >
  );
}
export default RatioModal;