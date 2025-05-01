
'use client';
import { useEffect, useState } from 'react';
import NextImage from 'next/image'; // ✅ Rename to avoid clash with global Image

export function PreloadedLogo({ resumeAvailable }: { resumeAvailable: boolean }) {
    const [base64Img, setBase64Img] = useState<string | null>(null);

    useEffect(() => {
        if (!resumeAvailable) return;

        const convertImageToBase64PNG = async (url: string): Promise<string> => {
            return new Promise((resolve, reject) => {
                const img = new window.Image(); // ✅ Use the global Image constructor explicitly
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return reject('Canvas context not available');
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL('image/png'));
                };
                img.onerror = reject;
                img.src = url;
            });
        };

        convertImageToBase64PNG('https://innovagecloud.com/images/logo/logo.svg')
            .then(setBase64Img)
            .catch(console.error);
    }, [resumeAvailable]);

    if (!base64Img) return null;

    return (
        <NextImage
            src={base64Img}
            alt="Logo"
            width={150}
            height={50}
            style={{ display: 'block', marginLeft: 'auto' }}
            unoptimized
        />
    );
}
