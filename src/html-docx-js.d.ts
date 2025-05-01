// types/html-docx-js.d.ts
declare module 'html-docx-js/dist/html-docx' {
    const htmlDocx: {
      asBlob: (html: string, options?: Record<string, unknown>) => Blob;
      asBase64: (html: string, options?: Record<string, unknown>) => string;
    };
    export = htmlDocx;
  }
  