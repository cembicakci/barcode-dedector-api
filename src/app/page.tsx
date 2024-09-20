"use client"
import { useEffect, useRef, useState } from "react";

export default function Home() {

  const videoRef = useRef<HTMLVideoElement>(null);
  const [barcodes, setBarcodes] = useState<string[]>([]);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
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
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <video
        ref={videoRef}
        autoPlay
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      <ul
        style={{
          position: 'absolute',
          top: '80%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        {barcodes.map((barcode, index) => (
          <a href={barcode} target="_blank" rel="noopener noreferrer" key={index}>
            <li className="btn">Tarayıcıda Aç</li>

          </a>
        ))}
      </ul>
    </div>
  );
}
