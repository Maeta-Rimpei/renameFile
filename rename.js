const inputFile = document.getElementById('input-file');
const dropZone = document.getElementById('drop-zone');
const BASE_DATE = 0;
const YEAR_INDEX = 0;
const MONTH_INDEX = 1;
const DAY_INDEX = 2;
const EXCLUSION_ZERO_INDEX = 1;
const renamedFiles = [];

const fileChangeHandler = () => {
  inputFile.addEventListener(
    "change",
    (e) => {
      const files = e.target.files;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const lastModifiedDate = file.lastModifiedDate;

        if (!lastModifiedDate) {
          console.warn(files[i].name + "の日付情報がないため処理をスキップ");
          continue;
        }

        // ダウンロード
        const blob = new Blob([files[i]], { type: file.type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        // 日付変換
        const baseDate = lastModifiedDate.toISOString().split("T")[BASE_DATE];
        const year = baseDate.split("-")[YEAR_INDEX];
        // 「0」は切り取る
        const month = baseDate.split("-")[MONTH_INDEX];
        const monthCorrect = month.includes("0")
          ? month.split("0")[EXCLUSION_ZERO_INDEX]
          : month;

        const day = baseDate.split("-")[DAY_INDEX];
        const dayCorrect = day.includes("0")
          ? day.split("0")[EXCLUSION_ZERO_INDEX]
          : day;

        const fileName = `${year}年${monthCorrect}月${dayCorrect}日`;

        // ファイル名が重複していたら、末尾に「_カウント数」を付与
        if (renamedFiles.includes(fileName)) {
          const count = 0;
          for (let i = 0; i < renamedFiles.length; i++) {
            if (renamedFiles[i].name === fileName) {
              count++;
            }
          }
          fileName = fileName + "_" + count;
        }

        renamedFiles.push(file);

        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    },
    false
  );
};

fileChangeHandler();

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
})

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  fileChangeHandler();
})
