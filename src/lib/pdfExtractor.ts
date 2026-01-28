// Simple text extraction - for PDF we'll read it as text if possible
// For full PDF parsing, we'll encourage users to paste the text directly

export async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        
        // Try to extract text using the pdf.js library loaded from CDN
        const text = await extractPDFTextWithWorker(arrayBuffer);
        resolve(text);
      } catch (error) {
        console.error("Error extracting PDF text:", error);
        reject(new Error("No se pudo extraer el texto del PDF. Por favor, copia y pega el texto manualmente."));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error al leer el archivo"));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

async function extractPDFTextWithWorker(arrayBuffer: ArrayBuffer): Promise<string> {
  // Dynamically load pdf.js from CDN
  const pdfjsLib = await loadPDFJS();
  
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    fullText += pageText + "\n";
  }
  
  return fullText.trim();
}

let pdfjsLibCache: any = null;

async function loadPDFJS(): Promise<any> {
  if (pdfjsLibCache) return pdfjsLibCache;
  
  // Load pdf.js from CDN
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      if (pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        pdfjsLibCache = pdfjsLib;
        resolve(pdfjsLib);
      } else {
        reject(new Error("Failed to load PDF.js"));
      }
    };
    
    script.onerror = () => {
      reject(new Error("Failed to load PDF.js script"));
    };
    
    document.head.appendChild(script);
  });
}
