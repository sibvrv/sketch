const sizesEnum = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const kilo = 1024;

/**
 * "Human Readable" Sizes
 * @param bytes
 * @param decimals
 */
export function formatBytes(bytes: number, decimals: number = 2) {
  if (bytes === 0) {
    return '0 Bytes';
  }
  decimals = Math.max(0, decimals);

  const index = Math.floor(Math.log(bytes) / Math.log(kilo));
  return `${(bytes / Math.pow(kilo, index)).toFixed(decimals)} ${sizesEnum[index]}`;
}
