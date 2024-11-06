/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Button, Radio } from 'antd'
import Locale from "../locales";

interface PropsData {
  payload: any
  setPayload: (data: any) => void
}

const models = [
  {
    name: 'Kling',
    value: 'kling',
  },
  {
    name: 'Runway',
    value: 'runway',
  },
  {
    name: 'Luma',
    value: 'luma',
  },
]

const ratios = [
  {
    name: '1:1',
    value: 1 / 1,
  },
  {
    name: '16:9',
    value: 16 / 9,
  },
  {
    name: '9:16',
    value: 9 / 16,
  },
  {
    name: '1280:768',
    value: 1280 / 768,
  },
  {
    name: '768:1280',
    value: 768 / 1280,
  },
  {
    name: Locale.Ratio.Customize,
    value: 0,
  },
]

function RatioBar({ payload, setPayload }: PropsData) {

  const handleChangeModel = (model: string) => {
    setPayload((preData: any) => { return { ...preData, model } });
  }

  const handleChangeRatio = (ratio: number, name: string) => {
    setPayload((preData: any) => { return { ...preData, ratio, label: name } });
  }

  React.useEffect(() => {
    if (payload.model === 'luma') {
      setPayload((preData: any) => { return { ...preData, ratio: 0, label: '' } });
    }
    else if (payload.model === 'runway') {
      setPayload((preData: any) => { return { ...preData, ratio: 1280 / 768, label: '1280:768' } });
    } else {
      setPayload((preData: any) => { return { ...preData, ratio: 1 / 1, label: '1:1' } });
    }

  }, [payload.model])

  return (
    <div className='w-full flex flex-col space-y-2 justify-center items-center '>
      <div className="">
        <Radio.Group defaultValue="luma" buttonStyle="solid" size='small'>
          {
            models.map((it, idx) =>
              <Radio.Button
                key={idx}
                value={it.value}
                onClick={() => handleChangeModel(it.value)}
              >
                {it.name}
              </Radio.Button>
            )
          }
        </Radio.Group>
      </div>

      <div className="flex space-x-2 text-md">
        {payload.model === 'kling' &&
          ratios.slice(0, 3).map((it, idx) =>
            <Button
              type={it.value === payload.ratio ? 'primary' : 'default'}
              size={'small'}
              key={it.name}
              onClick={() => handleChangeRatio(it.value, it.name)}
            >
              {it.name}
            </Button>
          )
        }
        {payload.model === 'runway' &&
          ratios.slice(3, 5).map((it, idx) =>
            <Button
              type={it.value === payload.ratio ? 'primary' : 'default'}
              size={'small'}
              key={it.name}
              onClick={() => handleChangeRatio(it.value, it.name)}
            >
              {it.name}
            </Button>
          )
        }
        {payload.model === 'luma' &&
          ratios.slice(5, 6).map((it, idx) =>
            <Button
              type={it.value === payload.ratio ? 'primary' : 'default'}
              size={'small'}
              key={it.name}
              onClick={() => handleChangeRatio(it.value, it.name)}
            >
              {it.name}
            </Button>
          )
        }

      </div>
    </div>
  )
}

export default RatioBar