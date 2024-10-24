"use client";
import { useCallback, useMemo, useState, useTransition } from "react";
import { useDropzone } from "react-dropzone";
import orderBy from "lodash.orderby";
import { FaGithub } from "react-icons/fa";
import { Loading } from "./Loading";
import { FileItem } from "./FileItem";
import { DownloadForm } from "./DownloadForm";
import { handleInputFile } from "./utils";
import styles from "./Forge.module.css";

export function Forge() {
  const [isPending, startTransition] = useTransition();
  const [loadingCount, setLoadingCount] = useState(0);
  const [actionLog, setActionLog] = useState(() => []);
  const [files, setFiles] = useState(() => new Map());

  const onDrop = useCallback(async (acceptedFiles) => {
    setLoadingCount((count) => count + 1);
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
    startTransition(() => {
      setFiles((prevMap) => {
        return new Map([
          ...Array.from(prevMap.entries()),
          ...Array.from(finalMap.entries()),
        ]);
      });
      setActionLog((prevLog) => [...prevLog, ...actionLog]);
    });
    setLoadingCount((count) => count - 1);
  }, []);

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    noClick: true,
    noKeyboard: true,
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

  const showLoading = isPending || loadingCount > 0;

  return (
    <section className={styles.Forge} {...getRootProps()}>
      <header className={styles.Header}>
        <a
          className={styles.HeaderLink}
          href="https://github.com/exogen/vl2-forge"
        >
          <FaGithub aria-label="GitHub" />
        </a>
        <img
          className={styles.Logo}
          width={210}
          height={188}
          src="/vl2-forge/logo-md.png"
          alt="VL2 Forge"
        />
        {addButton}
      </header>
      <input {...getInputProps()} />
      <div className={styles.ListArea}>
        {showLoading ? <Loading /> : null}
        {fileList.length ? (
          <ul className={styles.FileList}>
            {fileList.map((file) => {
              return (
                <li key={file.path}>
                  <FileItem
                    file={file}
                    onDelete={handleDelete}
                    onRename={handleRename}
                  />
                </li>
              );
            })}
          </ul>
        ) : showLoading ? null : (
          <div className={styles.EmptyMessage}>
            Drop files onto the page or press the add button. No need to extract
            existing .vl2 files first – just drop ‘em in and it’ll take care of
            that!
          </div>
        )}
      </div>
      <footer className={styles.Footer}>
        <a
          className={styles.FooterLink}
          href="https://github.com/exogen/vl2-forge"
        >
          <FaGithub aria-label="GitHub" />
        </a>
        <DownloadForm fileList={fileList} />
      </footer>
    </section>
  );
}
