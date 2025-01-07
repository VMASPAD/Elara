/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Logs, Plus, RefreshCcw } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import WebView from './components/WebView'
import Layout from './Layout'

function App(): JSX.Element {
  const webViewRef = useRef<{
    goBack: () => void
    goForward: () => void
    reload: () => void
    addEventListener: (event: string, handler: (event: any) => void) => void
    removeEventListener: (event: string, handler: (event: any) => void) => void
  } | null>(null)

  const [tabs, setTabs] = useState([{ id: 1, url: 'https://www.google.com.ar/' }])
  const [activeTabId, setActiveTabId] = useState(1)
  const [inputUrl, setInputUrl] = useState(tabs[0].url)

  useEffect(() => {
    if (webViewRef.current) {
      const handleNavigation = (event: { url: string }): void => {
        setTabs((prevTabs) =>
          prevTabs.map((tab) => (tab.id === activeTabId ? { ...tab, url: event.url } : tab))
        )
        setInputUrl(event.url)
      }
      webViewRef.current.addEventListener('did-navigate', handleNavigation)

      return () => {
        webViewRef.current?.removeEventListener('did-navigate', handleNavigation)
      }
    }
    return undefined
  }, [webViewRef, activeTabId])

  const handleBack = (): void => {
    webViewRef.current?.goBack()
  }

  const handleForward = (): void => {
    webViewRef.current?.goForward()
  }

  const handleRefresh = (): void => {
    webViewRef.current?.reload()
  }

  const handleUrlChange = (e): void => {
    setInputUrl(e.target.value)
  }

  const handleGoToUrl = (): void => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === activeTabId ? { ...tab, url: inputUrl } : tab))
    )
  }

  const handleNewTab = (): void => {
    const newTabId = tabs.length + 1
    setTabs([...tabs, { id: newTabId, url: 'https://www.google.com.ar/' }])
    setActiveTabId(newTabId)
    setInputUrl('https://www.google.com.ar/')
  }

  const handleGoToUrlTab = (tabId: number): void => {
    setActiveTabId(tabId)
    const selectedTab = tabs.find((tab) => tab.id === tabId)
    if (selectedTab) {
      setInputUrl(selectedTab.url)
    }
  }

  const log = (): void => {
    console.log(tabs)
  }

  return (
    <>
      <div className="flex flex-row space-x-2 p-4">
        <Button onClick={handleBack}>
          <ArrowLeft />
        </Button>
        <Button onClick={handleForward}>
          <ArrowRight />
        </Button>
        <Button onClick={handleRefresh}>
          <RefreshCcw />
        </Button>
        <Input
          value={inputUrl}
          onChange={handleUrlChange}
          placeholder="Enter URL"
          className="flex-1"
        />
        <Button onClick={handleGoToUrl}>Go</Button>

        <Button onClick={handleNewTab}>
          <Plus />
        </Button>
        <Button onClick={log}>
          <Logs />
        </Button>
      </div>
      {tabs.map((item) => (
        <div
          key={item.id}
          style={{ display: activeTabId === item.id ? 'block' : 'none' }}
          className="mx-2 mb-2"
        >
          <WebView
            ref={webViewRef as unknown as React.LegacyRef<HTMLWebViewElement>}
            url={item.url}
          />
        </div>
      ))}

      <Layout items={tabs} goTab={handleGoToUrlTab} activeUrl={inputUrl} />
    </>
  )
}

export default App
