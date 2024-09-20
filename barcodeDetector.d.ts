interface Barcode {
    rawValue: string;
    format: string;
}

interface BarcodeDetector {
    constructor: BarcodeDetector;
    detect(image: HTMLVideoElement | ImageBitmap): Promise<Barcode[]>;
}

declare var BarcodeDetector: {
    prototype: BarcodeDetector;
    new(options?: { formats?: string[] }): BarcodeDetector;
};