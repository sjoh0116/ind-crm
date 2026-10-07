import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';

const canvasToBlob = (canvas, type, quality) => new Promise((resolve, reject) => {
  canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error('Failed to export image'))), type, quality);
});

// 캔버스를 A4 세로 PDF로 변환. A4 한 장보다 길면 여러 페이지로 나눔
function canvasToPdf(canvas){
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imageHeight = (canvas.height * pageWidth) / canvas.width;
  const image = canvas.toDataURL('image/jpeg', 0.95);

  let offset = 0;
  // 0.5mm 이내의 넘침은 반올림 오차로 보고 빈 페이지를 만들지 않음
  while (offset < imageHeight - 0.5) {
    if (offset > 0) pdf.addPage();
    pdf.addImage(image, 'JPEG', 0, -offset, pageWidth, imageHeight);
    offset += pageHeight;
  }
  return pdf.output('blob');
}

function saveBlob(blob, fileName){
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// node(리포트 DOM)를 캡처해서 PDF + PNG를 zip 하나로 내려받음
export async function downloadContract(node, fileName){
  // 웹폰트가 로드되기 전에 찍으면 기본 폰트로 캡처됨
  await document.fonts.ready;

  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#fff',
  });

  const zip = new JSZip();
  zip.file(`${fileName}.pdf`, canvasToPdf(canvas));
  zip.file(`${fileName}.png`, await canvasToBlob(canvas, 'image/png'));

  saveBlob(await zip.generateAsync({ type: 'blob' }), `${fileName}.zip`);
}
