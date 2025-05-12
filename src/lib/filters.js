
	export function transformToGreyscale(data) {
		for (let i = 0; i < data.length; i += 4) {
			const grayscale = 0.21 * data[i] + 0.72 * data[i + 1] + 0.07 * data[i + 2];
			data[i] = grayscale;
			data[i + 1] = grayscale;
			data[i + 2] = grayscale;
		}
		return data;
	}

	export function makeThreeColors(data, black = 62, white = 170, thirdcolor = [204, 190, 255]) {
		for (let i = 0; i < data.length; i += 4) {
			if (data[i] > white) {
				data[i] = 255;
				data[i + 1] = 255;
				data[i + 2] = 255;
			} else if (data[i] >= black && data[i] <= white) {
				data[i] = thirdcolor[0];
				data[i + 1] = thirdcolor[1];
				data[i + 2] = thirdcolor[2];
			} else {
				data[i] = 0;
				data[i + 1] = 0;
				data[i + 2] = 0;
			}
		}

		return data;
	}

    export function applyMedianFilter(imageData, kernelSize) {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const resultData = new Uint8ClampedArray(data.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = (y * width + x) * 4;
      const neighborValuesR = [];
      const neighborValuesG = [];
      const neighborValuesB = [];

      for (let ky = -Math.floor(kernelSize / 2); ky <= Math.floor(kernelSize / 2); ky++) {
        for (let kx = -Math.floor(kernelSize / 2); kx <= Math.floor(kernelSize / 2); kx++) {
          const neighborX = x + kx;
          const neighborY = y + ky;

          if (neighborX >= 0 && neighborX < width && neighborY >= 0 && neighborY < height) {
            const neighborIndex = (neighborY * width + neighborX) * 4;
            neighborValuesR.push(data[neighborIndex]);
            neighborValuesG.push(data[neighborIndex + 1]);
            neighborValuesB.push(data[neighborIndex + 2]);
          }
        }
      }

      neighborValuesR.sort((a, b) => a - b);
      neighborValuesG.sort((a, b) => a - b);
      neighborValuesB.sort((a, b) => a - b);

      const medianIndex = Math.floor(neighborValuesR.length / 2);
      resultData[pixelIndex] = neighborValuesR[medianIndex];
      resultData[pixelIndex + 1] = neighborValuesG[medianIndex];
      resultData[pixelIndex + 2] = neighborValuesB[medianIndex];
      resultData[pixelIndex + 3] = data[pixelIndex + 3]; // Keep alpha channel
    }
  }
  return resultData;
}