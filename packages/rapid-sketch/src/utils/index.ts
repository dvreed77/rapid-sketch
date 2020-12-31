export function createBlobFromDataURL(dataURL): Promise<Blob> {
  return new Promise((resolve) => {
    const splitIndex = dataURL.indexOf(",");
    if (splitIndex === -1) {
      resolve(new window.Blob());
      return;
    }
    const base64 = dataURL.slice(splitIndex + 1);
    const byteString = window.atob(base64);
    const type = dataURL.slice(0, splitIndex);
    const mimeMatch = /data:([^;]+)/.exec(type);
    const mime = (mimeMatch ? mimeMatch[1] : "") || undefined;
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    resolve(new window.Blob([ab], { type: mime }));
  });
}

export function promisfyCanvasToBlob(canvas): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(resolve);
    } catch (err) {
      reject(err);
    }
  });
}

export async function saveBlob(blob: Blob, name: string) {
  const form = new window.FormData();
  form.append("file", blob, name);
  try {
    const res = await window.fetch("/record/saveBlob", {
      method: "POST",
      cache: "no-cache",
      credentials: "same-origin",
      body: form,
    });
    if (res.status === 200) {
      return res.json();
    } else {
      return res.text().then((text) => {
        throw new Error(text);
      });
    }
  } catch (err) {
    // Some issue, just bail out and return nil hash
    // console.warn(`There was a problem exporting ${opts.filename}`);
    console.error(err);
    return undefined;
  }
}

export async function sendStreamBlob(canvas: HTMLCanvasElement) {
  const blob = await promisfyCanvasToBlob(canvas);

  const form = new window.FormData();
  form.append("file", blob, "frame.png");
  try {
    const res = await window.fetch("/record/sendStreamBlob", {
      method: "POST",
      cache: "no-cache",
      credentials: "same-origin",
      body: form,
    });
    if (res.status === 200) {
      return res.json();
    } else {
      return res.text().then((text) => {
        throw new Error(text);
      });
    }
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function startStream(data: any) {
  const res = await window.fetch("/record/startStream", {
    method: "POST",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function endStream() {
  const res = await window.fetch("/record/endStream", {
    method: "POST",
    cache: "no-cache",
    credentials: "same-origin",
  });
}
