document.addEventListener("DOMContentLoaded", function() {
    if (typeof Lunar === "undefined") {
        console.error("❌ 万年历库未加载！");
        alert("万年历库加载失败，请检查 `lunar.js` 是否正确！");
        return;
    }
    console.log("✅ 万年历库成功加载！");
});

// 天干地支与五行对应关系
const wuxingMap = {
    "甲": "木", "乙": "木", "丙": "火", "丁": "火",
    "戊": "土", "己": "土", "庚": "金", "辛": "金",
    "壬": "水", "癸": "水", "子": "水", "丑": "土",
    "寅": "木", "卯": "木", "辰": "土", "巳": "火",
    "午": "火", "未": "土", "申": "金", "酉": "金",
    "戌": "土", "亥": "水"
};

// 时干计算表
const shichenTable = {
    "子": ["甲", "丙", "戊", "庚", "壬"],
    "丑": ["乙", "丁", "己", "辛", "癸"],
    "寅": ["丙", "戊", "庚", "壬", "甲"],
    "卯": ["丁", "己", "辛", "癸", "乙"],
    "辰": ["戊", "庚", "壬", "甲", "丙"],
    "巳": ["己", "辛", "癸", "乙", "丁"],
    "午": ["庚", "壬", "甲", "丙", "戊"],
    "未": ["辛", "癸", "乙", "丁", "己"],
    "申": ["壬", "甲", "丙", "戊", "庚"],
    "酉": ["癸", "乙", "丁", "己", "辛"],
    "戌": ["甲", "丙", "戊", "庚", "壬"],
    "亥": ["乙", "丁", "己", "辛", "癸"]
};

// 计算生辰八字
function calculateBaZi() {
    let birthDate = document.getElementById('birthDate').value;
    let birthHour = parseInt(document.getElementById('birthHour').value);

    if (!birthDate) {
        alert("请输入出生日期！");
        return;
    }

    if (isNaN(birthHour)) {
        alert("请选择出生时辰！");
        return;
    }

    let birthDateTime = new Date(birthDate + "T00:00:00");
    if (isNaN(birthDateTime.getTime())) {
        console.error("❌ 无效的日期输入:", birthDate);
        alert("请输入有效的出生日期！");
        return;
    }
    console.log("🌍 输入的阳历日期:", birthDateTime);

    try {
        let lunar = Lunar.fromDate(birthDateTime);
        let lunarDateStr = `${lunar.getYear()}年${lunar.getMonth()}月${lunar.getDay()}日`;
        console.log("🌙 农历日期:", lunarDateStr);

        // 获取天干地支（年、月、日）
        let yearGanZhi = lunar.getYearInGanZhiExact();
        let monthGanZhi = lunar.getMonthInGanZhiExact();
        let dayGanZhi = lunar.getDayInGanZhiExact();

        // 计算时支（根据时辰对应地支）
        const shichen = [
            { range: [23, 0], zhi: "子" },
            { range: [1, 2], zhi: "丑" },
            { range: [3, 4], zhi: "寅" },
            { range: [5, 6], zhi: "卯" },
            { range: [7, 8], zhi: "辰" },
            { range: [9, 10], zhi: "巳" },
            { range: [11, 12], zhi: "午" },
            { range: [13, 14], zhi: "未" },
            { range: [15, 16], zhi: "申" },
            { range: [17, 18], zhi: "酉" },
            { range: [19, 20], zhi: "戌" },
            { range: [21, 22], zhi: "亥" }
        ];
        let timeZhi = shichen.find(s => birthHour >= s.range[0] && birthHour <= s.range[1]).zhi;

        // 获取日干
        let dayGan = dayGanZhi[0];

        // 计算时干
        let timeGan = shichenTable[timeZhi][["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"].indexOf(dayGan)];

        // 组合时柱
        let timeGanZhi = timeGan + timeZhi;

        let baZi = `${yearGanZhi}--${monthGanZhi}--${dayGanZhi}--${timeGanZhi}`;
        console.log("📜 生辰八字:", baZi);

        // 计算五行
        let fiveElements = [
            wuxingMap[yearGanZhi[0]], wuxingMap[yearGanZhi[1]],
            wuxingMap[monthGanZhi[0]], wuxingMap[monthGanZhi[1]],
            wuxingMap[dayGanZhi[0]], wuxingMap[dayGanZhi[1]],
            wuxingMap[timeGanZhi[0]], wuxingMap[timeGanZhi[1]]
        ];

        let counts = { "金": 0, "木": 0, "水": 0, "火": 0, "土": 0 };
        fiveElements.forEach(el => counts[el]++);
        let missingElements = Object.keys(counts).filter(k => counts[k] === 0).join("、") || "无缺项";

        document.getElementById('result').innerHTML = `
            <h3>测算结果：</h3>
            <p><b>输入日期：</b>${birthDate}</p>
            <p><b>农历生日：</b>${lunarDateStr}</p>
            <p><b>生辰八字：</b>${baZi}</p>
            <p><b>五行分布：</b>${fiveElements.join("--")}</p>
            <p><b>五行统计：</b>金：${counts["金"]} 木：${counts["木"]} 水：${counts["水"]} 火：${counts["火"]} 土：${counts["土"]}</p>
            <p><b>五行缺失：</b>${missingElements}</p>
        `;
    } catch (error) {
        console.error("❌ 计算生辰八字失败:", error);
        alert("计算出错，请检查输入数据格式！");
    }
}

document.getElementById('calculateBtn').addEventListener('click', calculateBaZi);
