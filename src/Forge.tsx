"use client";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useDropzone } from "react-dropzone";
import orderBy from "lodash.orderby";
import { FaGithub } from "react-icons/fa";
import { Loading } from "./Loading";
import { FileItem } from "./FileItem";
import { DownloadForm } from "./DownloadForm";
import { handleInputFile } from "./utils";
import styles from "./Forge.module.css";
import { Messages } from "./Messages";

const defaultFileData = {
  files: new Map(),
  actionLog: [],
};

export function Forge() {
  const [isPending, startTransition] = useTransition();
  const [loadingCount, setLoadingCount] = useState(0);
  const [fileData, setFileData] = useState(defaultFileData);

  const { files, actionLog } = fileData;

  const onDrop = useCallback(async (acceptedFiles) => {
    setLoadingCount((count) => count + 1);
    const actionLog = [];
    const finalMap = new Map();
    const orderedAcceptedFiles = orderBy(
      Array.from(acceptedFiles),
      [(file) => (file.name ?? "").toLowerCase()],
      ["asc"]
    );
    const allFiles: Array<Map<string, any>> = await Promise.all(
      orderedAcceptedFiles.map((file) => handleInputFile(file))
    );
    allFiles.forEach((map) => {
      map.forEach((file, path) => {
        if (finalMap.has(path)) {
          actionLog.push({
            type: "BATCH_OVERWRITE",
            path,
            oldSource: finalMap.get(path).source,
            newSource: file.source,
          });
        }
        finalMap.set(path, file);
      });
    });
    setFileData((prevData) => {
      const { files: prevFiles, actionLog: prevActionLog } = prevData;
      const newActionLog = [...prevActionLog, ...actionLog];
      const newFiles = new Map(prevFiles);
      finalMap.forEach((file, path) => {
        if (newFiles.has(path)) {
          newActionLog.push({
            type: "NEW_OVERWRITE",
            path,
            oldSource: newFiles.get(path).source,
            newSource: file.source,
          });
        }
        newFiles.set(path, file);
      });
      return {
        files: newFiles,
        actionLog:
          newActionLog.length === prevActionLog.length
            ? prevActionLog
            : newActionLog,
      };
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
    setFileData((prevFileData) => {
      const newFiles = new Map(prevFileData.files);
      newFiles.delete(path);
      return {
        files: newFiles,
        actionLog: prevFileData.actionLog,
      };
    });
  }, []);

  const handleRename = useCallback((oldPath, newPath) => {
    setFileData((prevFileData) => {
      const file = prevFileData.files.get(oldPath);
      const newFile = { ...file, path: newPath };
      const newFiles = new Map(prevFileData.files);
      newFiles.delete(oldPath);
      newFiles.set(newPath, newFile);
      return {
        files: newFiles,
        actionLog: prevFileData.actionLog,
      };
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
        <Messages actionLog={actionLog} />
      </footer>
    </section>
  );
}
