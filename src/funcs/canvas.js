export const fitCanvasSize = (img, w, h) => {
  console.log(w, h)
  
  const wRatio = (w ) / img.naturalWidth;
  const hRatio = (h ) / img.naturalHeight;
  if(wRatio>1&&hRatio>1){
      return {ratio:1,offsetX:(w/2-img.naturalWidth/2),offsetY:(h/2-img.naturalHeight/2)}
  }
  if (wRatio > hRatio) {
      const offsetX = (w-img.naturalWidth*hRatio) / 2;
      const offsetY = (h-img.naturalHeight*hRatio) / 2;
      return { ratio: hRatio, offsetX: offsetX, offsetY: offsetY };
  } else {
      const offsetX = (w-img.naturalWidth*wRatio) / 2;
      const offsetY = (h-img.naturalHeight*wRatio) / 2;
      return { ratio: wRatio, offsetX: offsetX, offsetY: offsetY };
  }
}