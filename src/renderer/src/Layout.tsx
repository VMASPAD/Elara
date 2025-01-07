/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useState } from 'react'
import { motion } from 'motion/react'
import Island from './components/ui/island'

const Layout = ({ items, goTab, activeUrl }) => {
  const [selectedId, setSelectedId] = useState(1)
  const [hoveredTab, setHoveredTab] = useState(null)

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

  return (
    <Island>
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative flex justify-center left-[6.5rem]">
          {items.map((item, index) => {
            const isSelected = selectedId === item.id
            const offset = (index - selectedId) * 100
            const zIndex = isSelected ? 20 : 10 - Math.abs(index - selectedId)

            return (
              <motion.div
                whileHover={{ scale: 1.1 }}
                key={item.id}
                className={`absolute cursor-pointer p-4 rounded-lg shadow-xl w-[68rem] h-[34rem] overflow-hidden ${
                  isSelected ? 'bg-primary' : 'bg-secondary border-2 border-primary top-1'
                }`}
                onTap={() => handleSelectTab(item.id)}
                onClick={() => handleSelect(item.id)}
                initial={{ rotate: 0, x: 0 }}
                animate={{
                  x: offset,
                  scale: isSelected ? 1.1 : 1,
                  zIndex
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                <webview
                  src={isSelected ? activeUrl : item.url}
                  className="w-full h-full pointer-events-none"
                  style={{ border: 'none' }}
                />

                {/* Tooltip */}
                {hoveredTab === item.id && (
                  <motion.div
                    className="absolute top-2 left-2 bg-primary-foreground text-black text-sm px-2 py-1 rounded-lg shadow-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    {item.url}
                  </motion.div>
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
