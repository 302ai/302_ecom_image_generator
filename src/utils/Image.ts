
interface CompressOptions {
  maxSizeMB: number;
  mimeType?: string;
  quality?: number;
}

export default class ImageManager {

  // Compress the image blob based on provided options
  static compressImageBlob = (blob: Blob, { maxSizeMB, mimeType = 'image/jpeg', quality = 0.8 }: CompressOptions): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) return reject(new Error('Failed to get 2D context'));

          const { width, height } = this.adjustImageDimensions(img.width, img.height, maxSizeMB);
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(blob => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to compress image'));
          }, mimeType, quality);
        };

        img.onerror = reject;
        img.src = String(reader.result);
      };

      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Compress the image file based on provided options
  static compressImage = (file: File, options: CompressOptions): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => {
        const img = new Image();
        img.onload = () => {
          const canvas = this.createCanvasAndDrawImage(img, options.maxSizeMB);

          canvas.toBlob(async blob => {
            if (blob && blob.size > options.maxSizeMB * 1024 * 1024) {
              try {
                const adjustedBlob = await this.compressImageBlob(blob, options);
                resolve(adjustedBlob);
              } catch (err) {
                reject(err);
              }
            } else if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          }, options.mimeType, options.quality);
        };
        img.src = (event?.target?.result as string) || '';
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Fetch an image by URL and create a File object
  static imageToFile = async (url: string): Promise<File | null> => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Fetch error: ${res.statusText}`);

      const blob = await res.blob();
      const fileName = url.includes('.svg') ? 'file.svg' : 'file.jpg';
      return new File([blob], fileName, { type: blob.type });
    } catch {
      return null;
    }
  };

  // Convert a file to a data URL image
  static fielToImage = async (file: File): Promise<string> => {
    return URL.createObjectURL(file);
  };

  // Convert a file to a Base64 string
  static fileToBase64 = async (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event?.target?.result as string);
      reader.onerror = () => reject('File to base64 conversion error');
      reader.readAsDataURL(file);
    });
  };

  // Convert an image URL to Base64
  static imageToBase64 = async (url: string): Promise<string | null> => {
    try {
      if (url.includes('base64')) return url;
      const file = await this.imageToFile(url);
      return file ? await this.fileToBase64(file) : null;
    } catch {
      return null;
    }
  };

  // Convert a PNG image URL to JPEG
  static pngToJpg = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  // Convert a PNG file to a JPEG File
  static pngFileToJpgFile = async (file: File): Promise<File | null> => {
    try {
      const jpgDataUrl = await this.pngToJpg(URL.createObjectURL(file));
      return await this.imageToFile(jpgDataUrl);
    } catch {
      return null;
    }
  };

  // Get the dimensions of an image
  static readImageSize = (file: File): Promise<{ width: number, height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject('Load image size error');
      img.src = URL.createObjectURL(file);
    });
  };

  // Localize image URL to local object URL
  static localizeImage = async (url: string): Promise<string | null> => {
    try {
      const file = await this.imageToFile(url);
      return file ? URL.createObjectURL(file) : null;
    } catch {
      return null;
    }
  };

  // Reset the size of a canvas
  static resetSizeCanvas = (originCanvas: HTMLCanvasElement, size: { width: number, height: number }): Promise<HTMLCanvasElement> => {
    return new Promise(resolve => {
      const originImage = new Image();
      originImage.onload = () => {
        const newCanvas = document.createElement('canvas');
        newCanvas.width = size.width;
        newCanvas.height = size.height;
        const newContext = newCanvas.getContext('2d');
        if (newContext) {
          newContext.drawImage(originImage, 0, 0, size.width, size.height);
          resolve(newCanvas);
        }
      };
      originImage.src = originCanvas.toDataURL('image/png');
    });
  };

  // Helper function to adjust image dimensions to fit size constraints
  private static adjustImageDimensions(width: number, height: number, maxSizeMB: number): { width: number, height: number } {
    const ratio = width / height;
    while ((width * height * 4) / (1024 * 1024) > maxSizeMB) {
      width /= 1.1;
      height /= 1.1;
    }
    return { width, height };
  }

  // Helper function to create a canvas and draw the image
  private static createCanvasAndDrawImage(img: HTMLImageElement, maxSizeMB: number): HTMLCanvasElement {
    const { width, height } = this.adjustImageDimensions(img.width, img.height, maxSizeMB);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
    }
    return canvas;
  }
}
