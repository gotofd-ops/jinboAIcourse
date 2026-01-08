import { slides } from './src/lib/slides.ts';

// Print the number of slides and their IDs
console.log(`=== Slide Count Test ===`);
console.log(`Total slides: ${slides.length}`);
console.log(`Slide IDs:`);
slides.forEach(slide => {
  console.log(`  Slide ${slide.id}: ${slide.title} (${slide.module})`);
});

// Check if PDF slides are included
const hasPdfSlides = slides.some(slide => slide.id >= 4 && slide.id <= 17);
console.log(`\n=== Filtering Result ===`);
console.log(`PDF slides (4-17) included: ${hasPdfSlides}`);
console.log(`Environment variable VITE_INCLUDE_PDF_SLIDES: ${import.meta.env.VITE_INCLUDE_PDF_SLIDES}`);
