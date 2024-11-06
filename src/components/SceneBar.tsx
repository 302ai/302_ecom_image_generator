import { useState } from 'react'
import { Radio } from 'antd';

interface GenerateProps {
  showSize: 'small' | 'middle',
  generateOptions: any,
  generateType: any,
  setGenerateType: (data: any) => void,
  action: any,
  setAction: (data: any) => void,
  setFile: (data: any) => void,
}


export default function GenerateBar({ showSize, generateOptions, generateType, action, setGenerateType, setAction, setFile }: GenerateProps) {
  const [size, setSize] = useState({ width: 0, height: 0 })

  const onChangeGenerateType = ({ target: { value } }: any) => {
    setGenerateType(value)
    setAction((preAction: any) => { return { ...preAction, generateType: value } })
  };

  return (
    <div id="scene-bar" className='w-full flex justify-center'>
      <Radio.Group
        size={showSize}
        options={generateOptions}
        onChange={onChangeGenerateType}
        value={generateType}
        optionType="button"
        buttonStyle="solid"
      />
    </div>
  )
}
