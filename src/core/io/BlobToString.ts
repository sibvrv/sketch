/**
 * Convert Blob to String
 * @param myBlob
 * @param callback
 */
export function blobToString(myBlob: Blob, callback: (text: string) => any) {
  const fr = new FileReader();
  fr.onload = function (event: ProgressEvent) {
    callback((event.target as any).result);
  };
  fr.readAsDataURL(myBlob);
}
