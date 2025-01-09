/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Plus, RefreshCcw } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import WebView from './components/WebView'
import Layout from './Layout'
import Settings from './components/Settings'

function App(): JSX.Element {
  const webViewRef = useRef<{
    goBack: () => void
    goForward: () => void
    reload: () => void
    addEventListener: (event: string, handler: (event: any) => void) => void
    removeEventListener: (event: string, handler: (event: any) => void) => void
  } | null>(null)

  const [tabs, setTabs] = useState<{ id: number; url: string; history: string[]; forwardStack: string[] }[]>([
    {
      id: 1,
      url: 'https://www.google.com.ar/',
      history: ['https://www.google.com.ar/'],
      forwardStack: []
    }
  ])
  const [activeTabId, setActiveTabId] = useState(1)
  const [inputUrl, setInputUrl] = useState(tabs[0].url)

  useEffect(() => {
    if (webViewRef.current) {
      const handleNavigation = (event: { url: string }): void => {
        setTabs((prevTabs) =>
          prevTabs.map((tab) => {
            if (tab.id === activeTabId) {
              if (tab.url !== event.url) {
                return {
                  ...tab,
                  url: event.url,
                  history: [...tab.history, event.url],
                  forwardStack: []
                }
              }
            }
            return tab
          })
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
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTabId && tab.history.length > 1) {
          const updatedHistory = tab.history.slice(0, -1)
          const currentUrl = tab.url
          return {
            ...tab,
            url: updatedHistory[updatedHistory.length - 1],
            history: updatedHistory,
            forwardStack: [currentUrl, ...tab.forwardStack]
          }
        }
        return tab
      })
    )
  }

  const handleForward = (): void => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTabId && tab.forwardStack.length > 0) {
          const newUrl = tab.forwardStack[0]
          const updatedForwardStack = tab.forwardStack.slice(1)
          return {
            ...tab,
            url: newUrl,
            history: [...tab.history, newUrl],
            forwardStack: updatedForwardStack
          }
        }
        return tab
      })
    )
  }

  const handleRefresh = (): void => {
    webViewRef.current?.reload()
  }

  const handleUrlChange = (e): void => {
    setInputUrl(e.target.value)
  }

  const handleGoToUrl = (): void => {
    const searchQuery = inputUrl.trim()
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`

    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTabId) {
          const updatedHistory = [...tab.history, googleSearchUrl]
          return { ...tab, url: googleSearchUrl, history: updatedHistory, forwardStack: [] }
        }
        return tab
      })
    )
  }

  const handleNewTab = (): void => {
    const newTabId = tabs.length + 1
    setTabs([
      ...tabs,
      {
        id: newTabId,
        url: 'https://www.google.com.ar/',
        history: ['https://www.google.com.ar/'],
        forwardStack: []
      }
    ])
    setActiveTabId(newTabId)
    setInputUrl('')
  }

  const handleGoToUrlTab = (tabId: number): void => {
    setActiveTabId(tabId)
    const selectedTab = tabs.find((tab) => tab.id === tabId)
    if (selectedTab) {
      setInputUrl(selectedTab.url)
    }
  }
  const handleTabEliminate = (tabId: number): void => {
    console.log('Tab eliminado:', tabId);

    // Filtramos el tab que queremos eliminar
    const newTabs = tabs.filter(tab => tab.id !== tabId);

    // Reasignamos los IDs para que queden consecutivos
    const updatedTabs = newTabs.map((tab, index) => ({
      ...tab,
      id: index + 1  // Reasignamos el ID de acuerdo con su posición en el array
    }));

    // Actualizamos el estado con el array de tabs reorganizado
    setTabs(updatedTabs);
  };


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
          placeholder="Enter URL or Search Query"
          className="flex-1"
        />
        <Button onClick={handleGoToUrl}>Search</Button>

        <Button onClick={handleNewTab}>
          <Plus />
        </Button>
        <Settings />
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

      <Layout items={tabs} goTab={handleGoToUrlTab} activeUrl={inputUrl} tabEliminate={handleTabEliminate}/>
    </>
  )
}

export default App
