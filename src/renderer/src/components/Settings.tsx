import { useState, useEffect } from 'react'
import { Settings2 } from 'lucide-react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import { Textarea } from './ui/textarea'

// Clave para Local Storage
const LOCAL_STORAGE_KEY = 'customStyle'

// Valor por defecto si no hay nada en localStorage
const DEFAULT_STYLE = `
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 142.1 76.2% 36.3%;
    --primary-foreground: 355.7 100% 97.3%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 142.1 76.2% 36.3%;
    --radius: 0.75rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }

  .dark {
    --background: 20 14.3% 4.1%;
    --foreground: 0 0% 95%;
    --card: 24 9.8% 10%;
    --card-foreground: 0 0% 95%;
    --popover: 0 0% 9%;
    --popover-foreground: 0 0% 95%;
    --primary: 142.1 70.6% 45.3%;
    --primary-foreground: 144.9 80.4% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 15%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 12 6.5% 15.1%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 85.7% 97.3%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 142.4 71.8% 29.2%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}
`

function Settings(): JSX.Element {
  // Estado para almacenar los valores de estilo
  const [styleContent, setStyleContent] = useState<string>('')

  // Función para actualizar la etiqueta <style> en el DOM
  const updateStyleTag = (content: string) => {
    let styleTag = document.getElementById('dynamic-style-tag') as HTMLStyleElement

    if (!styleTag) {
      styleTag = document.createElement('style')
      styleTag.id = 'dynamic-style-tag'
      document.head.appendChild(styleTag)
    }

    styleTag.textContent = content
  }

  // Efecto para cargar el estilo inicial desde el localStorage o usar el valor por defecto
  useEffect(() => {
    const savedStyle = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedStyle) {
      setStyleContent(savedStyle)
      updateStyleTag(savedStyle)
    } else {
      setStyleContent(DEFAULT_STYLE)
      updateStyleTag(DEFAULT_STYLE)
    }
  }, [])

  // Actualizar estilos cada vez que cambie el estado
  useEffect(() => {
    if (styleContent) {
      updateStyleTag(styleContent)
      localStorage.setItem(LOCAL_STORAGE_KEY, styleContent)
    }
  }, [styleContent])

  // Función para manejar el clic en el botón
  const handleUpdateStyles = () => {
    updateStyleTag(styleContent)
    localStorage.setItem(LOCAL_STORAGE_KEY, styleContent)
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          <Settings2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Styles</DialogTitle>
          <DialogDescription>
            Paste your custom CSS styles below and click "Update Styles" to apply and save them
            persistently.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={styleContent}
          onChange={(e) => setStyleContent(e.target.value)}
          placeholder="Enter your CSS styles..."
        />
        <Button onClick={handleUpdateStyles}>Update</Button>
      </DialogContent>
    </Dialog>
  )
}

export default Settings