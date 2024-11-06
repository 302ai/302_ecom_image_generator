/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'

interface Props {
  dropBox: any
  children: React.ReactNode
  onDrop: (files: FileList) => void
  onDrag?: (dragging: boolean) => void
}

export default function DropZone({ dropBox, children, onDrop, onDrag }: Props) {
  useEffect(() => {
    if (!dropBox.current) return
    function handleDrop(e: DragEvent) {
      e.preventDefault()
      if (e.dataTransfer) onDrop(e.dataTransfer.files)
      onDrag?.(false)
    }

    function handleDragover(e: DragEvent) {
      e.preventDefault()
      onDrag?.(true)
    }

    function handleDragleave(e: DragEvent) {
      e.preventDefault()
      onDrag?.(false)
    }

    dropBox.current.addEventListener('drop', handleDrop)
    dropBox.current.addEventListener('dragover', handleDragover)
    dropBox.current.addEventListener('dragleave', handleDragleave)
    return () => {
      dropBox.current?.removeEventListener('drop', handleDrop)
      dropBox.current?.removeEventListener('dragover', handleDragover)
      dropBox.current?.removeEventListener('dragleave', handleDragleave)
    }
  }, [dropBox, onDrop, onDrag])

  return <>{children}</>
}
