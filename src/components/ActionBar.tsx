import { Button } from 'antd';
import Locale from "../locales";

interface ActionProps {
  action: any,
  resultType: string,
  setAction: (data: any) => void,
  onGenerateImage: (data: any) => void,
  onGenerateVideo: () => void,
  onReGenerateVideo: () => void,
}

export default function ActionBar({ action, resultType, onGenerateImage, onGenerateVideo, onReGenerateVideo }: ActionProps) {
  return (
    <div id="action-bar" className='w-full flex justify-center md:space-x-2 flex-col md:flex-row items-center space-y-2 md:space-y-0'>
      <div className='space-x-2 flex items-center '>
        {resultType === 'image' && <Button type='primary' onClick={() => onGenerateImage(action)}>{Locale.Action.RegenerateImage}</Button>}
        {action.video && resultType === 'video' && <Button type='primary' onClick={() => onReGenerateVideo()}>{Locale.Action.ReGenerateVideo}</Button>}
        {!action.video && <Button type='primary' style={{ background: '#407df1' }} onClick={() => onGenerateVideo()}>{Locale.Action.CreatVideo}</Button>}
      </div>
    </div>
  )
}
