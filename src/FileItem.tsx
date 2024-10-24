import { useMemo } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { MdTerrain } from "react-icons/md";
import { PiCastleTurretFill } from "react-icons/pi";
import { LuScrollText } from "react-icons/lu";
import { FaMapPin } from "react-icons/fa6";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { GrTask } from "react-icons/gr";
import styles from "./FileItem.module.css";

export function FileItem({ file, onDelete, onRename }) {
  const icon = useMemo(() => {
    if (file.dataUri && file.type?.genericType === "image") {
      return (
        <img
          className={styles.PreviewIcon}
          src={file.dataUri}
          width={24}
          alt=""
        />
      );
    } else if (file.type?.genericType === "audio") {
      return <HiMiniSpeakerWave />;
    } else if (/\.cs$/i.test(file.path)) {
      return <LuScrollText />;
    } else if (/\.mis$/i.test(file.path)) {
      return <GrTask />;
    } else if (/\.dif$/i.test(file.path)) {
      return <PiCastleTurretFill />;
    } else if (/\.ter$/i.test(file.path)) {
      return <MdTerrain />;
    } else if (/\.spn$/i.test(file.path)) {
      return <FaMapPin />;
    }
    return null;
  }, [file]);

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
