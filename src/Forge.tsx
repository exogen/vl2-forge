"use client";
import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import orderBy from "lodash.orderby";
import { FaTrashAlt } from "react-icons/fa";
import { MdCastle, MdTerrain } from "react-icons/md";
import { LuScrollText } from "react-icons/lu";
import { FaClipboardList, FaMapPin } from "react-icons/fa6";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import styles from "./Forge.module.css";
import { base64ArrayBuffer } from "./utils";

function detectBestPath(path) {
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

function detectFileType(file): FileType | null {
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

function FilePreview({ file, onDelete, onRename }) {
  let icon = null;
  if (file.dataUri && file.type?.genericType === "image") {
    icon = (
      <img
        className={styles.PreviewIcon}
        src={file.dataUri}
        width={24}
        alt=""
      />
    );
  } else if (file.type?.genericType === "audio") {
    icon = <HiMiniSpeakerWave />;
  } else if (/\.cs$/i.test(file.path)) {
    icon = <LuScrollText />;
  } else if (/\.mis$/i.test(file.path)) {
    icon = <FaClipboardList />;
  } else if (/\.dif$/i.test(file.path)) {
    icon = <MdCastle />;
  } else if (/\.ter$/i.test(file.path)) {
    icon = <MdTerrain />;
  } else if (/\.spn$/i.test(file.path)) {
    icon = <FaMapPin />;
  }
  return (
    <div className={styles.File}>
      <span className={styles.IconContainer}>{icon}</span>{" "}
      <span
        className={styles.Path}
        onDoubleClick={() => {
          let newPath = window.prompt(`Rename file (${file.path}):`, file.path);
          if (newPath) {
            newPath = newPath
              .trim()
              .replace(/\/+/g, "/")
              .replace(/^\//, "")
              .replace(/\/$/, "")
              .trim();
            if (newPath && newPath !== file.path) {
              onRename(file.path, newPath);
            }
          }
        }}
      >
        {file.path}
      </span>
      <button
        className={styles.DeleteButton}
        type="button"
        aria-label="Delete"
        title="Delete"
        onClick={(event) => {
          onDelete(file.path);
        }}
      >
        <FaTrashAlt />
      </button>
    </div>
  );
}

type FileType = {
  mimeType: string;
  genericType: string | null;
};

type FileEntry = {
  path: string;
  buffer: ArrayBuffer;
  dataUri: string | null;
  date: Date | null;
  unixPermissions: string | number | null;
  dosPermissions: number | null;
  type: FileType | null;
};

async function handleZipFile(file) {
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

async function handleOtherFile(file) {
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

async function handleInputFile(file) {
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

export function Forge() {
  const [actionLog, setActionLog] = useState(() => []);
  const [files, setFiles] = useState(() => new Map());

  const onDrop = useCallback(async (acceptedFiles) => {
    const actionLog = [];
    const finalMap = new Map();
    const allFiles: Array<Map<string, any>> = await Promise.all(
      acceptedFiles.map((file) => handleInputFile(file))
    );
    allFiles.forEach((map) => {
      map.forEach((file, path) => {
        if (finalMap.has(path)) {
          actionLog.push({
            type: "overwrite",
            path,
          });
        }
        finalMap.set(path, file);
      });
    });
    setFiles((prevMap) => {
      return new Map([
        ...Array.from(prevMap.entries()),
        ...Array.from(finalMap.entries()),
      ]);
    });
    setActionLog((prevLog) => [...prevLog, ...actionLog]);
  }, []);
  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    noClick: true,
    onDrop,
  });

  const fileList = useMemo(() => {
    const paths = orderBy(
      Array.from(files.keys()),
      [(path) => path.toLowerCase()],
      ["asc"]
    );
    return paths.map((path) => files.get(path));
  }, [files]);

  const addButton = (
    <button
      type="button"
      className={styles.AddButton}
      aria-label="Add files"
      title="Add files"
      onClick={open}
    >
      +
    </button>
  );

  const handleDelete = useCallback((path) => {
    setFiles((files) => {
      const newFiles = new Map(files);
      newFiles.delete(path);
      return newFiles;
    });
  }, []);

  const handleRename = useCallback((oldPath, newPath) => {
    setFiles((files) => {
      const file = files.get(oldPath);
      const newFile = { ...file, path: newPath };
      const newFiles = new Map(files);
      newFiles.delete(oldPath);
      newFiles.set(newPath, newFile);
      return newFiles;
    });
  }, []);

  return (
    <>
      <section className={styles.Forge} {...getRootProps()}>
        <header className={styles.Header}>
          <img
            width={210}
            height={188}
            src="/vl2-forge/logo-md.png"
            alt="VL2 Forge"
          />
          {addButton}
        </header>
        <input {...getInputProps()} />
        <div className={styles.ListArea}>
          {fileList.length ? (
            <ul className={styles.FileList}>
              {fileList.map((file) => {
                return (
                  <li key={file.path}>
                    <FilePreview
                      file={file}
                      onDelete={handleDelete}
                      onRename={handleRename}
                    />
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className={styles.EmptyMessage}>
              Drop files onto the page or press the add button!
            </div>
          )}
        </div>
      </section>
      <footer className={styles.Footer}>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.target as HTMLFormElement;
            const fileName = form.elements["fileName"] as HTMLInputElement;
            const name = fileName.value.trim();
            if (!name) {
              window.alert("Name thy file.");
              fileName.focus();
            } else if (!fileList.length) {
              window.alert("Add some files!");
            } else {
              const zip = createZipFile(fileList);
              await saveZipFile(zip, `${name}.vl2`);
            }
          }}
        >
          <div className={styles.NameInput}>
            <input
              name="fileName"
              type="text"
              placeholder="name thy file"
              onChange={(event) => {
                if (/\.vl2$/i.test(event.target.value)) {
                  event.target.value = event.target.value.slice(0, -4);
                }
              }}
            />
          </div>
          <button type="submit" className={styles.DownloadButton}>
            Download
          </button>
        </form>
      </footer>
    </>
  );
}
