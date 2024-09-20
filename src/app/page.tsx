"use client"
import { useEffect, useRef, useState } from "react";

export default function Home() {

  const videoRef = useRef<HTMLVideoElement>(null);
  const [barcodes, setBarcodes] = useState<string[]>([]);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error(error);
      }
    };

    const detectBarcodes = async () => {
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new BarcodeDetector({ formats: ['qr_code', 'ean_13'] });
        const detect = async () => {
          if (videoRef.current && videoRef.current.readyState === 4) {
            const barcodes = await barcodeDetector.detect(videoRef.current);
            setBarcodes(barcodes.map(barcode => barcode.rawValue));
          }
          requestAnimationFrame(detect);
        };
        detect();
      } else {
        console.error('BarcodeDetector API not supported');
      }
    };

    startVideo();
    detectBarcodes();

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto' }} />
      <h2>Tanımlanan Barkodlar:</h2>
      <ul>
        {barcodes.map((barcode, index) => {
          return (
            <a href={barcode} target="_blank" key={index}>
              <li key={index}>{barcode}</li>
            </a>
          )
        })}
      </ul>
    </div>
  );
}
