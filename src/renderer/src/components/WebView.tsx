import { forwardRef, useEffect } from 'react'

interface WebViewProps {
  url: string
}

const WebView = forwardRef<HTMLWebViewElement, WebViewProps>(({ url }, ref) => {
  useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.setAttribute('src', url)
    }
  }, [url, ref])

  return (
    <webview
      ref={ref}
      partition="persist:my-partition"
      src={url}
      className="h-[92vh] w-full mr-2 mb-2 rounded-xl overflow-hidden"
      disablewebsecurity
    />
  )
})

WebView.displayName = 'WebView' // Nombre del componente

export default WebView
