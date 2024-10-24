import { createZipFile, saveZipFile } from "./utils";
import styles from "./DownloadForm.module.css";

export function DownloadForm({ fileList }) {
  return (
    <form
      className={styles.DownloadForm}
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
  );
}
