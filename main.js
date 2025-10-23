// Basic helpers
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) { const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8); return v.toString(16); });
}
function trimLower(s) { return (s || '').toString().trim().toLowerCase(); }

// Numeric parsing (supports fractions like '3/4')
function parseNumeric(str) {
  const s = (str || '').toString().trim();
  if (!s) return NaN;
  if (/^[-+]?\d+(?:\.\d+)?$/.test(s)) return Number(s);
  // fraction like a/b
  const m = s.match(/^\s*([-+]?\d+)\s*\/\s*([-+]?\d+)\s*$/);
  if (m) {
    const a = Number(m[1]); const b = Number(m[2]);
    if (b === 0) return NaN; return a / b;
  }
  return NaN;
}
function nearlyEqual(a, b, tol = 1e-3) { return Math.abs(a - b) <= tol; }

// Difficulty labels
const DIFF_LABEL = { 1: '容易 / Easy', 2: '中等 / Medium', 3: '较难 / Hard' };

// Skill names
const SKILL_NAMES = {
  1: '正负数与零 / Positive & Negative & Zero',
  2: '有理数运算 / Rational Operations',
  3: '用字母表示数 / Letters as Numbers',
  4: '整式合并与化简 / Polynomials Simplify',
  5: '一元一次方程 / Linear Eq (1 var)',
  6: '二元一次方程组 / Linear System (2 vars)',
  7: '方程解决实际问题 / Equations in Word Problems'
};

// Question bank
// Each question: { id, skill, difficulty, prompt, type: 'numeric'|'expr', answerNum?: number, answers?: string[] }
const QUESTIONS = [
  // 1. Positive/Negative/Zero
  { id: '1-e-1', skill: 1, difficulty: 1, prompt: '气温下降5度，用正负数表示（如 -5）。', type: 'numeric', answerNum: -5 },
  { id: '1-m-1', skill: 1, difficulty: 2, prompt: '比较 -3 和 2 的大小，输入较大的数。', type: 'numeric', answerNum: 2 },
  { id: '1-h-1', skill: 1, difficulty: 3, prompt: '在数轴上，-0.5 与 0.3 哪个更接近0？输入该数。', type: 'numeric', answerNum: 0.3 },

  // 2. Rational operations
  { id: '2-e-1', skill: 2, difficulty: 1, prompt: '计算 1/2 + 1/3 的值（可填分数或小数）。', type: 'numeric', answerNum: 5/6 },
  { id: '2-m-1', skill: 2, difficulty: 2, prompt: '计算 -3/4 - 1/8 的值。', type: 'numeric', answerNum: -7/8 },
  { id: '2-h-1', skill: 2, difficulty: 3, prompt: '计算 2.5 × (-0.8) 的值。', type: 'numeric', answerNum: -2.0 },

  // 3. Letters as numbers (expressions)
  { id: '3-e-1', skill: 3, difficulty: 1, prompt: '用字母表示：一个数 x 增加 5。', type: 'expr', answers: ['x+5', '5+x'] },
  { id: '3-m-1', skill: 3, difficulty: 2, prompt: '用字母表示：y 的 3 倍减去 2。', type: 'expr', answers: ['3y-2', '3*y-2'] },
  { id: '3-h-1', skill: 3, difficulty: 3, prompt: '用字母表示：a 与 b 的和的平方。', type: 'expr', answers: ['(a+b)^2', 'a^2+2ab+b^2'] },

  // 4. Polynomials simplify
  { id: '4-e-1', skill: 4, difficulty: 1, prompt: '化简：2x + 3x。', type: 'expr', answers: ['5x'] },
  { id: '4-m-1', skill: 4, difficulty: 2, prompt: '化简：x^2 + 2x + x^2。', type: 'expr', answers: ['2x^2+2x'] },
  { id: '4-h-1', skill: 4, difficulty: 3, prompt: '合并同类项：3a^2b + 2ab^2 - a^2b。', type: 'expr', answer:['2a^2b+2ab^2'] },

  // 5. Linear eq (1 var)
  { id: '5-e-1', skill: 5, difficulty: 1, prompt: '解方程：x + 5 = 12，输入 x 的值。', type: 'numeric', answerNum: 7 },
  { id: '5-m-1', skill: 5, difficulty: 2, prompt: '解方程：2x - 3 = 5，输入 x 的值。', type: 'numeric', answerNum: 4 },
  { id: '5-h-1', skill: 5, difficulty: 3, prompt: '解方程：3(x - 2) = 12，输入 x 的值。', type: 'numeric', answerNum: 6 },

  // 6. Linear system (2 vars) — ask for x only
  { id: '6-e-1', skill: 6, difficulty: 1, prompt: '解方程组：x + y = 5，x - y = 1。求 x 的值。', type: 'numeric', answerNum: 3 },
  { id: '6-m-1', skill: 6, difficulty: 2, prompt: '解方程组：2x + y = 7，x + 2y = 8。求 x 的值。', type: 'numeric', answerNum: 2 },
  { id: '6-h-1', skill: 6, difficulty: 3, prompt: '解方程组：x + 3y = 10，2x - y = 1。求 x 的值。', type: 'numeric', answerNum: 13/7 },

  // 7. Word problems
  { id: '7-e-1', skill: 7, difficulty: 1, prompt: '一桶水每分钟流出 3 升，初始有 15 升。多少分钟流完？', type: 'numeric', answerNum: 5 },
  { id: '7-m-1', skill: 7, difficulty: 2, prompt: '成人票 30 元，学生票 20 元，共 10 人，总价 260 元。成人有几人？', type: 'numeric', answerNum: 6 },
  { id: '7-h-1', skill: 7, difficulty: 3, prompt: '甲乙两人同时做工，甲每小时 x 件，乙每小时 2 件，5 小时做 20 件。求 x。', type: 'numeric', answerNum: 2 },
];

// Expand question bank via push
QUESTIONS.push(
  // 1
  { id: '1-e-2', skill: 1, difficulty: 1, prompt: '向东为正方向，向西为负方向。向西走 4 步表示为？', type: 'numeric', answerNum: -4 },
  { id: '1-m-2', skill: 1, difficulty: 2, prompt: '比较 -7 与 -2 的大小，输入较大的数。', type: 'numeric', answerNum: -2 },
  { id: '1-h-2', skill: 1, difficulty: 3, prompt: '绝对值相等的数：-x 与 x，哪个更大？若 x>0 输入较大者。', type: 'numeric', answerNum: 'x' },
  // 2
  { id: '2-e-2', skill: 2, difficulty: 1, prompt: '计算 3/5 - 1/5 的值。', type: 'numeric', answerNum: 2/5 },
  { id: '2-m-2', skill: 2, difficulty: 2, prompt: '计算 (-1.2) + 0.7 的值。', type: 'numeric', answerNum: -0.5 },
  { id: '2-h-2', skill: 2, difficulty: 3, prompt: '计算 (-3/4) × (2/3) 的值。', type: 'numeric', answerNum: -1/2 },
  // 3
  { id: '3-e-2', skill: 3, difficulty: 1, prompt: '用字母表示：m 的一半。', type: 'expr', answer: ['m/2', '1/2m', '0.5m'] },
  { id: '3-m-2', skill: 3, difficulty: 2, prompt: '用字母表示：a的3倍加上7。', type: 'expr', answer: ['3a+7'] },
  { id: '3-h-2', skill: 3, difficulty: 3, prompt: '化成等价表达式：b(b-1)+b。', type: 'expr', answer: ['b^2', 'b*b'] },
  // 4
  { id: '4-e-2', skill: 4, difficulty: 1, prompt: '化简：4y - y。', type: 'expr', answers: ['3y'] },
  { id: '4-m-2', skill: 4, difficulty: 2, prompt: '化简：2a^2 + a^2 - 3a。', type: 'expr', answers: ['3a^2-3a'] },
  { id: '4-h-2', skill: 4, difficulty: 3, prompt: '化简：(x+1)(x-1)。', type: 'expr', answers: ['x^2-1'] },
  // 5
  { id: '5-e-2', skill: 5, difficulty: 1, prompt: '解方程：x - 9 = 4。求 x。', type: 'numeric', answerNum: 13 },
  { id: '5-m-2', skill: 5, difficulty: 2, prompt: '解方程：3x + 6 = 0。求 x。', type: 'numeric', answerNum: -2 },
  { id: '5-h-2', skill: 5, difficulty: 3, prompt: '解方程：5x - (x - 2) = 10。求 x。', type: 'numeric', answerNum: 2 },
  // 6
  { id: '6-e-2', skill: 6, difficulty: 1, prompt: '解方程组：x + y = 6，x - y = 2。求 x 的值。', type: 'numeric', answerNum: 4 },
  { id: '6-m-2', skill: 6, difficulty: 2, prompt: '解方程组：x + 2y = 9，2x + y = 10。求 x。', type: 'numeric', answerNum: 4 },
  { id: '6-h-2', skill: 6, difficulty: 3, prompt: '解方程组：3x + 0.5y = 10，x - y = 1。求 x。', type: 'numeric', answerNum: 3 },
  // 7
  { id: '7-e-2', skill: 7, difficulty: 1, prompt: '公交每 10 分钟一班，等待 30 分钟可坐几班？', type: 'numeric', answerNum: 3 },
  { id: '7-m-2', skill: 7, difficulty: 2, prompt: '苹果 3 元/个，香蕉 2 元/个，共 8 个，总价 18 元。苹果几个？', type: 'numeric', answerNum: 2 },
  { id: '7-h-2', skill: 7, difficulty: 3, prompt: '工地：甲每小时 3 件，乙每小时 y 件，4 小时共 20 件。求 y。', type: 'numeric', answerNum: 2 }
);

// 第三套题目（每个能力项与难度再补充一题）
QUESTIONS.push(
  // 1 正负数与零
  { id: '1-e-3', skill: 1, difficulty: 1, prompt: '海拔下降 8 米，应该表示为？', type: 'numeric', answerNum: -8 },
  { id: '1-m-3', skill: 1, difficulty: 2, prompt: '比较 -1 与 -5 的大小，输入较大的数。', type: 'numeric', answerNum: -1 },
  { id: '1-h-3', skill: 1, difficulty: 3, prompt: '绝对值相等的数：-x 与 x，哪个更大？若 x<0 输入较大者。', type: 'numeric', answerNum: 'x' },
  // 2 有理数运算
  { id: '2-e-3', skill: 2, difficulty: 1, prompt: '计算 2/3 - 1/6。', type: 'numeric', answerNum: 1/2 },
  { id: '2-m-3', skill: 2, difficulty: 2, prompt: '计算 (-2/5) + 3/10。', type: 'numeric', answerNum: -1/10 },
  { id: '2-h-3', skill: 2, difficulty: 3, prompt: '计算 (-1.5) × 2/3。', type: 'numeric', answerNum: -1 },
  // 3 用字母表示数
  { id: '3-e-3', skill: 3, difficulty: 1, prompt: '用字母表示：一个数 t 减去 4。', type: 'expr', answers: ['t-4', 't+(-4)'] },
  { id: '3-m-3', skill: 3, difficulty: 2, prompt: '用字母表示：p 的 2 倍加上 3。', type: 'expr', answers: ['2p+3', '2*p+3'] },
  { id: '3-h-3', skill: 3, difficulty: 3, prompt: '化成等价表达式：x(x+2) - x。', type: 'expr', answers: ['x^2+x', 'x*(x+1)'] },
  // 4 整式合并与化简
  { id: '4-e-3', skill: 4, difficulty: 1, prompt: '化简：5a - 2a。', type: 'expr', answers: ['3a'] },
  { id: '4-m-3', skill: 4, difficulty: 2, prompt: '化简：2x^2 + 3x - x^2。', type: 'expr', answers: ['x^2+3x'] },
  { id: '4-h-3', skill: 4, difficulty: 3, prompt: '化简：(2x+1)(x-1)。', type: 'expr', answers: ['2x^2-x-1'] },
  // 5 一元一次方程
  { id: '5-e-3', skill: 5, difficulty: 1, prompt: '解方程：x - 4 = 9。求 x。', type: 'numeric', answerNum: 13 },
  { id: '5-m-3', skill: 5, difficulty: 2, prompt: '解方程：3x + 2 = 11。求 x。', type: 'numeric', answerNum: 3 },
  { id: '5-h-3', skill: 5, difficulty: 3, prompt: '解方程：2(x - 3) + 4 = 0。求 x。', type: 'numeric', answerNum: 1 },
  // 6 二元一次方程组
  { id: '6-e-3', skill: 6, difficulty: 1, prompt: '解方程组：x + y = 7，x - y = 3。求 x。', type: 'numeric', answerNum: 5 },
  { id: '6-m-3', skill: 6, difficulty: 2, prompt: '解方程组：x + 2y = 10，2x - y = 4。求 x。', type: 'numeric', answerNum: 18/5 },
  { id: '6-h-3', skill: 6, difficulty: 3, prompt: '解方程组：3x + 2y = 13，x - y = 1。求 x。', type: 'numeric', answerNum: 3 },
  // 7 方程解决实际问题
  { id: '7-e-3', skill: 7, difficulty: 1, prompt: '一支笔 3 元，一本本子 2 元，共买 5 件，花 12 元。笔几支？', type: 'numeric', answerNum: 2 },
  { id: '7-m-3', skill: 7, difficulty: 2, prompt: '甲比乙多 4 个，甲乙共 26 个。甲有几个？', type: 'numeric', answerNum: 15 },
  { id: '7-h-3', skill: 7, difficulty: 3, prompt: '两人合作：甲每小时 a 件，乙每小时 3 件，4 小时共 20 件。求 a。', type: 'numeric', answerNum: 2 }
);

// 第四套题目（每个能力项与难度再补充一题）
QUESTIONS.push(
  // 1. Positive / Negative / Zero
  { id: '1-e-4', skill: 1, difficulty: 1, prompt: '零下 12 度表示为？', type: 'numeric', answerNum: -12 },
  { id: '1-m-4', skill: 1, difficulty: 2, prompt: '比较 -9 与 -4 的大小，输入较大的数。', type: 'numeric', answerNum: -4 },
  { id: '1-h-4', skill: 1, difficulty: 3, prompt: '一个数与它的相反数之差为 10，求这个数。', type: 'numeric', answerNum: 5 },

  // 2. Rational operations
  { id: '2-e-4', skill: 2, difficulty: 1, prompt: '计算 1/4 + 1/2。', type: 'numeric', answerNum: 3/4 },
  { id: '2-m-4', skill: 2, difficulty: 2, prompt: '计算 (-0.6) - 0.9。', type: 'numeric', answerNum: -1.5 },
  { id: '2-h-4', skill: 2, difficulty: 3, prompt: '计算 (-5/6) × (-3/10)。', type: 'numeric', answerNum: 1/4 },

  // 3. Letters as numbers
  { id: '3-e-4', skill: 3, difficulty: 1, prompt: '用字母表示：一个数 n 的 3 倍。', type: 'expr', answers: ['3n', 'n*3'] },
  { id: '3-m-4', skill: 3, difficulty: 2, prompt: '用字母表示：k 的 5 倍减去 8。', type: 'expr', answers: ['5k-8', '5*k-8'] },
  { id: '3-h-4', skill: 3, difficulty: 3, prompt: '化简：a(a+3) - a。', type: 'expr', answers: ['a^2+2a', 'a*(a+2)'] },

  // 4. Polynomials simplify
  { id: '4-e-4', skill: 4, difficulty: 1, prompt: '化简：6x + 4x。', type: 'expr', answers: ['10x'] },
  { id: '4-m-4', skill: 4, difficulty: 2, prompt: '化简：3a^2 + 2a - a^2 + a。', type: 'expr', answers: ['2a^2+3a'] },
  { id: '4-h-4', skill: 4, difficulty: 3, prompt: '化简：(x+2)(x+3)。', type: 'expr', answers: ['x^2+5x+6'] },

  // 5. Linear equations (1 var)
  { id: '5-e-4', skill: 5, difficulty: 1, prompt: '解方程：x + 6 = 15。求 x。', type: 'numeric', answerNum: 9 },
  { id: '5-m-4', skill: 5, difficulty: 2, prompt: '解方程：4x - 8 = 12。求 x。', type: 'numeric', answerNum: 5 },
  { id: '5-h-4', skill: 5, difficulty: 3, prompt: '解方程：2(x + 1) = 10。求 x。', type: 'numeric', answerNum: 4 },

  // 6. Linear systems (2 vars)
  { id: '6-e-4', skill: 6, difficulty: 1, prompt: '解方程组：x + y = 8，x - y = 4。求 x。', type: 'numeric', answerNum: 6 },
  { id: '6-m-4', skill: 6, difficulty: 2, prompt: '解方程组：2x + y = 9，x + y = 6。求 x。', type: 'numeric', answerNum: 3 },
  { id: '6-h-4', skill: 6, difficulty: 3, prompt: '解方程组：2x - y = 3，x + 2y = 8。求 x。', type: 'numeric', answerNum: 14/5 },

  // 7. Word problems
  { id: '7-e-4', skill: 7, difficulty: 1, prompt: '每分钟走 60 米，走 300 米需要几分钟？', type: 'numeric', answerNum: 5 },
  { id: '7-m-4', skill: 7, difficulty: 2, prompt: '成人票 40 元，儿童票 25 元，共 10 张，总价 325 元。成人有几张？', type: 'numeric', answerNum: 5 },
  { id: '7-h-4', skill: 7, difficulty: 3, prompt: '甲每小时 4 件，乙每小时 b 件，3 小时共 21 件。求 b。', type: 'numeric', answerNum: 3 }
);


// 第五套题目（每个能力项与难度再补充一题）
QUESTIONS.push(
  // 1. Positive / Negative / Zero
  { id: '1-e-5', skill: 1, difficulty: 1, prompt: '温度从 0 降到 -7 度，表示为？', type: 'numeric', answerNum: -7 },
  { id: '1-m-5', skill: 1, difficulty: 2, prompt: '比较 -2 与 0 的大小，输入较大的数。', type: 'numeric', answerNum: 0 },
  { id: '1-h-5', skill: 1, difficulty: 3, prompt: '若 |x| = 4 且 x < 0，求 x。', type: 'numeric', answerNum: -4 },

  // 2. Rational operations
  { id: '2-e-5', skill: 2, difficulty: 1, prompt: '计算 1/3 + 1/6。', type: 'numeric', answerNum: 1/2 },
  { id: '2-m-5', skill: 2, difficulty: 2, prompt: '计算 (-2/3) + 5/6。', type: 'numeric', answerNum: 1/6 },
  { id: '2-h-5', skill: 2, difficulty: 3, prompt: '计算 (-1.2) × (-0.5)。', type: 'numeric', answerNum: 0.6 },

  // 3. Letters as numbers
  { id: '3-e-5', skill: 3, difficulty: 1, prompt: '用字母表示：一个数 p 的 4 倍。', type: 'expr', answers: ['4p', 'p*4'] },
  { id: '3-m-5', skill: 3, difficulty: 2, prompt: '用字母表示：q 的 2 倍加上 9。', type: 'expr', answers: ['2q+9', '2*q+9'] },
  { id: '3-h-5', skill: 3, difficulty: 3, prompt: '化成等价表达式：m(m-1) + m。', type: 'expr', answers: ['m^2', 'm*m'] },

  // 4. Polynomials simplify
  { id: '4-e-5', skill: 4, difficulty: 1, prompt: '化简：7y - 2y。', type: 'expr', answers: ['5y'] },
  { id: '4-m-5', skill: 4, difficulty: 2, prompt: '化简：x^2 + 4x - 2x^2 + x。', type: 'expr', answers: ['-x^2+5x'] },
  { id: '4-h-5', skill: 4, difficulty: 3, prompt: '化简：(x-2)(x+2)。', type: 'expr', answers: ['x^2-4'] },

  // 5. Linear equations (1 var)
  { id: '5-e-5', skill: 5, difficulty: 1, prompt: '解方程：x - 3 = 10。求 x。', type: 'numeric', answerNum: 13 },
  { id: '5-m-5', skill: 5, difficulty: 2, prompt: '解方程：5x + 5 = 0。求 x。', type: 'numeric', answerNum: -1 },
  { id: '5-h-5', skill: 5, difficulty: 3, prompt: '解方程：2(x - 4) = 6。求 x。', type: 'numeric', answerNum: 7 },

  // 6. Linear systems (2 vars)
  { id: '6-e-5', skill: 6, difficulty: 1, prompt: '解方程组：x + y = 9，x - y = 1。求 x。', type: 'numeric', answerNum: 5 },
  { id: '6-m-5', skill: 6, difficulty: 2, prompt: '解方程组：3x + y = 10，x + y = 6。求 x。', type: 'numeric', answerNum: 2 },
  { id: '6-h-5', skill: 6, difficulty: 3, prompt: '解方程组：2x + 3y = 12，x - y = 1。求 x。', type: 'numeric', answerNum: 3 },

  // 7. Word problems
  { id: '7-e-5', skill: 7, difficulty: 1, prompt: '每分钟走 50 米，走 200 米需要几分钟？', type: 'numeric', answerNum: 4 },
  { id: '7-m-5', skill: 7, difficulty: 2, prompt: '成人票 50 元，儿童票 30 元，共 10 张，总价 380 元。成人有几张？', type: 'numeric', answerNum: 4 },
  { id: '7-h-5', skill: 7, difficulty: 3, prompt: '甲每小时 3 件，乙每小时 c 件，5 小时共 40 件。求 c。', type: 'numeric', answerNum: 5 }
);


// State
const state = {
  studentName: '',
  sessionId: uuid(),
  currentIndex: 0,
  totalQuestions: 10,
  askedIds: new Set(),
  currentSkill: 1,
  // per-skill difficulty (start medium)
  skillDifficulty: { 1:2,2:2,3:2,4:2,5:2,6:2,7:2 },
  timerStart: 0,
  currentQuestion: null,
  // new: streak of correct answers per skill
  streakCorrect: { 1:0,2:0,3:0,4:0,5:0,6:0,7:0 },
  lastEval: { ok: false, responseTimeMs: 0 },
  // new: local history of answers for evaluation
  history: [],
  // 新增：每个 (skill-diff) 的题目队列（预洗牌）
  questionQueues: {},
  // 新增：当前题目的尝试次数
  attemptsOnCurrent: 0,
  // 新增：错题暂存（含首次错误但尚未结束该题）
  wrongAttempts: []
};

// LeanCloud init
function initLeanCloud() {
  AV.init({
    appId: '9TYbIRElVQXVbkgdQ9T3c9Hu-gzGzoHsz',
    appKey: 't8uLexRCkKORlQtmcZAISqep',
    serverURL: 'https://9tybirel.lc-cn-n1-shared.com',
  });
}

// Select next question based on current skill & difficulty
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function buildQuestionQueues() {
  state.questionQueues = {};
  for (let s = 1; s <= 7; s++) {
    for (let d = 1; d <= 3; d++) {
      const key = `${s}-${d}`;
      const ids = QUESTIONS.filter(q => q.skill === s && q.difficulty === d).map(q => q.id);
      state.questionQueues[key] = shuffle(ids);
    }
  }
}
function pickQuestion() {
  const skill = state.currentSkill;
  const diff = state.skillDifficulty[skill] || 2;
  const key = `${skill}-${diff}`;
  const queue = state.questionQueues[key] || [];
  let nextId = queue.find(id => !state.askedIds.has(id));
  let q = nextId ? QUESTIONS.find(x => x.id === nextId) : null;
  if (!q) {
    // 若该难度耗尽，尝试该技能下的其他难度队列
    for (let d = 1; d <= 3; d++) {
      if (d === diff) continue;
      const k = `${skill}-${d}`;
      const qid = (state.questionQueues[k] || []).find(id => !state.askedIds.has(id));
      if (qid) { q = QUESTIONS.find(x => x.id === qid); break; }
    }
  }
  return q || null;
}

function updateUIStatus() {
  document.getElementById('student-display').textContent = state.studentName;
  document.getElementById('progress-display').textContent = `${state.currentIndex}/${state.totalQuestions}`;
  document.getElementById('skill-display').textContent = SKILL_NAMES[state.currentSkill];
  document.getElementById('difficulty-display').textContent = DIFF_LABEL[state.skillDifficulty[state.currentSkill]];
}

// Expression equivalence using randomized evaluation with math.js
function extractVars(expr) {
  const set = new Set();
  const m = (expr || '').match(/[a-zA-Z]/g);
  (m||[]).forEach(ch => set.add(ch));
  return Array.from(set);
}
function exprEquivalent(userExpr, expectedList) {
  try {
    const cleanUser = userExpr.replace(/\s+/g, '');
    const userVars = extractVars(cleanUser);
    const testVals = [-3,-2,-1,1,2,3];
    for (const exp of expectedList) {
      const cleanExp = exp.replace(/\s+/g, '');
      const expVars = extractVars(cleanExp);
      const vars = Array.from(new Set([...userVars, ...expVars]));
      let allOk = true;
      for (let i=0; i<8; i++) {
        const scope = {};
        vars.forEach(v => { scope[v] = testVals[(Math.floor(Math.random()*testVals.length))]; });
        const u = math.evaluate(cleanUser, scope);
        const e = math.evaluate(cleanExp, scope);
        if (!nearlyEqual(Number(u), Number(e))) { allOk = false; break; }
      }
      if (allOk) return true;
    }
    return false;
  } catch (e) { return false; }
}

function showQuestion(q) {
  state.currentQuestion = q;
  // 重置当前题目的尝试次数
  state.attemptsOnCurrent = 0;
  const qt = document.getElementById('question-text');
  // Default: plain text
  qt.textContent = q.prompt;
  // For Polynomials Simplify, render expression with MathJax and show math keyboard
  if (q.skill === 4 && q.type === 'expr') {
    const cleaned = (q.prompt || '').replace(/。$/, '');
    const parts = cleaned.split('：');
    if (parts.length === 2) {
      const label = parts[0];
      const expr = parts[1];
      qt.innerHTML = `<span>${label}：</span><span class=\"math-expr\">\\(${expr}\\)</span>`;
      if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
        window.MathJax.typesetPromise([qt]).catch(console.error);
      }
    }
  }
  const inputEl = document.getElementById('answer-input');
  inputEl.value = '';
  // Toggle math keyboard and preview visibility
  const kb = document.getElementById('math-keyboard');
  const pv = document.getElementById('answer-preview');
  const isPoly = q.skill === 4 && q.type === 'expr';
  const isLettersExpr = q.skill === 3 && q.type === 'expr';
  if (kb) kb.classList.toggle('hidden', !isPoly);
  if (pv) {
    const showPreview = isPoly || isLettersExpr;
    pv.classList.toggle('hidden', !showPreview);
    pv.innerHTML = '';
  }
  // 清理反馈
  const fbEl = document.getElementById('feedback');
  fbEl.textContent = '';
  fbEl.className = 'feedback';
  // 隐藏反馈相关按钮
  document.getElementById('ease-query').classList.add('hidden');
  document.getElementById('next-question-btn').classList.add('hidden');
  // 正确显示当前题目的能力项与难度级别
  document.getElementById('skill-display').textContent = SKILL_NAMES[q.skill];
  document.getElementById('difficulty-display').textContent = DIFF_LABEL[q.difficulty];
  // 计时开始
  state.timerStart = Date.now();
}

function evaluateAnswer(raw) {
  const q = state.currentQuestion;
  if (!q) return { ok:false };
  if (q.type === 'numeric') {
    const userVal = parseNumeric(raw);
    if (isNaN(userVal)) return { ok:false, reason:'答案需为数字或分数（如 3/4）' };
    const ok = nearlyEqual(userVal, q.answerNum);
    return { ok, expected: q.answerNum, given: userVal };
  } else {
    const s = (raw||'').toString().trim();
    const expListRaw = q.answers || q.answer || [];
    const expList = Array.isArray(expListRaw) ? expListRaw : [expListRaw];
    const ok = exprEquivalent(s, expList);
    const expectedFirst = Array.isArray(expList) ? (expList[0] || '') : expList;
    return { ok, expected: expectedFirst, given: raw };
  }
}

function saveResultToLeanCloud(result) {
  return Promise.resolve();
}

function saveFeedbackToLeanCloud(type) {
  return Promise.resolve();
}

function nextSkill() {
  // Cycle 1..7
  state.currentSkill = state.currentSkill % 7 + 1;
}

function handleSubmit() {
  const answer = document.getElementById('answer-input').value;
  const evalRes = evaluateAnswer(answer);
  const timeMs = Date.now() - state.timerStart;
  evalRes.responseTimeMs = timeMs;
  state.lastEval = { ok: evalRes.ok, responseTimeMs: timeMs };
  const skill = state.currentQuestion.skill;
  // 增加当前题目的尝试次数
  state.attemptsOnCurrent = (state.attemptsOnCurrent || 0) + 1;

  // 更新连对统计
  if (evalRes.ok) state.streakCorrect[skill] = (state.streakCorrect[skill] || 0) + 1;
  else state.streakCorrect[skill] = 0;

  const fbEl = document.getElementById('feedback');
  const easeEl = document.getElementById('ease-query');
  const nextBtn = document.getElementById('next-question-btn');

  if (evalRes.ok) {
    // 正确
    if (state.attemptsOnCurrent >= 2) {
      // 第二次作答后自动跳过，不弹“难度合适”询问
      fbEl.textContent = `正确！(Correct) 用时 ${timeMs} ms，自动跳至下一题。`;
      fbEl.classList.add('correct');
      easeEl.classList.add('hidden');
      // 记录最终成绩
      state.history.push({
        skill: state.currentQuestion.skill,
        skillName: SKILL_NAMES[state.currentQuestion.skill],
        difficulty: state.currentQuestion.difficulty,
        isCorrect: true,
        responseTimeMs: timeMs,
        questionId: state.currentQuestion.id,
      });
      setTimeout(() => { goNextQuestion('same'); }, 1200);
    } else {
      // 第一次就答对：保持原逻辑，给出“太简单/合适”选择
      fbEl.textContent = `正确！(Correct) 用时 ${timeMs} ms`;
      fbEl.classList.add('correct');
      easeEl.classList.remove('hidden');
      // 不立即推进，等待学生选择；记录成绩待推进时写入
    }
  } else {
    // 不正确
    if (state.attemptsOnCurrent === 1) {
      // 第一次错误：给第二次尝试机会，并暂存此题为“错题”
      fbEl.textContent = `不正确 (Incorrect)。请再试一次。`;
      fbEl.classList.add('incorrect');
      nextBtn.classList.add('hidden');
      const q = state.currentQuestion;
      if (q) {
        // 若尚未记录该题的错题尝试则加入（按题号去重）
        const exists = (state.wrongAttempts || []).some(w => w.questionId === q.id);
        if (!exists) {
          state.wrongAttempts.push({
            questionId: q.id,
            skill: q.skill,
            skillName: SKILL_NAMES[q.skill],
            difficulty: q.difficulty
          });
        }
      }
    } else {
      // 第二次错误：自动跳过，并记录错误（最终）
      fbEl.textContent = `仍不正确 (Incorrect)。将自动跳过此题。`;
      fbEl.classList.add('incorrect');
      easeEl.classList.add('hidden');
      state.history.push({
        skill: state.currentQuestion.skill,
        skillName: SKILL_NAMES[state.currentQuestion.skill],
        difficulty: state.currentQuestion.difficulty,
        isCorrect: false,
        responseTimeMs: timeMs,
        questionId: state.currentQuestion.id,
      });
      // 也确保错题暂存中包含此题
      const q = state.currentQuestion;
      if (q) {
        const exists = (state.wrongAttempts || []).some(w => w.questionId === q.id);
        if (!exists) {
          state.wrongAttempts.push({
            questionId: q.id,
            skill: q.skill,
            skillName: SKILL_NAMES[q.skill],
            difficulty: q.difficulty
          });
        }
      }
      setTimeout(() => { goNextQuestion('down'); }, 1200);
    }
  }
  saveResultToLeanCloud(evalRes).catch(console.error);
}

function goNextQuestion(adjustment) {
  // adjustment: 'up'|'down'|'same' based on feedback/correctness
  const skill = state.currentQuestion.skill;
  const cur = state.skillDifficulty[skill];
  const fastThresholdMs = 8000; // 8s considered fast
  const slowThresholdMs = 20000; // 20s considered slow
  const last = state.lastEval;
  if (adjustment === 'down' || (last && !last.ok)) {
    state.skillDifficulty[skill] = Math.max(1, cur - 1);
  } else if (adjustment === 'up') {
    state.skillDifficulty[skill] = Math.min(3, cur + 1);
  } else {
    // adjustment === 'same' but consider time and streak
    const streak = state.streakCorrect[skill] || 0;
    if (last && last.ok && streak >= 2 && last.responseTimeMs <= fastThresholdMs) {
      state.skillDifficulty[skill] = Math.min(3, cur + 1);
    } else if (last && last.responseTimeMs >= slowThresholdMs) {
      state.skillDifficulty[skill] = Math.max(1, cur - 1);
    }
  }

  // mark asked
  state.askedIds.add(state.currentQuestion.id);
  state.currentIndex += 1;
  if (state.currentIndex >= state.totalQuestions) {
    showSummary();
    return;
  }

  // move to next skill to cover all topics
  nextSkill();
  updateUIStatus();
  const q = pickQuestion();
  if (!q) {
    document.getElementById('feedback').textContent = '题库不足，无法继续出题。';
    return;
  }
  showQuestion(q);
}

function showSummary() {
  document.getElementById('question-card').classList.add('hidden');
  const summary = document.getElementById('summary-card');
  summary.classList.remove('hidden');
  const evals = computeEvaluation(state.history);
  const incorrectListHtml = renderIncorrectQuestions(state.history);
  const html = [
    `<p>学生：${state.studentName}</p>`,
    `<p>场次：${state.sessionId}</p>`,
    `<p>完成题数：${state.currentIndex}</p>`,
    renderStudentEvaluationTable(evals)
  ].join('');
  document.getElementById('summary-content').innerHTML = html;
  saveEvaluationToLeanCloud(evals).catch(console.error);
}

function restart() {
  state.studentName = '';
  state.sessionId = uuid();
  state.currentIndex = 0;
  state.askedIds = new Set();
  state.currentSkill = 1;
  state.skillDifficulty = { 1:2,2:2,3:2,4:2,5:2,6:2,7:2 };
  state.streakCorrect = { 1:0,2:0,3:0,4:0,5:0,6:0,7:0 };
  state.lastEval = { ok:false, responseTimeMs:0 };
  document.getElementById('start-section').classList.remove('hidden');
  document.getElementById('quiz-section').classList.add('hidden');
  document.getElementById('summary-card').classList.add('hidden');
  document.getElementById('question-card').classList.remove('hidden');
}

function startQuiz() {
  const name = document.getElementById('student-name').value.trim();
  if (!name) { alert('请先输入姓名。'); return; }
  const total = parseInt(document.getElementById('total-questions-select').value, 10);
  state.totalQuestions = (isNaN(total) ? 21 : Math.min(49, Math.max(21, total)));
  state.studentName = name;
  document.getElementById('student-display').textContent = name;
  document.getElementById('start-section').classList.add('hidden');
  document.getElementById('quiz-section').classList.remove('hidden');
  state.currentIndex = 0;
  state.currentSkill = 1;
  state.skillDifficulty = { 1:2,2:2,3:2,4:2,5:2,6:2,7:2 };
  state.streakCorrect = { 1:0,2:0,3:0,4:0,5:0,6:0,7:0 };
  state.history = [];
  state.wrongAttempts = [];
  // 构建每个技能-难度的预洗牌队列，确保均衡轮换
  buildQuestionQueues();
  updateUIStatus();
  const q = pickQuestion();
  if (!q) {
    document.getElementById('feedback').textContent = '题库不足，无法继续出题。';
    return;
  }
  showQuestion(q);
}

function insertAtCursor(input, text) {
  if (!input) return;
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  const before = input.value.slice(0, start);
  const after = input.value.slice(end);
  input.value = before + text + after;
  const pos = start + text.length;
  input.setSelectionRange(pos, pos);
  updateAnswerPreview();
}
// Transform ASCII expr to a nicer TeX for preview
function exprAsciiToTeX(s) {
  if (!s) return '';
  let t = s;
  // Replace multiplication * with \cdot
  t = t.replace(/\*/g, '\\cdot ');
  // Normalize Unicode minus to hyphen for TeX
  t = t.replace(/−/g, '-');
  // Space after operators for readability
  t = t.replace(/([+\-])/g, '$1 ');
  return t;
}
function updateAnswerPreview() {
  const q = state.currentQuestion;
  const pv = document.getElementById('answer-preview');
  if (!pv || !q || !(((q.skill === 4) || (q.skill === 3)) && q.type === 'expr')) return;
  const raw = document.getElementById('answer-input').value || '';
  const tex = exprAsciiToTeX(raw.trim());
  if (!tex) { pv.innerHTML = ''; return; }
  pv.innerHTML = `\\(${tex}\\)`;
  if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
    window.MathJax.typesetPromise([pv]).catch(console.error);
  }
}

function bindEvents() {
  document.getElementById('start-btn').addEventListener('click', startQuiz);
  document.getElementById('submit-answer-btn').addEventListener('click', handleSubmit);
  document.getElementById('next-question-btn').addEventListener('click', () => {
    // incorrect => difficulty down
    goNextQuestion('down');
    document.getElementById('next-question-btn').classList.add('hidden');
  });
  document.getElementById('too-easy-btn').addEventListener('click', () => {
    saveFeedbackToLeanCloud('too_easy').catch(console.error);
    document.getElementById('ease-query').classList.add('hidden');
    // 记录当前题为正确（第一次答对后选择）
    if (state.currentQuestion) {
      state.history.push({
        skill: state.currentQuestion.skill,
        skillName: SKILL_NAMES[state.currentQuestion.skill],
        difficulty: state.currentQuestion.difficulty,
        isCorrect: true,
        responseTimeMs: state.lastEval.responseTimeMs || 0,
        questionId: state.currentQuestion.id,
      });
    }
    goNextQuestion('up');
  });
  document.getElementById('just-right-btn').addEventListener('click', () => {
    saveFeedbackToLeanCloud('just_right').catch(console.error);
    document.getElementById('ease-query').classList.add('hidden');
    // 记录当前题为正确（第一次答对后选择）
    if (state.currentQuestion) {
      state.history.push({
        skill: state.currentQuestion.skill,
        skillName: SKILL_NAMES[state.currentQuestion.skill],
        difficulty: state.currentQuestion.difficulty,
        isCorrect: true,
        responseTimeMs: state.lastEval.responseTimeMs || 0,
        questionId: state.currentQuestion.id,
      });
    }
    goNextQuestion('same');
  });
  document.getElementById('end-btn').addEventListener('click', showSummary);
  document.getElementById('restart-btn').addEventListener('click', restart);
  // 错题面板按钮
  const viewWrongBtn = document.getElementById('view-wrong-btn');
  if (viewWrongBtn) viewWrongBtn.addEventListener('click', showWrongPanel);
  const closeWrongBtn = document.getElementById('close-wrong-btn');
  if (closeWrongBtn) closeWrongBtn.addEventListener('click', hideWrongPanel);
  // Teacher panel events
  document.getElementById('open-teacher-btn').addEventListener('click', () => {
    document.getElementById('teacher-panel').classList.remove('hidden');
    window.scrollTo({ top: document.getElementById('teacher-panel').offsetTop, behavior: 'smooth' });
  });
  document.getElementById('teacher-login-btn').addEventListener('click', teacherLogin);
  // Math keyboard input
  const kb = document.getElementById('math-keyboard');
  if (kb) {
    kb.addEventListener('click', (e) => {
      const btn = e.target.closest('.math-key');
      if (!btn) return;
      const ins = btn.getAttribute('data-insert') || btn.textContent;
      const input = document.getElementById('answer-input');
      insertAtCursor(input, ins);
      input.focus();
    });
  }
  // Live preview on typing for polynomial expr & letters-as-numbers expr
  const input = document.getElementById('answer-input');
  input.addEventListener('input', updateAnswerPreview);
}

// Teacher panel logic
function teacherLogin() {
  const pass = document.getElementById('teacher-pass').value.trim();
  const fb = document.getElementById('teacher-auth-feedback');
  if (pass === '123456') {
    fb.textContent = '登录成功'; fb.classList.add('correct');
    document.getElementById('teacher-content').classList.remove('hidden');
    initTeacherFilters();
    refreshTeacherData();
  } else {
    fb.textContent = '密码错误'; fb.classList.add('incorrect');
  }
}
function initTeacherFilters() {
  // populate skill filter
  const skillSel = document.getElementById('skill-filter');
  skillSel.innerHTML = '<option value="">全部 / All</option>' + Object.entries(SKILL_NAMES).map(([k,v]) => `<option value="${k}">${v}</option>`).join('');
  // populate student filter from data
  fetchDistinctStudents().then(list => {
    const sel = document.getElementById('student-filter');
    sel.innerHTML = '<option value="">全部 / All</option>' + list.map(n => `<option value="${n}">${n}</option>`).join('');
  }).catch(console.error);
}
function fetchDistinctStudents() {
  // 改为从 EvaluationResult 中汇总学生列表，移除对 TestResult 的依赖
  const query = new AV.Query('EvaluationResult');
  query.limit(1000);
  query.descending('createdAt');
  return query.find().then(res => {
    const set = new Set();
    res.forEach(o => { const n = o.get('studentName'); if (n) set.add(n); });
    return Array.from(set).sort();
  });
}
function refreshTeacherData() {
  const student = document.getElementById('student-filter').value;
  const skillVal = document.getElementById('skill-filter').value;
  
  // 查询评估结果数据
  const query = new AV.Query('EvaluationResult');
  if (student) query.equalTo('studentName', student);
  query.limit(1000);
  query.descending('createdAt');
  
  query.find().then(res => {
    const evaluations = [];
    res.forEach(record => {
      const studentName = record.get('studentName');
      const sessionId = record.get('sessionId');
      const totalQuestions = record.get('totalQuestions');
      const overallAccuracy = record.get('overallAccuracy');
      const evalData = record.get('evaluations') || [];
      
      evalData.forEach(evaluation => {
         if (!skillVal || evaluation.skill === Number(skillVal)) {
           evaluations.push({
             studentName,
             sessionId,
             totalQuestions,
             overallAccuracy,
             skill: evaluation.skill,
             skillName: evaluation.skillName,
             accuracy: evaluation.accuracy,
             avgDifficulty: evaluation.avgDifficulty,
             level: evaluation.level,
             createdAt: record.get('createdAt')
           });
         }
       });
    });
    
    renderTeacherEvaluations(evaluations);
  }).catch(console.error);
}

function renderTeacherEvaluations(evaluations) {
  const container = document.getElementById('teacher-evaluation-content');
  
  if (evaluations.length === 0) {
    container.innerHTML = '<p>暂无学习目标评定数据</p>';
    return;
  }
  
  // 按学生分组
   const groupedByStudent = new Map();
   evaluations.forEach(evaluation => {
     if (!groupedByStudent.has(evaluation.studentName)) {
       groupedByStudent.set(evaluation.studentName, []);
     }
     groupedByStudent.get(evaluation.studentName).push(evaluation);
   });
  
  let html = '<h3>学习目标评定</h3>';
  
  groupedByStudent.forEach((evals, studentName) => {
    // 获取最新的评估记录
    const latestEvals = evals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 7);
    const latestSession = latestEvals[0];
    
    html += `
      <div class="student-evaluation-section">
        <h4>${studentName} (${latestSession.totalQuestions}题, 总体正确率: ${(latestSession.overallAccuracy * 100).toFixed(1)}%)</h4>
        <div class="evaluation-grid">
    `;
    
    latestEvals.forEach(evaluation => {
       const levelClass = evaluation.level === '优秀' ? 'excellent' : evaluation.level === '良好' ? 'good' : 'improve';
       html += `
         <div class="evaluation-item">
           <div class="skill-name">${evaluation.skillName}</div>
           <div class="skill-stats">
             正确率: ${(evaluation.accuracy * 100).toFixed(1)}% | 
             平均难度: ${evaluation.avgDifficulty.toFixed(1)}
           </div>
           <span class="level-badge ${levelClass}">${evaluation.level}</span>
         </div>
       `;
     });
    
    html += `
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// Boot
initLeanCloud();
bindEvents();

// Compute per-skill accuracy and average difficulty, and classify levels
function computeEvaluation(history) {
  const bySkill = new Map();
  history.forEach(h => {
    const k = h.skill;
    if (!bySkill.has(k)) bySkill.set(k, { skill: k, skillName: h.skillName, total:0, correct:0, diffSum:0 });
    const g = bySkill.get(k);
    g.total += 1; if (h.isCorrect) g.correct += 1; g.diffSum += (h.difficulty||2);
  });
  const evals = [];
  for (let k=1; k<=7; k++) {
    const g = bySkill.get(k) || { skill:k, skillName: SKILL_NAMES[k], total:0, correct:0, diffSum:0 };
    const acc = g.total ? g.correct/g.total : 0;
    const avgDiff = g.total ? g.diffSum/g.total : 0;
    const level = classifyLevel(acc, avgDiff);
    evals.push({ skill: g.skill, skillName: g.skillName, total: g.total, correct: g.correct, accuracy: acc, avgDifficulty: avgDiff, level });
  }
  return evals;
}

function classifyLevel(accuracy, avgDifficulty) {
  const accPct = accuracy * 100;
  if (accPct >= 85 && avgDifficulty >= 2.2) return '优秀';
  if (accPct >= 60 && avgDifficulty >= 1.8) return '良好';
  return '需改进';
}

function renderStudentEvaluationTable(evals) {
  const rows = evals.map(e => {
    const badgeClass = e.level === '优秀' ? 'excellent' : (e.level === '良好' ? 'good' : 'improve');
    const accText = (e.accuracy*100).toFixed(1) + '%';
    const diffText = e.avgDifficulty.toFixed(2);
    return `<tr><td>${e.skillName}</td><td>${accText}</td><td>${diffText}</td><td><span class="badge ${badgeClass}">${e.level}</span></td></tr>`;
  }).join('');
  return `<h3>学习目标评定</h3><table class="summary-table"><thead><tr><th>学习目标</th><th>正确率</th><th>平均难度</th><th>等级</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function saveEvaluationToLeanCloud(evals) {
  const EvaluationResult = AV.Object.extend('EvaluationResult');
  const studentName = state.studentName || '';
  const sessionId = state.sessionId;
  const totalQuestions = state.totalQuestions;
  const overallAcc = state.history.length ? state.history.filter(h => h.isCorrect).length / state.history.length : 0;

  const query = new AV.Query('EvaluationResult');
  query.equalTo('studentName', studentName);

  return query.first().then(existing => {
    const target = existing ? existing : new EvaluationResult();

    // 覆盖更新：移除旧记录中不在当前数据集的自定义字段，确保字段完全覆盖
    const keysToKeep = ['studentName', 'sessionId', 'totalQuestions', 'overallAccuracy', 'evaluations'];
    const systemKeys = ['objectId', 'createdAt', 'updatedAt', 'ACL'];
    if (existing && existing.attributes) {
      Object.keys(existing.attributes).forEach(k => {
        if (!keysToKeep.includes(k) && !systemKeys.includes(k)) {
          target.unset(k);
        }
      });
    }

    // 写入最新数据
    target.set('studentName', studentName);
    target.set('sessionId', sessionId);
    target.set('totalQuestions', totalQuestions);
    target.set('overallAccuracy', overallAcc);
    target.set('evaluations', evals);

    // 并发规避：开启 fetchWhenSave 以在保存前获取服务器最新版本
    return target.save(null, { fetchWhenSave: true });
  }).catch(() => {
    // 查询失败时退化为新建保存，确保流程不中断
    const obj = new EvaluationResult();
    obj.set('studentName', studentName);
    obj.set('sessionId', sessionId);
    obj.set('totalQuestions', totalQuestions);
    obj.set('overallAccuracy', overallAcc);
    obj.set('evaluations', evals);
    return obj.save();
  });
}

function renderIncorrectQuestions(history) {
  // 合并“最终错误题”（history中 isCorrect=false）与“暂存错题”（包括首次错误但未结束该题）
  const finalWrong = (history || []).filter(h => h && h.isCorrect === false);
  const provisionalWrong = state.wrongAttempts || [];
  // 按题号去重（优先保留最终错误）
  const map = new Map();
  finalWrong.forEach(h => map.set(h.questionId, { questionId: h.questionId, skill: h.skill, skillName: h.skillName, difficulty: h.difficulty }));
  provisionalWrong.forEach(w => { if (!map.has(w.questionId)) map.set(w.questionId, w); });
  const list = Array.from(map.values());
  if (list.length === 0) {
    return `<h3>错题回顾</h3><p>本次没有错题或暂存错题。</p>`;
  }
  const rows = list.map(item => {
    const q = QUESTIONS.find(x => x.id === item.questionId);
    const prompt = q ? q.prompt : item.questionId;
    let expected = '';
    if (q) {
      if (q.type === 'numeric') expected = (q.answerNum != null ? q.answerNum : '');
      else {
        const ans = q.answers || q.answer || [];
        expected = Array.isArray(ans) ? ans[0] : ans;
      }
    }
    // 计算最终结果：已纠正 / 最终错误 / 未完成
    const allAttempts = (history || []).filter(h => h && h.questionId === item.questionId);
    let status = '未完成';
    if (allAttempts.some(h => h.isCorrect === true)) status = '已纠正';
    else if (allAttempts.some(h => h.isCorrect === false)) status = '最终错误';
    return `
      <tr>
        <td>${item.questionId}</td>
        <td>${item.skillName}</td>
        <td>${DIFF_LABEL[item.difficulty]}</td>
        <td>${prompt}</td>
        <td>${expected}</td>
        <td>${status}</td>
      </tr>
    `;
  }).join('');
  return `
    <h3>错题回顾</h3>
    <table class=\"summary-table\">
      <thead>
        <tr>
          <th>题号</th>
          <th>能力项</th>
          <th>难度</th>
          <th>题目</th>
          <th>参考答案</th>
          <th>最终结果</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function showWrongPanel() {
  const wrongCard = document.getElementById('wrong-card');
  const content = document.getElementById('wrong-content');
  const html = renderIncorrectQuestions(state.history);
  content.innerHTML = html;
  wrongCard.classList.remove('hidden');
  // 滚动到错题卡片区域
  const el = document.getElementById('wrong-card');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
function hideWrongPanel() {
  document.getElementById('wrong-card').classList.add('hidden');
}