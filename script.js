let player;
let stars = [];
let treasure;
let obstacles = [];
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
let zazaImg, jareerImg, starImg, treasureImg, rockImg, collectSound, winSound;
let targetX, targetY;
let moveDirection = { x: 0, y: 0 };
let starBlink = 0;
let treasureShake = 0;
let fallingStars = [];
let collisionFlash = 0;
let resourcesLoaded = false;
let errorMessage = "";

function preload() {
  try {
    zazaImg = loadImage('https://raw.githubusercontent.com/elmandoh/ZazaJareerGame/main/zaza.png');
    jareerImg = loadImage('https://raw.githubusercontent.com/elmandoh/ZazaJareerGame/main/jareer.png');
    treasureImg = loadImage('https://raw.githubusercontent.com/elmandoh/ZazaJareerGame/main/box.png');
    // استبدال الصور المكسورة بروابط مؤقتة من Placehold.co
    starImg = loadImage('https://placehold.co/30x30/FFD700/FFD700/png');
    rockImg = loadImage('https://placehold.co/40x40/808080/808080/png');
    collectSound = loadSound('https://freesound.org/data/previews/387/387232_5121236-lq.mp3');
    winSound = loadSound('https://freesound.org/data/previews/503/503744_5121236-lq.mp3');
  } catch (error) {
    errorMessage = "فشل تحميل بعض الموارد. تأكد من رفع الصور إلى المستودع.";
    console.error("خطأ في تحميل الموارد:", error);
  }
}

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('game-container');
  canvas.style('width', '100%');
  canvas.style('height', '100%');
  
  if (!zazaImg || !jareerImg || !treasureImg || !starImg || !rockImg || !collectSound || !winSound) {
    errorMessage = "فشل تحميل بعض الموارد. تأكد من رفع الصور إلى المستودع.";
  } else {
    resourcesLoaded = true;
  }

  if (resourcesLoaded) {
    resetLevel();
  }
}

function resetLevel() {
  if (!player) player = { x: 50, y: 500, img: selectedCharacter === "zaza" ? zazaImg : jareerImg };
  stars = [];
  obstacles = [];
  for (let i = 0; i < 5; i++) {
    stars.push({ x: 150 + i * 150, y: 400 - i * 50, collected: false });
  }
  for (let i = 0; i < 4; i++) {
    obstacles.push({ x: random(100, 700), y: random(200, 500), w: 40, h: 40 });
  }
  treasure = { x: 700, y: 100, collected: false };
  currentQuestion = 0;
  gameState = "playing";
}

function draw() {
  background(0, 0, 0, 0);

  if (gameState === "welcome") {
    document.getElementById('welcome-screen').style.display = 'flex';
    document.getElementById('controls').style.display = 'none';
    if (errorMessage) {
      document.getElementById('loading-text').style.display = 'none';
      document.getElementById('error-text').style.display = 'block';
      document.getElementById('error-text').innerText = errorMessage;
    }
  } else {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('controls').style.display = 'flex';
    if (gameState === "playing") {
      if (collisionFlash > 0) {
        fill(255, 0, 0, collisionFlash);
        rect(0, 0, width, height);
        collisionFlash -= 10;
      }

      let dx = targetX - player.x + moveDirection.x * 10;
      let dy = targetY - player.y + moveDirection.y * 10;
      let distance = dist(player.x, player.y, targetX, targetY);
      if (distance > 5 || moveDirection.x !== 0 || moveDirection.y !== 0) {
        player.x += dx * 0.1 + moveDirection.x * 5;
        player.y += dy * 0.1 + moveDirection.y * 5;
      }
      player.x = constrain(player.x, 0, width - 50);
      player.y = constrain(player.y, 0, height - 50);

      if (player.img) image(player.img, player.x, player.y, 50, 50);

      starBlink = (starBlink + 0.1) % TWO_PI;
      let starScale = 1 + sin(starBlink) * 0.1;
      for (let star of stars) {
        if (!star.collected && starImg) {
          push();
          translate(star.x + 15, star.y + 15);
          scale(starScale);
          image(starImg, -15, -15, 30, 30);
          pop();
        }
      }

      if (!treasure.collected && treasureImg) {
        let distanceToTreasure = dist(player.x, player.y, treasure.x, treasure.y);
        if (distanceToTreasure < 150) {
          treasureShake = sin(frameCount * 0.2) * 5;
        } else {
          treasureShake = 0;
        }
        image(treasureImg, treasure.x + treasureShake, treasure.y, 60, 60);
      }

      for (let obstacle of obstacles) {
        if (rockImg) image(rockImg, obstacle.x, obstacle.y, obstacle.w, obstacle.h);
      }

      for (let obstacle of obstacles) {
        if (rockImg && dist(player.x + 25, player.y + 25, obstacle.x + obstacle.w / 2, obstacle.y + obstacle.h / 2) < 35) {
          score = max(0, score - 1);
          player.x = 50;
          player.y = 500;
          collisionFlash = 100;
          break;
        }
      }

      fill(255, 230, 200);
      stroke(255, 165, 0);
      strokeWeight(4);
      rect(10, 10, 200, 90, 10);
      fill(0);
      strokeWeight(0);
      textSize(20);
      text(`النقاط: ${score}`, 20, 40);
      text(`الشخصية: ${selectedCharacter === "zaza" ? "ظاظا" : "جرجير"}`, 20, 70);
      text(`المستوى: ${level}`, 20, 100);

      fill(255, 230, 200);
      stroke(255, 165, 0);
      strokeWeight(4);
      rect(width - 310, 10, 300, 40, 10);
      fill(0);
      strokeWeight(0);
      textSize(20);
      text(currentQuestion < stars.length ? "تحرك نحو النجمة التالية!" : "افتح الكنز!", width - 300, 40);

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
          for (let i = 0; i < 20; i++) {
            fallingStars.push({ x: random(width), y: -20, speed: random(2, 5) });
          }
        }
      }
    } else if (gameState === "question") {
      fill(255, 230, 200);
      stroke(255, 165, 0);
      strokeWeight(4);
      rect(200, 150, 400, 300, 20);
      fill(0);
      strokeWeight(0);
      textSize(30);
      text(questions[currentQuestion].question, 250, 220);
      textSize(24);
      for (let i = 0; i < 4; i++) {
        fill(questions[currentQuestion].answers[i] === questions[currentQuestion].correct && mouseX > 250 && mouseX < 550 && mouseY > 250 + i * 40 && mouseY < 290 + i * 40 ? 'rgba(255, 215, 0, 0.5)' : 255);
        rect(250, 250 + i * 40, 300, 40, 10);
        fill(0);
        text(questions[currentQuestion].answers[i], 300, 280 + i * 40);
      }
    } else if (gameState === "win") {
      if (treasureImg) image(treasureImg, 350, 200, 100, 100);
      fill(255, 230, 200);
      stroke(255, 165, 0);
      strokeWeight(4);
      rect(200, 300, 400, 100, 20);
      fill(0);
      strokeWeight(0);
      textSize(30);
      text("مبروك! لقد وجدت الكنز!", 250, 350);

      for (let i = fallingStars.length - 1; i >= 0; i--) {
        let star = fallingStars[i];
        star.y += star.speed;
        if (starImg) image(starImg, star.x, star.y, 20, 20);
        if (star.y > height) {
          fallingStars.splice(i, 1);
        }
      }
    }
  }
}

function keyPressed() {
  if (gameState === "playing") {
    if (keyCode === RIGHT_ARROW) moveDirection.x = 1;
    if (keyCode === LEFT_ARROW) moveDirection.x = -1;
    if (keyCode === UP_ARROW) moveDirection.y = -1;
    if (keyCode === DOWN_ARROW) moveDirection.y = 1;
  }
}

function keyReleased() {
  if (gameState === "playing") {
    if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) moveDirection.x = 0;
    if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) moveDirection.y = 0;
  }
}

function mousePressed() {
  if (gameState === "playing") {
    targetX = mouseX;
    targetY = mouseY;
  } else if (gameState === "question") {
    for (let i = 0; i < 4; i++) {
      if (mouseX > 250 && mouseX < 550 && mouseY > 250 + i * 40 && mouseY < 290 + i * 40) {
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

function touchMoved() {
  if (gameState === "playing") {
    targetX = mouseX;
    targetY = mouseY;
    return false;
  }
}

function movePlayer(direction) {
  if (gameState === "playing") {
    if (direction === 'up') moveDirection.y = -1;
    if (direction === 'down') moveDirection.y = 1;
    if (direction === 'left') moveDirection.x = -1;
    if (direction === 'right') moveDirection.x = 1;
  }
}

function stopPlayer() {
  moveDirection.x = 0;
  moveDirection.y = 0;
}

function startGame(character) {
  if (!resourcesLoaded) {
    alert("لا يمكن بدء اللعبة. هناك مشكلة في تحميل الموارد. تأكد من رفع الصور إلى المستودع.");
    return;
  }
  selectedCharacter = character;
  gameState = "playing";
}
