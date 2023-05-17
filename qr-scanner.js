import QrScanner from "qr-scanner";

QrScanner.WORKER_PATH = 'node_modules\qr-scanner\qr-scanner-worker.min.js'; // Replace with the actual path to the QR scanner worker script file

document.addEventListener("DOMContentLoaded", () => {
  const videoElement = document.getElementById("qr-video");
  const scanResult = document.getElementById("scan-result");

  QrScanner.hasCamera().then(hasCamera => {
    if (!hasCamera) {
      console.error("No camera found on this device.");
      return;
    }

    const qrScanner = new QrScanner(videoElement, result => {
      qrScanner.stop();
      videoElement.srcObject.getTracks().forEach(track => track.stop());
      scanResult.textContent = result;
    });

    qrScanner.start().catch(error => {
      console.error("Failed to start QR code scanner:", error);
    });
  });
});
