// Shared test helpers for the project
// - createMockFile(name, sizeBytes, type): returns a File-like object for uploads
// - mockFileReader(): installs a simple FileReader mock and returns a restore function

export function createMockFile(name = 'file.txt', sizeBytes = 1024, type = 'application/pdf') {
  // Create a file with specified size (ArrayBuffer) and properties
  const blob = new Blob([new ArrayBuffer(sizeBytes)], { type });
  const file = new File([blob], name, { type, lastModified: Date.now() });
  // ensure size property matches
  Object.defineProperty(file, 'size', { value: sizeBytes });
  return file;
}

export function mockFileReader() {
  const OriginalFileReader = global.FileReader;
  class MockReader {
    constructor() {
      this.onload = null;
      this.onerror = null;
      this.result = null;
    }
    readAsArrayBuffer() {
      this.result = new ArrayBuffer(8);
      setTimeout(() => {
        if (typeof this.onload === 'function') {
          this.onload({ target: { result: this.result } });
        }
      }, 0);
    }
    readAsDataURL() {
      this.result = 'data:application/octet-stream;base64,ZmFrZQ==';
      setTimeout(() => {
        if (typeof this.onload === 'function') {
          this.onload({ target: { result: this.result } });
        }
      }, 0);
    }
  }
  global.FileReader = MockReader;
  return function restore() {
    global.FileReader = OriginalFileReader;
  };
}

// Optionally, add other shared helpers here (render wrappers, etc.)
