import { useEffect, useState } from "react";
import { TbAlertTriangleFilled } from "react-icons/tb";
import { RiCloseCircleFill } from "react-icons/ri";
import styles from "./Messages.module.css";

export function Messages({ actionLog }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setHasNewMessages(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (actionLog.length > 0) {
      setHasNewMessages(true);
    }
  }, [actionLog]);

  return (
    <>
      <button
        type="button"
        className={`${styles.MessagesButton} ${
          hasNewMessages ? styles.NewMessages : ""
        }`}
        onClick={() => {
          setIsOpen((isOpen) => !isOpen);
        }}
      >
        <TbAlertTriangleFilled />
      </button>
      <div className={styles.ActionLog} hidden={!isOpen}>
        <button
          className={styles.CloseButton}
          type="button"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <RiCloseCircleFill />
        </button>
        {actionLog.map((message, i) => {
          switch (message.type) {
            case "BATCH_OVERWRITE":
              return (
                <p key={i}>
                  File at <span className={styles.Path}>{message.path}</span>{" "}
                  from <del>{message.oldSource}</del> was replaced with the one
                  from <ins>{message.newSource}</ins> because of the priority in
                  which it was handled.
                </p>
              );
            case "NEW_OVERWRITE":
              return (
                <p key={i}>
                  File at <span className={styles.Path}>{message.path}</span>{" "}
                  from <del>{message.oldSource}</del> was replaced with the one
                  from <ins>{message.newSource}</ins> because it is a newer
                  upload.
                </p>
              );
            default:
              return null;
          }
        })}
      </div>
    </>
  );
}
