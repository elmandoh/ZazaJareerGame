let player;
let stars = [];
let questions = [
  { question: "ما هو 5 + 3؟", answers: ["6", "7", "8", "9"], correct: "8" },
  { question: "ما هو لون السماء؟", answers: ["أحمر", "أزرق", "أخضر", "أصفر"], correct: "أزرق" },
  { question: "كم عدد أرجل العنكبوت؟", answers: ["4", "6", "8", "10"], correct: "8" },
];
let currentQuestion = 0;
let score = 0;
let gameState = "playing";

function preload() {
  // تحميل صور الشخصيات والنجوم
  playerImg = loadImage('https://placehold.co/50x50.png'); // استبدل برابط صورة ظاظا أو جرجير
  starImg = loadImage('https://placehold.co/30x30.png'); // استبدل برابط صورة النجمة
}

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('game-container');
  player = { x: 50, y: 500, img: playerImg };
  for (let i = 0; i < 5; i++) {
    stars.push({ x: 150 + i * 150, y: 400 - i * 50, collected: false });
  }
}

function draw() {
  background(0, 0, 0, 0); // خلفية شفافة لإظهار خلفية CSS
  if (gameState === "playing") {
    image(player.img, player.x, player.y, 50, 50);
    for (let star of stars) {
      if (!star.collected) {
        image(starImg, star.x, star.y, 30, 30);
      }
    }
    if (dist(player.x, player.y, stars[currentQuestion].x, stars[currentQuestion].y) < 40) {
      gameState = "question";
    }
  } else if (gameState === "question") {
    fill(255);
    rect(200, 150, 400, 300);
    fill(0);
    textSize(20);
    text(questions[currentQuestion].question, 250, 200);
    for (let i = 0; i < 4; i++) {
      text(questions[currentQuestion].answers[i], 250, 250 + i * 30);
    }
  } else if (gameState === "win") {
    fill(255);
    rect(200, 150, 400, 300);
    fill(0);
    textSize(30);
    text("مبروك! لقد وجدت الكنز!", 250, 300);
  }
}

function keyPressed() {
  if (gameState === "playing") {
    if (keyCode === RIGHT_ARROW) player.x += 10;
    if (keyCode === LEFT_ARROW) player.x -= 10;
    if (keyCode === UP_ARROW) player.y -= 10;
    if (keyCode === DOWN_ARROW) player.y += 10;
  }
}

function mousePressed() {
  if (gameState === "question") {
    for (let i = 0; i < 4; i++) {
      if (mouseX > 250 && mouseX < 550 && mouseY > 250 + i * 30 && mouseY < 270 + i * 30) {
        if (questions[currentQuestion].answers[i] === questions[currentQuestion].correct) {
          score++;
          stars[currentQuestion].collected = true;
          currentQuestion++;
          if (currentQuestion >= stars.length) {
            gameState = "win";
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