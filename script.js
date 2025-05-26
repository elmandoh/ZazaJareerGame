let player;
let stars = [];
let treasure;
let questions = [
  { question: "ما هو 5 + 3؟", answers: ["6", "7", "8", "9"], correct: "8" },
  { question: "ما هو لون السماء؟", answers: ["أحمر", "أزرق", "أخضر", "أصفر"], correct: "أزرق" },
  { question: "ما اسم صديق ظاظا المقرب؟", answers: ["جرجير", "سمسم", "بطوط", "ميمي"], correct: "جرجير" },
  { question: "كم عدد أرجل العنكبوت؟", answers: ["4", "6", "8", "10"], correct: "8" },
  { question: "ما الذي يحب ظاظا أكله؟", answers: ["بيتزا", "كعك", "فواكه", "كل شيء"], correct: "فواكه" },
];
let level2Questions = [
  { question: "ما هو 10 - 4؟", answers: ["4", "5", "6", "7"], correct: "6" },
  { question: "ما هو الحيوان الذي يعيش في البحر؟", answers: ["أسد", "سمكة", "قط", "كلب"], correct: "سمكة" },
  { question: "ما الذي يساعد ظاظا في مغامراته؟", answers: ["كتاب", "سيارة", "خريطة", "قلم"], correct: "خريطة" },
];
let currentQuestion = 0;
let score = 0;
let level = 1;
let gameState = "welcome";
let selectedCharacter = "zaza";
let zazaImg, jareerImg, starImg, treasureImg, collectSound, winSound;

function preload() {
  zazaImg = loadImage('https://raw.githubusercontent.com/elmandoh/ZazaJareerGame/main/zaza.png');
  jareerImg = loadImage('https://raw.githubusercontent.com/elmandoh/ZazaJareerGame/main/jareer.png');
  treasureImg = loadImage('https://raw.githubusercontent.com/elmandoh/ZazaJareerGame/main/box.png');
  starImg = loadImage('https://placehold.co/30x30.png'); // استبدل برابط صورة نجمة
  collectSound = loadSound('https://freesound.org/data/previews/387/387232_5121236-lq.mp3'); // صوت جمع نجمة
  winSound = loadSound('https://freesound.org/data/previews/503/503744_5121236-lq.mp3'); // صوت الفوز
}

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('game-container');
  resetLevel();
}

function resetLevel() {
  player = { x: 50, y: 500, img: selectedCharacter === "zaza" ? zazaImg : jareerImg };
  stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push({ x: 150 + i * 150, y: 400 - i * 50, collected: false });
  }
  treasure = { x: 700, y: 100, collected: false };
  currentQuestion = 0;
  gameState = "playing";
}

function draw() {
  background(0, 0, 0, 0);
  if (gameState === "welcome") {
    document.getElementById('welcome-screen').style.display = 'flex';
  } else {
    document.getElementById('welcome-screen').style.display = 'none';
    if (gameState === "playing") {
      image(player.img, player.x, player.y, 50, 50);
      for (let star of stars) {
        if (!star.collected) {
          image(starImg, star.x, star.y, 30, 30);
        }
      }
      if (!treasure.collected) {
        image(treasureImg, treasure.x, treasure.y, 60, 60);
      }
      fill(255);
      textSize(20);
      text(`النقاط: ${score}`, 20, 30);
      text(`الشخصية: ${selectedCharacter === "zaza" ? "ظاظا" : "جرجير"}`, 20, 60);
      text(`المستوى: ${level}`, 20, 90);
      if (dist(player.x, player.y, stars[currentQuestion].x, stars[currentQuestion].y) < 40 && !stars[currentQuestion].collected) {
        gameState = "question";
      }
      if (dist(player.x, player.y, treasure.x, treasure.y) < 50 && score >= 5 && !treasure.collected) {
        treasure.collected = true;
        winSound.play();
        if (level === 1) {
          level = 2;
          questions = level2Questions;
          score = 0;
          resetLevel();
        } else {
          gameState = "win";
        }
      }
    } else if (gameState === "question") {
      fill(255, 200);
      rect(200, 150, 400, 300);
      fill(0);
      textSize(20);
      text(questions[currentQuestion].question, 250, 200);
      for (let i = 0; i < 4; i++) {
        text(questions[currentQuestion].answers[i], 250, 250 + i * 30);
      }
    } else if (gameState === "win") {
      image(treasureImg, 350, 200, 100, 100);
      fill(255, 200);
      rect(200, 300, 400, 100);
      fill(0);
      textSize(30);
      text("مبروك! لقد وجدت الكنز!", 250, 350);
    }
  }
}

function keyPressed() {
  if (gameState === "playing") {
    if (keyCode === RIGHT_ARROW) player.x = constrain(player.x + 10, 0, width - 50);
    if (keyCode === LEFT_ARROW) player.x = constrain(player.x - 10, 0, width - 50);
    if (keyCode === UP_ARROW) player.y = constrain(player.y - 10, 0, height - 50);
    if (keyCode === DOWN_ARROW) player.y = constrain(player.y + 10, 0, height - 50);
  }
}

function mousePressed() {
  if (gameState === "question") {
    for (let i = 0; i < 4; i++) {
      if (mouseX > 250 && mouseX < 550 && mouseY > 250 + i * 30 && mouseY < 270 + i * 30) {
        if (questions[currentQuestion].answers[i] === questions[currentQuestion].correct) {
          score++;
          stars[currentQuestion].collected = true;
          collectSound.play();
          currentQuestion++;
          if (currentQuestion >= stars.length) {
            gameState = "playing";
          } else {
            gameState = "playing";
          }
        } else {
          gameState = "playing";
        }
      }
    }
  }
}

function startGame(character) {
  selectedCharacter = character;
  gameState = "playing";
}
