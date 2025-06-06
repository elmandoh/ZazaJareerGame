let player;
let stars = [];
let treasure;
let obstacles = [];
let questions = [
  { question: "ما هو 3 + 4؟", answers: ["5", "6", "7", "8"], correct: "7" },
  { question: "ما لون الفراولة؟", answers: ["أحمر", "أزرق", "أخضر", "أصفر"], correct: "أحمر" },
  { question: "ما اسم صديق ظاظا المقرب؟", answers: ["جرجير", "سمسم", "بطوط", "ميمي"], correct: "جرجير" },
  { question: "كم عدد أصابع اليد الواحدة؟", answers: ["3", "4", "5", "6"], correct: "5" },
  { question: "ما الذي يحب ظاظا أكله؟", answers: ["بيتزا", "كعك", "فواكه", "كل شيء"], correct: "فواكه" },
  { question: "ما هو الحيوان الذي يقول 'مواء'؟", answers: ["كلب", "قط", "بقرة", "خروف"], correct: "قط" },
  { question: "ما عدد أيام الأسبوع؟", answers: ["5", "6", "7", "8"], correct: "7" },
];
let level2Questions = [
  { question: "ما هو 8 - 3؟", answers: ["4", "5", "6", "7"], correct: "5" },
  { question: "ما الحيوان الذي يعيش في البحر؟", answers: ["أسد", "سمكة", "قط", "كلب"], correct: "سمكة" },
  { question: "ما الذي يساعد ظاظا في مغامراته؟", answers: ["كتاب", "سيارة", "خريطة", "قلم"], correct: "خريطة" },
  { question: "ما لون الموز؟", answers: ["أحمر", "أصفر", "أخضر", "أزرق"], correct: "أصفر" },
  { question: "ما هو 6 × 2؟", answers: ["10", "12", "14", "16"], correct: "12" },
  { question: "ما الذي نراه في السماء ليلاً؟", answers: ["شمس", "قمر", "غيوم", "مطر"], correct: "قمر" },
  { question: "ما اسم أول يوم في الأسبوع؟", answers: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء"], correct: "الأحد" },
];
let level3Questions = [
  { question: "ما هو 15 × 2؟", answers: ["25", "30", "35", "40"], correct: "30" },
  { question: "ما عاصمة مصر؟", answers: ["القاهرة", "الرياض", "الجزائر", "تونس"], correct: "القاهرة" },
  { question: "ما الذي يطير في السماء؟", answers: ["سمكة", "طائر", "قطة", "أرنب"], correct: "طائر" },
  { question: "ما هو 20 - 8؟", answers: ["10", "11", "12", "13"], correct: "12" },
  { question: "ما أطول نهر في العالم؟", answers: ["النيل", "الأمازون", "الدانوب", "الفرات"], correct: "النيل" },
  { question: "ما الحيوان الذي يعيش في الصحراء؟", answers: ["دب", "جمل", "فيل", "قرد"], correct: "جمل" },
  { question: "ما لون الياقوت؟", answers: ["أحمر", "أخضر", "أصفر", "أزرق"], correct: "أحمر" },
];
let level4Questions = [
  { question: "ما هو 20 ÷ 5؟", answers: ["2", "4", "6", "8"], correct: "4" },
  { question: "ما أكبر قارة في العالم؟", answers: ["أفريقيا", "أوروبا", "آسيا", "أستراليا"], correct: "آسيا" },
  { question: "ما لون الشمس؟", answers: ["أحمر", "أصفر", "أخضر", "أزرق"], correct: "أصفر" },
  { question: "ما عدد الكواكب في المجموعة الشمسية؟", answers: ["7", "8", "9", "10"], correct: "8" },
  { question: "ما عاصمة فرنسا؟", answers: ["برلين", "باريس", "مدريد", "روما"], correct: "باريس" },
  { question: "ما هو 12 × 3؟", answers: ["30", "36", "42", "48"], correct: "36" },
  { question: "ما الحيوان الأسرع في العالم؟", answers: ["أرنب", "فهد", "حصان", "كلب"], correct: "فهد" },
  { question: "ما أعلى جبل في العالم؟", answers: ["إفرست", "كليمنجارو", "الألب", "الهيمالايا"], correct: "إفرست" },
  { question: "ما عدد أشهر السنة؟", answers: ["10", "11", "12", "13"], correct: "12" },
];
let currentQuestion = 0;
let score = 0;
let level = 1;
let gameState = "welcome";
let selectedCharacter = "zaza";
let zazaImg, jareerImg, starImg, treasureImg, rockImg;
let targetX, targetY;
let moveDirection = { x: 0, y: 0 };
let starBlink = 0;
let treasureShake = 0;
let fallingStars = [];
let collisionFlash = 0;
let resourcesLoaded = false;
let errorMessage = "";
let totalResources = 5; // 5 صور فقط
let loadedResources = 0;

function preload() {
  loadImage('https://raw.githubusercontent.com/elmandoh/ZazaJareerGame/main/zaza.png', (img) => {
    zazaImg = img;
    console.log("تم تحميل zaza.png بنجاح");
    loadedResources++;
    updateLoadingBar();
  }, (err) => {
    console.error("فشل تحميل zaza.png:", err);
    loadedResources++;
    updateLoadingBar();
  });
  loadImage('https://raw.githubusercontent.com/elmandoh/ZazaJareerGame/main/jareer.png', (img) => {
    jareerImg = img;
    console.log("تم تحميل jareer.png بنجاح");
    loadedResources++;
    updateLoadingBar();
  }, (err) => {
    console.error("فشل تحميل jareer.png:", err);
    loadedResources++;
    updateLoadingBar();
  });
  loadImage('https://raw.githubusercontent.com/elmandoh/ZazaJareerGame/main/box.png', (img) => {
    treasureImg = img;
    console.log("تم تحميل box.png بنجاح");
    loadedResources++;
    updateLoadingBar();
  }, (err) => {
    console.error("فشل تحميل box.png:", err);
    loadedResources++;
    updateLoadingBar();
  });
  loadImage('https://raw.githubusercontent.com/elmandoh/ZazaJareerGame/main/star.png', (img) => {
    starImg = img;
    console.log("تم تحميل star.png بنجاح");
    loadedResources++;
    updateLoadingBar();
  }, (err) => {
    console.error("فشل تحميل star.png:", err);
    loadedResources++;
    updateLoadingBar();
  });
  loadImage('https://raw.githubusercontent.com/elmandoh/ZazaJareerGame/main/rock.png', (img) => {
    rockImg = img;
    console.log("تم تحميل rock.png بنجاح");
    loadedResources++;
    updateLoadingBar();
  }, (err) => {
    console.error("فشل تحميل rock.png:", err);
    loadedResources++;
    updateLoadingBar();
  });
}

function updateLoadingBar() {
  let progress = (loadedResources / totalResources) * 100;
  document.getElementById('loading-progress').style.width = `${progress}%`;
  if (loadedResources === totalResources) {
    checkResources();
  }
}

function checkResources() {
  if (!zazaImg || !jareerImg || !treasureImg || !starImg || !rockImg) {
    errorMessage = "فشل تحميل بعض الصور الأساسية. تحقق من أسماء الملفات والروابط في المستودع.";
    console.error("الموارد المفقودة:", {
      zazaImg: !!zazaImg,
      jareerImg: !!jareerImg,
      treasureImg: !!treasureImg,
      starImg: !!starImg,
      rockImg: !!rockImg
    });
    document.getElementById('error-text').style.display = 'block';
    document.getElementById('error-text').innerText = errorMessage;
  } else {
    resourcesLoaded = true;
    document.getElementById('loading-text').innerText = "تم التحميل! اختر شخصيتك لبدء اللعبة.";
  }
}

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('game-container');
  canvas.style('width', '100%');
  canvas.style('height', '100%');
  
  if (resourcesLoaded) {
    resetLevel();
  } else {
    console.warn("الموارد لم تُحمل بعد. التحقق من الروابط.");
  }
}

function resetLevel() {
  if (!player) player = { x: 50, y: 500, img: selectedCharacter === "zaza" ? zazaImg : jareerImg };
  stars = [];
  obstacles = [];
  let starCount = level === 1 ? 7 : level === 2 ? 7 : level === 3 ? 7 : 9; // عدد النجوم حسب المستوى
  let obstacleCount = level === 1 ? 4 : level === 2 ? 5 : level === 3 ? 6 : 7; // عدد العوائق حسب المستوى
  for (let i = 0; i < starCount; i++) {
    stars.push({ x: 100 + i * 100, y: 400 - i * 40, collected: false });
  }
  for (let i = 0; i < obstacleCount; i++) {
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

      if (player.img) {
        image(player.img, player.x, player.y, 50, 50);
      } else {
        console.warn("لم يتم عرض صورة اللاعب لأن player.img غير موجود");
        fill(255, 0, 0);
        rect(player.x, player.y, 50, 50);
      }

      starBlink = (starBlink + 0.1) % TWO_PI;
      let starScale = 1 + sin(starBlink) * 0.1;
      for (let star of stars) {
        if (!star.collected) {
          if (starImg) {
            push();
            translate(star.x + 15, star.y + 15);
            scale(starScale);
            image(starImg, -15, -15, 30, 30);
            pop();
          } else {
            console.warn("لم يتم عرض النجمة لأن starImg غير موجود");
            fill(255, 255, 0);
            rect(star.x, star.y, 30, 30);
          }
        }
      }

      if (!treasure.collected) {
        if (treasureImg) {
          let distanceToTreasure = dist(player.x, player.y, treasure.x, treasure.y);
          if (distanceToTreasure < 150) {
            treasureShake = sin(frameCount * 0.2) * 5;
          } else {
            treasureShake = 0;
          }
          image(treasureImg, treasure.x + treasureShake, treasure.y, 60, 60);
        } else {
          console.warn("لم يتم عرض الكنز لأن treasureImg غير موجود");
          fill(255, 215, 0);
          rect(treasure.x, treasure.y, 60, 60);
        }
      }

      for (let obstacle of obstacles) {
        if (rockImg) {
          image(rockImg, obstacle.x, obstacle.y, obstacle.w, obstacle.h);
        } else {
          console.warn("لم يتم عرض العقبة لأن rockImg غير موجود");
          fill(150, 150, 150);
          rect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
        }
      }

      for (let obstacle of obstacles) {
        if (dist(player.x + 25, player.y + 25, obstacle.x + obstacle.w / 2, obstacle.y + obstacle.h / 2) < 35) {
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

      if (currentQuestion < stars.length && dist(player.x, player.y, stars[currentQuestion].x, stars[currentQuestion].y) < 40 && !stars[currentQuestion].collected) {
        gameState = "question";
      }
      if (dist(player.x, player.y, treasure.x, treasure.y) < 50 && score >= stars.length && !treasure.collected) {
        treasure.collected = true;
        if (level === 1) {
          level = 2;
          questions = level2Questions;
          score = 0;
          resetLevel();
        } else if (level === 2) {
          level = 3;
          questions = level3Questions;
          score = 0;
          resetLevel();
        } else if (level === 3) {
          level = 4;
          questions = level4Questions;
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
      if (treasureImg) {
        image(treasureImg, 350, 200, 100, 100);
      } else {
        console.warn("لم يتم عرض الكنز في شاشة الفوز لأن treasureImg غير موجود");
        fill(255, 215, 0);
        rect(350, 200, 100, 100);
      }
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
        if (starImg) {
          image(starImg, star.x, star.y, 20, 20);
        } else {
          console.warn("لم يتم عرض النجوم المتساقطة لأن starImg غير موجود");
          fill(255, 255, 0);
          rect(star.x, star.y, 20, 20);
        }
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
    alert("لا يمكن بدء اللعبة. هناك مشكلة في تحميل الصور الأساسية. تحقق من أسماء الملفات والروابط.");
    return;
  }
  selectedCharacter = character;
  gameState = "playing";
}
