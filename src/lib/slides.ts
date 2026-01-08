import slidesData from '../data/slides.json';
import type { Slide } from '../types';

// Import existing images
import candyCover from '@/assets/candy_cover.webp';
import candyRocket from '@/assets/candy_rocket.webp';
import candyData from '@/assets/candy_data.webp';
import candyBrain from '@/assets/candy_brain.webp';
import candyLaptop from '@/assets/candy_laptop.webp';
import candyClass from '@/assets/candy_class.webp';

import seismicData from '@/assets/seismic_data.webp';
import geoData from '@/assets/geo_data.webp';
import monet from '@/assets/monet.webp';
import liziqi from '@/assets/liziqi.webp';
import meituan from '@/assets/meituan.webp';
import xiaomi from '@/assets/xiaomi.webp';
import coding from '@/assets/coding.webp';
import coding2 from '@/assets/coding2.webp';
import gemini from '@/assets/gemini.webp';
import zhangjiLecture from '@/assets/zhangji_lecture.webp';
import slide18Top from '@/assets/slide18_top.webp';
import slide18Bottom from '@/assets/slide18_bottom.webp';
import lectureHall from '@/assets/lecture_hall.webp';
import lectureCloseup from '@/assets/lecture_closeup.webp';

// Import new PDF images
import pdf01 from '@/assets/pdf_page_01.webp';
import pdf02 from '@/assets/pdf_page_02.webp';
import pdf03 from '@/assets/pdf_page_03.webp';
import pdf04 from '@/assets/pdf_page_04.webp';
import pdf05 from '@/assets/pdf_page_05.webp';
import pdf06 from '@/assets/pdf_page_06.webp';
import pdf07 from '@/assets/pdf_page_07.webp';
import pdf08 from '@/assets/pdf_page_08.webp';
import pdf09 from '@/assets/pdf_page_09.webp';
import pdf10 from '@/assets/pdf_page_10.webp';
import pdf11 from '@/assets/pdf_page_11.webp';
import pdf12 from '@/assets/pdf_page_12.webp';
import pdf13 from '@/assets/pdf_page_13.webp';
import pdf14 from '@/assets/pdf_page_14.webp';
import slide3New from '@/assets/slide3_new.webp';

// Helper function to process slides with dynamic filtering
const processSlides = (keepAllSlides: boolean): Slide[] => {
  // Filter slides based on the parameter
  // Keep slide 4 in online version, filter only 5-17
  const filteredSlidesData = keepAllSlides 
    ? slidesData 
    : slidesData.filter(s => s.id < 5 || s.id > 17);

  return filteredSlidesData.map((s: any, index: number) => {
    let image = s.image || candyCover;

    if (!s.image) {
      // Slides 4-17 are PDF pages
      if (s.id >= 4 && s.id <= 17) {
        const pdfImages = [pdf01, pdf02, pdf03, pdf04, pdf05, pdf06, pdf07, pdf08, pdf09, pdf10, pdf11, pdf12, pdf13, pdf14];
        image = pdfImages[s.id - 4];
      } else {
        const originalId = s.id >= 18 ? s.id - 11 : s.id - 1;

        switch (originalId) {
          case 1: image = candyCover; break;
          case 2: image = candyRocket; break;
          case 7: image = zhangjiLecture; break;
          case 8: image = lectureHall; break;
          case 9: image = candyLaptop; break;
          case 10: image = monet; break;
          case 11: image = candyBrain; break;
          case 12: image = candyData; break;
          case 13: image = gemini; break;
          case 14: image = candyData; break;
          case 15: image = coding; break;
          case 16: image = candyRocket; break;
          case 17: image = candyBrain; break;
          case 18: image = candyLaptop; break;
          case 19: image = coding2; break;
          case 20: image = candyCover; break;
          case 21: image = liziqi; break;
          case 22: image = meituan; break;
          case 23: image = xiaomi; break;
          case 24: image = candyCover; break;
          case 25: image = candyLaptop; break;
          case 26: image = candyRocket; break;
          case 27: image = candyLaptop; break;
          case 28: image = candyBrain; break;
          case 29: image = candyData; break;
          case 30: image = coding2; break;
          case 31: image = candyBrain; break;
          case 32: image = candyRocket; break;
          case 33: image = liziqi; break;
          default: image = candyCover;
        }
      }
    }

    // Determine if this slide starts a new module
    const prevSlide = filteredSlidesData[index - 1];
    const isModuleStart = !prevSlide || s.module !== prevSlide.module;

    // Handle multi-image slide
    let images: string[] | undefined;
    if (s.id === 18) images = [slide18Top, slide18Bottom];
    else if (s.id === 19) images = [lectureHall, lectureCloseup];
    else if (s.id === 33) images = [liziqi, liziqi]; // Use liziqi image for both positions

    return {
      ...s,
      id: index + 1, // Re-index slides after filtering
      image,
      images,
      isModuleStart
    };
  });
};

// Environment variable to control default PDF slides visibility
const includePdfSlidesByDefault = import.meta.env.VITE_INCLUDE_PDF_SLIDES === 'true';

// Export default slides based on environment variable
export const defaultSlides = processSlides(includePdfSlidesByDefault);

// Export the process function to allow dynamic filtering
export { processSlides };
