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

// Extract the first page as an image for AI Vision analysis
export async function extractImageFromPDF(file: File): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = await loadPDFJS();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (!context) {
        throw new Error("Could not get canvas context");
      }

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      // Convert to base64 string
      const base64 = canvas.toDataURL('image/png');
      resolve(base64);
    } catch (error) {
      console.error("Error converting PDF to image:", error);
      reject(error);
    }
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

export async function checkForVerifiedMetadata(file: File): Promise<boolean> {
  return new Promise(async (resolve) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = await loadPDFJS();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const metadata = await pdf.getMetadata();
      console.log("PDF Metadata Check:", metadata);

      // Check if subject or keywords contain our verification tag
      // Also check creator/producer or custom metadata if available
      const isVerified = metadata?.info?.Subject === 'T2W_VERIFIED_CV' ||
        metadata?.info?.Title?.includes('T2W_VERIFIED_CV') ||
        metadata?.metadata?.get('Subject') === 'T2W_VERIFIED_CV';

      console.log("Is Verified PDF?", isVerified);

      if (isVerified) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.error("Error checking PDF metadata:", error);
      resolve(false);
    }
  });
}
