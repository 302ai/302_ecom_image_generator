/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Radio } from 'antd';
import RatioModal from './RatioModal';

interface RatioProps {
  showSize: 'small' | 'middle',
  image: any,
  ratioOptions: any,
  ratio: any,
  setRatio: (data: any) => void,
  setRatioOptions: (data: any) => void,
}


export default function RatioBox({ showSize, image, ratioOptions, ratio, setRatio, setRatioOptions }: RatioProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 })

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleModalSubmit = (values: any) => {
    const newRatio = values.width / values.height
    const item = ratioOptions.find((it: any) => it.value === newRatio)
    if (!item) {
      const newItem = JSON.parse(JSON.stringify(ratioOptions[1]))
      newItem.id = ratioOptions.length
      newItem.label = `${values.width}:${values.height}`
      newItem.value = newRatio
      setRatioOptions((preOptions: any) => { return [...preOptions, newItem] })
    }
    setRatio(newRatio)
    setSize(values)
    setModalVisible(false);
  };

  const onChangeRatio = ({ target }: any) => {
    if (target.id === -1) {
      setRatio(target.value)
      setSize({
        width: image.width,
        height: image.height,
      })
      return
    }
    if (target.id === 0) {
      setModalVisible(true)
      return
    }
    setRatio(target.value)
    const item = ratioOptions.find((it: any) => it.id === target.id)
    const [width, height] = item.label.split(':')
    setSize({ width: 1, height: 2 })
    setSize({
      width: Number(width),
      height: Number(height),
    })
  };

  useEffect(() => {
    if (image && !size.width) {
      setSize({
        width: image.width,
        height: image.height,
      })
    }
  }, [ratio])

  useEffect(() => {
    if (image) {
      setSize({
        width: image.width,
        height: image.height,
      })
    }
  }, [image])

  return (
    <div className='w-full flex justify-center'>
      <Radio.Group
        size={showSize}
        options={ratioOptions}
        onChange={onChangeRatio}
        value={ratio}
        optionType="button"
        buttonStyle="solid"
      />

      <div>
        {modalVisible && <RatioModal
          visible={modalVisible}
          size={size}
          onSubmit={handleModalSubmit}
          onCancel={handleModalCancel}
        />}
      </div>
    </div>
  )
}
