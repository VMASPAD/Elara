/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useEffect, useState, useRef } from 'react'
import { motion } from 'motion/react'
import Island from './components/ui/island'
import { X } from 'lucide-react'

const Layout = ({ items, goTab, activeUrl, tabEliminate }) => {
  const [selectedId, setSelectedId] = useState(1)
  const [hoveredTab, setHoveredTab] = useState(null)
  const webviewRef = useRef<HTMLWebViewElement>(null)

  const handleSelect = (id) => {
    setSelectedId(id)
  }

  const handleSelectTab = (id) => {
    goTab(id)
  }

  const handleMouseEnter = (id) => {
    setTimeout(() => {
      setHoveredTab(id)
    }, 100)
  }

  const handleMouseLeave = () => {
    setHoveredTab(null)
  }

  useEffect(() => {
    const webview = webviewRef.current
    if (webview) {
      const muteAudioScript = `
        document.querySelectorAll('audio, video').forEach(item => {
          item.muted = true;
          item.pause();
        });
      `

      webview.addEventListener('dom-ready', () => {
        (webview as any).executeJavaScript(muteAudioScript)
      })
    }

    return () => {
      if (webview) {
        webview.removeEventListener('dom-ready', () => {})
      }
    }
  }, [selectedId])

  const eliminateTab = (id) => {
    if (items.length > 1) {
      items = items.filter(item => item.id !== id)
      tabEliminate(id)
    }
  }

  return (
    <Island>
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative flex justify-center left-[6.5rem] top-48">
          {items.map((item, index) => {
            const isSelected = selectedId === item.id
            const offset = (index - selectedId) * 100
            const zIndex = isSelected ? 20 : 10 - Math.abs(index - selectedId)

            return (
              <motion.div
                whileHover={{ scale: 1.1 }}
                key={item.id}
                className={`absolute cursor-pointer p-4 rounded-lg shadow-xl w-[58rem] h-[24rem] overflow-hidden ${
                  isSelected ? 'bg-primary' : 'bg-secondary border-2 border-primary top-5'
                }`}
                onTap={() => handleSelectTab(item.id)}
                onClick={() => handleSelect(item.id)}
                initial={{ rotate: 0, x: 0 }}
                animate={{
                  x: offset,
                  scale: isSelected ? 1.1 : 1,
                  zIndex
                }}
                transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                <webview
                  ref={webviewRef}
                  src={isSelected ? activeUrl : item.url}
                  className="w-full h-full pointer-events-none"
                  style={{ border: 'none' }}
                  id="preview-webview"
                />

                {hoveredTab === item.id && (
                  <>
                    <motion.div
                      className="absolute top-2 left-2 bg-primary-foreground text-black text-sm px-2 py-1 rounded-lg shadow-xl"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      {item.url}
                    </motion.div>
                    <motion.div
                      className="absolute top-2 right-2 bg-primary-foreground text-black text-sm px-2 py-1 rounded-lg shadow-xl"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <X className='cursor-pointer' onClick={() => eliminateTab(item.id)}/>
                    </motion.div>
                  </>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </Island>
  )
}

export default Layout
