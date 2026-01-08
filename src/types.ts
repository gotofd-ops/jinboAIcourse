export type LayoutType = 'cover' | 'pdf' | 'comparison' | 'standard';

export interface Slide {
  id: number;
  module: string;
  title: string;
  layoutType: LayoutType;
  dataSupport: string;
  content: string[];
  image?: string;
  video?: string;
  images?: string[];
  chartData?: any[];
  isModuleStart?: boolean;
}
