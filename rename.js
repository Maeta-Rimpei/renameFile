const inputFile = document.getElementById('input-file');
const BASE_DATE = 0;
const YEAR_INDEX = 0;
const MONTH_INDEX = 1;
const DAY_INDEX = 2;
const EXCLUSION_ZERO_INDEX = 1;


inputFile.addEventListener('change', (e) => {
    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const lastModifiedDate = file.lastModifiedDate;
        const reader = new FileReader();


        if (!lastModifiedDate) {
            console.warn(files[i].name + 'の日付情報がないため処理をスキップ')
            continue;
        }
        // ダウンロード
        reader.onload = () => {
            const blob = new Blob([reader.result], { type: file.type });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');

            // 日付変換
            const baseDate = lastModifiedDate.toISOString().split('T')[BASE_DATE];
            const year = baseDate.split('-')[YEAR_INDEX];
            // 「0」は切り取る
            const month = baseDate.split('-')[MONTH_INDEX];
            const monthCorrect = month.includes('0') ? month.split('0')[EXCLUSION_ZERO_INDEX] : month;

            const day = baseDate.split('-')[DAY_INDEX];
            const dayCorrect = day.includes('0') ? day.split('0')[EXCLUSION_ZERO_INDEX] : day;

            const fileName = `${year}年${monthCorrect}月${dayCorrect}日`;
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        reader.readAsArrayBuffer(file);
    }
}, false);
