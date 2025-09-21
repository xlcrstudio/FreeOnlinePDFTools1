import { ThemeProvider } from '../ThemeProvider'
import { FileUpload } from '../FileUpload'

export default function FileUploadExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background">
        <div className="max-w-2xl mx-auto">
          <FileUpload 
            onFilesSelected={(files) => console.log('Selected files:', files)}
          />
        </div>
      </div>
    </ThemeProvider>
  )
}