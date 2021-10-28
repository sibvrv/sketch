/**
 * ObjectURL to Blob
 * @param imageURL
 * @param callback
 */
export function objectURLtoBlob(imageURL: string, callback: (blob: Blob) => any) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', imageURL, true);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    if (this.status === 200) {
      const myBlob = this.response;
      callback(myBlob);
    }
  };
  xhr.send();
}
