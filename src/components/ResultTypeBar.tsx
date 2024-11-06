import { Radio } from 'antd';

interface ResultTypeProps {
  showSize: 'middle' | 'small'
  resultTypeOptions: any,
  resultType: any,
  setResultType: (data: any) => void,
}

export default function ResultTypeBar({ showSize, resultTypeOptions, resultType, setResultType }: ResultTypeProps) {
  const onChangeResultType = ({ target }: any) => {
    setResultType(target.value)
  };

  return (
    <div className='w-full flex justify-center'>
      <Radio.Group
        size={showSize}
        options={resultTypeOptions}
        onChange={onChangeResultType}
        value={resultType}
        optionType="button"
        buttonStyle="solid"
      />
    </div>
  )
}
