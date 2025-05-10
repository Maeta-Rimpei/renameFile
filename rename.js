const inputFile = document.getElementById('input-file');
const dropZone = document.getElementById('drop-zone');
const BASE_DATE = 0;
const YEAR_INDEX = 0;
const MONTH_INDEX = 1;
const DAY_INDEX = 2;
const EXCLUSION_ZERO_INDEX = 1;
const renamedFiles = [];

inputFile.addEventListener("change", (e) => {
  const files = e.target.files;
  exec(files);
});

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  exec(files);
});

/**
 * リネーム処理
 * @param {*} fileList 
 */
const exec = (fileList) => {
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    const lastModifiedDate = file.lastModifiedDate;

    if (!lastModifiedDate) {
      console.warn(fileList[i].name + "の日付情報がないため処理をスキップ");
      continue;
    }

    // 日付変換
    let fileName = getFullDate(lastModifiedDate);

    if (renamedFiles.includes(fileName)) {
      // ファイル名が重複していたら、Winの仕様形式に合わせて再々リネーム
      fileName = rename(renamedFiles);
    }

    renamedFiles.push(file);

    const a = createDLAnchor(fileList[i], fileName);
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
  }
}

/**
 * JSTからISO標準時間形式に変換する
 * 2025-01-01 形式
 * @param {string} jstDate 
 * @returns 
 */
const getDateFromISO = (jstDate) => {
  return jstDate.toISOString().split("T")[0];
}

/**
 * ISO標準時間形式から年月日をそれぞれ抽出する
 * @param {string} 2025-01-01 isoDate 
 * @param {number} 0: Year, 1: Month, 2: Day isoDate 
 * @returns 
 */
const getDate = (isoDate, idx) => {
  return isoDate.split("-")[idx];
}

/**
 * JSTからyyyy年mm月dd日形式に変換する
 * @param {string} jstDate
 * @returns 
 */
const getFullDate = (jstDate) => {
  const isoDate = getDateFromISO(jstDate);
  const year = getDate(isoDate, 0);
  const month = getDate(isoDate, 1);
  const day = getDate(isoDate, 2);

  return `${year}年${month}月${day}日`;
}

/**
 * ファイルの配列からファイル名が重複しているものに対して連番を付与する
 * @param {Array<>} fileList
 * @return {string} ファイル名
 */
const renameFile = (fileList) => {
  const count = 0;
  let fileName;
  for (let i = 0; i < fileList.length; i++) {
    if (fileList[i].name === fileName) {
      count++;
    }
  }
  return fileName = fileName + '(' + count + ')';
}

/**
 * ファイルDＬアンカー要素を生成する
 * @param {*} file 
 */
const createDLAnchor = (file, fileName) => {
    const blob = new Blob([file], { type: file.type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;

    return a;
}