declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';

  interface AutoTableSettings {
    head?: any[][];
    body?: any[][];
    foot?: any[][];
    startY?: number;
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    pageBreak?: 'auto' | 'avoid' | 'always';
    rowPageBreak?: 'auto' | 'avoid';
    showHead?: 'everyPage' | 'firstPage' | 'never';
    showFoot?: 'everyPage' | 'lastPage' | 'never';
    theme?: 'striped' | 'grid' | 'plain';
    styles?: {
      font?: string;
      fontStyle?: string;
      fontSize?: number;
      textColor?: number[];
      fillColor?: number[];
      lineColor?: number[];
      lineWidth?: number;
      cellPadding?: number;
      halign?: 'left' | 'center' | 'right';
      valign?: 'top' | 'middle' | 'bottom';
      fillStyle?: 'F' | 'FD' | 'DF';
      minCellHeight?: number;
      cellWidth?: 'auto' | 'wrap' | number;
    };
    headStyles?: Partial<AutoTableSettings['styles']>;
    bodyStyles?: Partial<AutoTableSettings['styles']>;
    footStyles?: Partial<AutoTableSettings['styles']>;
    alternateRowStyles?: Partial<AutoTableSettings['styles']>;
    columnStyles?: { [key: number]: Partial<AutoTableSettings['styles']> };
  }

  interface jsPDFWithAutoTable extends jsPDF {
    autoTable: (options: AutoTableSettings) => void;
    autoTable: {
      previous: {
        finalY: number;
      };
    };
  }

  function autoTable(pdf: jsPDF, settings: AutoTableSettings): void;
  export default autoTable;
} 