export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const faqCategories = [
  { id: 'general', name: 'General Questions' },
  { id: 'security', name: 'Security & Privacy' },
  { id: 'features', name: 'Features & Tools' },
  { id: 'technical', name: 'Technical Support' },
  { id: 'pricing', name: 'Pricing & Usage' },
  { id: 'file-formats', name: 'File Formats' },
];

export const faqData: FAQItem[] = [
  // General Questions
  {
    id: 'what-is-pdf-tools',
    question: 'What is Free Online PDF Tools?',
    answer: 'Free Online PDF Tools is a comprehensive web-based platform that provides 25+ essential tools for working with PDF documents. You can merge, split, compress, convert, edit, rotate, unlock, watermark, and perform many other operations on your PDF files completely free of charge.',
    category: 'general'
  },
  {
    id: 'how-much-does-it-cost',
    question: 'How much does it cost to use PDF Tools?',
    answer: 'All our PDF tools are completely free to use. There are no hidden charges, subscription fees, or premium features. You can process unlimited files without any cost.',
    category: 'general'
  },
  {
    id: 'do-i-need-to-register',
    question: 'Do I need to create an account or register?',
    answer: 'No registration is required! You can use all our PDF tools immediately without creating an account, providing email addresses, or any sign-up process.',
    category: 'general'
  },
  {
    id: 'what-devices-supported',
    question: 'What devices and browsers are supported?',
    answer: 'Our PDF tools work on all modern devices including Windows, Mac, Linux, iOS, and Android. They are compatible with Chrome, Firefox, Safari, Edge, and other modern web browsers.',
    category: 'general'
  },
  {
    id: 'file-size-limits',
    question: 'Are there any file size limits?',
    answer: 'Yes, we have a maximum file size limit of 100MB per file to ensure optimal performance and fast processing. This limit accommodates most typical PDF documents.',
    category: 'general'
  },

  // Security & Privacy
  {
    id: 'is-it-secure',
    question: 'Is it safe to upload my PDFs? How secure are my files?',
    answer: 'Yes, your files are completely secure. All uploads are encrypted using HTTPS/SSL. Your files are automatically deleted from our servers after processing, and we never store, share, or access your document content.',
    category: 'security'
  },
  {
    id: 'file-deletion-policy',
    question: 'How long do you keep my files?',
    answer: 'Your files are automatically deleted immediately after processing is complete. We do not store any uploaded files on our servers longer than necessary for the operation.',
    category: 'security'
  },
  {
    id: 'privacy-policy',
    question: 'Do you track or store my personal information?',
    answer: 'We do not collect, store, or track any personal information. We don\'t use cookies for tracking, and we don\'t require any personal details to use our services.',
    category: 'security'
  },
  {
    id: 'sensitive-documents',
    question: 'Can I use this for confidential or sensitive documents?',
    answer: 'While we implement strong security measures, we recommend using extra caution with highly sensitive documents. Consider using offline tools for extremely confidential materials.',
    category: 'security'
  },

  // Features & Tools
  {
    id: 'available-tools',
    question: 'What PDF tools do you offer?',
    answer: 'We offer 25+ tools including: Merge PDFs, Split PDF, Compress PDF, PDF to Word/Excel/PowerPoint, Word/Excel/PowerPoint to PDF, PDF to JPG/PNG, Images to PDF, Rotate PDF, Unlock PDF, Protect PDF, Add Watermark, Edit PDF, Crop PDF, Redact PDF, Compare PDFs, and many more.',
    category: 'features'
  },
  {
    id: 'merge-multiple-files',
    question: 'How many files can I merge at once?',
    answer: 'You can merge multiple PDF files in a single operation. While there\'s no strict limit on the number of files, keep in mind the total combined size should not exceed 100MB for optimal performance.',
    category: 'features'
  },
  {
    id: 'split-options',
    question: 'What splitting options are available?',
    answer: 'You can split PDFs by page ranges, extract specific pages, split into individual pages, or split at specified page intervals. Our split tool offers flexible options to meet your needs.',
    category: 'features'
  },
  {
    id: 'compression-quality',
    question: 'How much can you compress PDF files?',
    answer: 'Compression results vary depending on your PDF content. Documents with images typically compress more than text-only files. You can typically expect 20-70% size reduction while maintaining good quality.',
    category: 'features'
  },
  {
    id: 'password-protection',
    question: 'Can I add password protection to my PDFs?',
    answer: 'Yes, our Protect PDF tool allows you to add password protection to your documents. You can set passwords for opening the document and restrict printing, copying, or editing.',
    category: 'features'
  },
  {
    id: 'watermark-options',
    question: 'What watermark options do you provide?',
    answer: 'You can add text or image watermarks to your PDFs. Options include adjusting opacity, position, rotation, and size. Watermarks can be applied to all pages or specific page ranges.',
    category: 'features'
  },
  {
    id: 'edit-pdf-capabilities',
    question: 'What can I edit in a PDF?',
    answer: 'Our Edit PDF tool allows you to add text, images, shapes, and annotations. You can also modify existing text (with some limitations based on the PDF structure) and rearrange elements.',
    category: 'features'
  },
  {
    id: 'ocr-support',
    question: 'Do you support OCR (text recognition) for scanned PDFs?',
    answer: 'Currently, our tools work best with text-based PDFs. For scanned documents or image-based PDFs, conversion capabilities may be limited. We recommend using high-quality scans for better results.',
    category: 'features'
  },

  // Technical Support
  {
    id: 'processing-time',
    question: 'How long does processing take?',
    answer: 'Processing time depends on file size and complexity. Most operations complete within 30 seconds to 2 minutes. Larger files or complex operations may take longer.',
    category: 'technical'
  },
  {
    id: 'upload-fails',
    question: 'What should I do if my file upload fails?',
    answer: 'Check your internet connection, ensure your file is under 100MB, and verify it\'s a valid PDF format. Try refreshing the page and uploading again. If problems persist, try a different browser.',
    category: 'technical'
  },
  {
    id: 'browser-compatibility',
    question: 'My browser doesn\'t seem to work properly. What should I do?',
    answer: 'Ensure you\'re using a modern browser (Chrome, Firefox, Safari, Edge) with JavaScript enabled. Clear your browser cache and cookies, or try using an incognito/private browsing window.',
    category: 'technical'
  },
  {
    id: 'mobile-usage',
    question: 'Can I use PDF Tools on my smartphone or tablet?',
    answer: 'Yes! Our tools are fully responsive and work on mobile devices. However, for the best experience with complex operations, we recommend using a desktop or laptop computer.',
    category: 'technical'
  },
  {
    id: 'corrupted-pdf',
    question: 'What if my PDF file is corrupted or won\'t process?',
    answer: 'Try opening the PDF in a PDF reader first to verify it\'s not corrupted. If the file opens normally but won\'t process, the PDF might have restrictions or unusual formatting. Contact support for assistance.',
    category: 'technical'
  },
  {
    id: 'internet-requirements',
    question: 'Do I need a fast internet connection?',
    answer: 'A stable internet connection is required for uploading and downloading files. Speed requirements depend on your file sizes - larger files will naturally take longer to upload and process.',
    category: 'technical'
  },

  // Pricing & Usage
  {
    id: 'usage-limits',
    question: 'Are there any usage limits or restrictions?',
    answer: 'There are no daily limits on the number of files you can process. The only restriction is the 100MB file size limit per operation.',
    category: 'pricing'
  },
  {
    id: 'commercial-use',
    question: 'Can I use this for commercial or business purposes?',
    answer: 'Yes, you can use our PDF tools for both personal and commercial purposes completely free of charge. There are no restrictions on business usage.',
    category: 'pricing'
  },
  {
    id: 'premium-features',
    question: 'Are there premium features or paid plans?',
    answer: 'No, all features are completely free. We don\'t have premium plans or paid features. Every tool and capability is available to all users at no cost.',
    category: 'pricing'
  },
  {
    id: 'api-access',
    question: 'Do you offer API access for developers?',
    answer: 'Currently, we only offer web-based tools through our user interface. API access is not available at this time.',
    category: 'pricing'
  },

  // File Formats
  {
    id: 'supported-formats',
    question: 'What file formats do you support?',
    answer: 'We support PDF as the primary format, plus conversions to/from Word (DOC, DOCX), Excel (XLS, XLSX), PowerPoint (PPT, PPTX), and images (JPG, PNG, TIFF, BMP). Some tools also support text files.',
    category: 'file-formats'
  },
  {
    id: 'pdf-versions',
    question: 'What PDF versions are supported?',
    answer: 'We support all standard PDF versions from PDF 1.4 to the latest PDF 2.0. Most PDFs created by modern software are fully compatible with our tools.',
    category: 'file-formats'
  },
  {
    id: 'conversion-quality',
    question: 'Will converting between formats affect quality?',
    answer: 'We strive to maintain the highest quality during conversions. However, some formatting may be lost when converting between different document types due to format limitations.',
    category: 'file-formats'
  },
  {
    id: 'image-resolution',
    question: 'What image resolution is used for PDF to image conversion?',
    answer: 'Our PDF to image conversion uses high-quality settings to ensure clear, readable images. The resolution is optimized to balance file size and image quality.',
    category: 'file-formats'
  },
  {
    id: 'batch-processing',
    question: 'Can I process multiple files at once?',
    answer: 'Yes, several of our tools support batch processing. You can merge multiple PDFs, convert multiple images to PDF, or perform certain operations on multiple files simultaneously.',
    category: 'file-formats'
  },

  // Additional Helpful Questions
  {
    id: 'keyboard-shortcuts',
    question: 'Are there any keyboard shortcuts I can use?',
    answer: 'Our tools are primarily designed for mouse/touch interaction. Standard browser shortcuts like Ctrl+Z for undo work in our edit tools where applicable.',
    category: 'technical'
  },
  {
    id: 'save-progress',
    question: 'Can I save my work and come back later?',
    answer: 'Each operation is independent and completed in one session. You cannot save partial work, but you can download your processed files and use them as starting points for future operations.',
    category: 'features'
  },
  {
    id: 'offline-usage',
    question: 'Can I use these tools offline?',
    answer: 'No, our tools require an internet connection as all processing happens on our secure servers. This ensures you always have access to the latest features and don\'t need to install software.',
    category: 'technical'
  },
  {
    id: 'customer-support',
    question: 'How can I get help if I have problems?',
    answer: 'If you encounter issues or have questions not covered in this FAQ, you can contact our support team. We strive to respond to all inquiries promptly.',
    category: 'general'
  }
];