export function extractPublicId(url: string): string | null {
    try {
      const parts = url.split('/');
      const fileWithExtension = parts.pop();
      if (!fileWithExtension) return null;
  
      const [publicId] = fileWithExtension.split('.');
      const folderPath = parts.slice(parts.indexOf('upload') + 1).join('/');
      return `${folderPath}/${publicId}`;
    } catch {
      return null;
    }
  }  