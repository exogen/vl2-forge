import JSZip from "jszip";
import { saveAs } from "file-saver";

export type FileType = {
  mimeType: string;
  genericType: string | null;
};

export type FileEntry = {
  path: string;
  buffer: ArrayBuffer;
  dataUri: string | null;
  date: Date | null;
  unixPermissions: string | number | null;
  dosPermissions: number | null;
  type: FileType | null;
};

// Converts an ArrayBuffer directly to base64, without any intermediate 'convert to string then
// use window.btoa' step. According to my tests, this appears to be a faster approach:
// http://jsperf.com/encoding-xhr-image-data/5
/*
MIT LICENSE
Copyright 2011 Jon Leighton
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
export function base64ArrayBuffer(arrayBuffer) {
  var base64 = "";
  var encodings =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var bytes = new Uint8Array(arrayBuffer);
  var byteLength = bytes.byteLength;
  var byteRemainder = byteLength % 3;
  var mainLength = byteLength - byteRemainder;
  var a, b, c, d;
  var chunk;
  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
    d = chunk & 63; // 63       = 2^6 - 1
    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }
  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength];
    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4; // 3   = 2^2 - 1
    base64 += encodings[a] + encodings[b] + "==";
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2; // 15    = 2^4 - 1
    base64 += encodings[a] + encodings[b] + encodings[c] + "=";
  }
  return base64;
}

export function detectBestPath(path) {
  const parts = path.split("/");
  let folder = "";
  let basename = "";
  if (parts.length > 1) {
    folder = parts.slice(0, -1).join("/");
    basename = parts[parts.length - 1];
  } else {
    folder = "";
    basename = parts[0];
  }
  if (folder) {
    return `${folder}/${basename}`;
  }
  if (
    /\.(l|m|h)(male|female|bioderm)\.png$/i.test(basename) ||
    /^(vehicle|weapon)_.+png$/i.test(basename) ||
    /^dcase\d\d\.png$/i.test(basename)
  ) {
    folder = "textures/skins";
  } else if (/\.(ter|spn)$/i.test(basename)) {
    folder = "terrains";
  } else if (/\.mis$/i.test(basename)) {
    folder = "missions";
  } else if (/\.dif$/i.test(basename)) {
    folder = "interiors";
  }
  if (folder) {
    return `${folder}/${basename}`;
  } else {
    return basename;
  }
}

export function detectFileType(file): FileType | null {
  if (file.type) {
    if (/^image\//i.test(file.type)) {
      return { mimeType: file.type, genericType: "image" };
    } else if (/^audio\//i.test(file.type)) {
      return { mimeType: file.type, genericType: "audio" };
    }
  }
  if (/\.png$/i.test(file.name)) {
    return { mimeType: "image/png", genericType: "image" };
  } else if (/\.jpg$/i.test(file.name)) {
    return { mimeType: "image/jpeg", genericType: "image" };
  } else if (/\.bmp$/i.test(file.name)) {
    return { mimeType: "image/bmp", genericType: "image" };
  } else if (/\.webp$/i.test(file.name)) {
    return { mimeType: "image/webp", genericType: "image" };
  } else if (/\.gif$/i.test(file.name)) {
    return { mimeType: "image/gif", genericType: "image" };
  } else if (/\.tiff$/i.test(file.name)) {
    return { mimeType: "image/tiff", genericType: "image" };
  } else if (/\.svg$/i.test(file.name)) {
    return { mimeType: "image/svg+xml", genericType: "image" };
  } else if (/\.wav$/i.test(file.name)) {
    return { mimeType: "audio/wav", genericType: "audio" };
  } else if (/\.mp3$/i.test(file.name)) {
    return { mimeType: "audio/mpeg", genericType: "audio" };
  }
  if (file.type) {
    return {
      mimeType: file.type,
      genericType: null,
    };
  }
  return null;
}

export async function handleZipFile(file) {
  const zip = await JSZip.loadAsync(file);
  const map = new Map<string, FileEntry>();
  for (let path in zip.files) {
    const fileObj = zip.files[path];
    if (!fileObj.dir) {
      path = detectBestPath(path);
      const buffer = await fileObj.async("arraybuffer");
      const fileEntry = {
        path,
        buffer: buffer,
        dataUri: null,
        date: fileObj.date,
        unixPermissions: fileObj.unixPermissions,
        dosPermissions: fileObj.dosPermissions,
        type: detectFileType(fileObj),
      };
      if (
        fileEntry.type?.genericType === "image" ||
        fileEntry.type?.genericType === "audio"
      ) {
        const base64String = await fileObj.async("base64");
        fileEntry.dataUri = `data:${fileEntry.type.mimeType};base64,${base64String}`;
      }
      map.set(path, fileEntry);
    }
  }
  return map;
}

export async function handleOtherFile(file) {
  const map = new Map();
  let path;
  if (file.path) {
    path = file.path;
    if (path.startsWith("/")) {
      path = path.slice(1);
    }
  } else if (file.name) {
    path = file.name;
  } else {
    return map;
  }
  path = detectBestPath(path);
  const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      resolve(event.target.result as ArrayBuffer);
    });
    reader.readAsArrayBuffer(file);
  });
  const fileEntry = {
    path,
    buffer,
    dataUri: null,
    date: null,
    unixPermissions: null,
    dosPermissions: null,
    type: detectFileType(file),
  };
  if (
    fileEntry.type?.genericType === "image" ||
    fileEntry.type?.genericType === "audio"
  ) {
    const base64String = base64ArrayBuffer(buffer);
    fileEntry.dataUri = `data:${fileEntry.type.mimeType};base64,${base64String}`;
  }
  map.set(path, fileEntry);
  return map;
}

export async function handleInputFile(file) {
  if (/\.(zip|vl2)$/i.test(file.name)) {
    return handleZipFile(file);
  } else {
    return handleOtherFile(file);
  }
}

export function createZipFile(files: Array<FileEntry>) {
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.path, file.buffer, {
      date: file.date,
      dosPermissions: file.dosPermissions,
      unixPermissions: file.unixPermissions,
    });
  }
  return zip;
}

export async function saveZipFile(zip: JSZip, name: string) {
  const blob = await zip.generateAsync({
    type: "blob",
    mimeType: "application/octet-stream",
  });
  saveAs(blob, name);
}
