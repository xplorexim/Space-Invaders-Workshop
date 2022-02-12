const grid = document.querySelector('.grid');
const resultToDisplay = document.querySelector('#result');
let width = 15;
let score = 0;
let direction = 1;
let shooterIndexRN = 215;
let invaderID;
let goinRight = true;
let aliensTakenDown = [];

// automating creation of width x width grid
for (let i = 0; i < width*width; ++i) {
  const square = document.createElement('div');
  grid.appendChild(square);
}

// to access all 225 squares in the grid
const squares = Array.from(document.querySelectorAll('.grid div'));

// defining the alien invaders by their grid indices
const spaceInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39
];

// drawing the aliens
function drawAliens() {
  for (let i = 0; i < spaceInvaders.length; i++) {
    if(!aliensTakenDown.includes(i)) {
      squares[spaceInvaders[i]].classList.add('invader');
    }
  }
}
drawAliens();

// removing aliens from display
function removeAliens() {
  for (let i = 0; i < spaceInvaders.length; i++) {
    squares[spaceInvaders[i]].classList.remove('invader');
  }
}

// drawing the shooter
squares[shooterIndexRN].classList.add('shooter');



// moving the shooter around when event e occurs
function moveDaShooter(e) {
  
  squares[shooterIndexRN].classList.remove('shooter');
  
  switch(e.key) {
    case 'ArrowLeft':
      if (shooterIndexRN % width !== 0) 
        shooterIndexRN -= 1;
      break;
    case 'ArrowRight' :
      if (shooterIndexRN % width < width -1) 
        shooterIndexRN += 1;
      break;
  } // end of switch

  squares[shooterIndexRN].classList.add('shooter');
}

document.addEventListener('keydown', moveDaShooter);



// moving the invaders, from side to side, moving down a row each time
function moveDaInvaders() {
  
  // defining the two edges on L and R
  const leftEdge = spaceInvaders[0] % width === 0;
  const rightEdge = spaceInvaders[spaceInvaders.length - 1] % width === width -1;
  
  removeAliens(); 

  if (rightEdge && goinRight) {
    for (let i = 0; i < spaceInvaders.length; i++) {
      spaceInvaders[i] += width + 1;
      direction = -1;
      goinRight = false;
    }
  }

  if(leftEdge && !goinRight) {
    for (let i = 0; i < spaceInvaders.length; i++) {
      spaceInvaders[i] += width -1;
      direction = 1;
      goinRight = true;
    }
  }

  for (let i = 0; i < spaceInvaders.length; i++) {
    spaceInvaders[i] += direction;
  }

  drawAliens();

  // alien invader has got to the shooter square? lol game over
  if (squares[shooterIndexRN].classList.contains('invader', 'shooter')) {
    resultToDisplay.innerHTML = 'GAME OVER';
    alert("GAME OVER! :)");
    clearInterval(invaderID);
    document.removeEventListener('keydown', moveDaShooter);
    document.removeEventListener('keydown', shootDaAliens);
  }

  // aliens missed the shooter but are at the bottom? yep, game over
  for (let i = 0; i < spaceInvaders.length; i++) {
    if(spaceInvaders[i] > (squares.length)) {
      resultToDisplay.innerHTML = 'GAME OVER';
      alert("GAME OVER! :)");
      clearInterval(invaderID);
      document.removeEventListener('keydown', moveDaShooter);
      document.removeEventListener('keydown', shootDaAliens);
    }
  }

  // declare a win when all aliens are in the taken down array
  if (aliensTakenDown.length === spaceInvaders.length) {
    resultToDisplay.innerHTML = score + ' (you WIN, damn)';
    alert('YOU WIN!! Yayyiee :))))');
    clearInterval(invaderID);
  }
} 

invaderID = setInterval(moveDaInvaders, 500);



function shootDaAliens(e) {
  let laserID;
  let laserIndexRN = shooterIndexRN;
  
  // now, moving the laser from the shooter to the alien invader
  function moveDaLaser() {
    
    squares[laserIndexRN].classList.remove('laser');

    laserIndexRN -= width;
    squares[laserIndexRN].classList.add('laser');

    if (squares[laserIndexRN].classList.contains('invader')) {
      
      squares[laserIndexRN].classList.remove('laser');
      squares[laserIndexRN].classList.remove('invader');
      squares[laserIndexRN].classList.add('boom');

      setTimeout(()=> squares[laserIndexRN].classList.remove('boom'), 300);
      clearInterval(laserID);

      const deadAlien = spaceInvaders.indexOf(laserIndexRN);
      aliensTakenDown.push(deadAlien);
      ++score;
      resultToDisplay.innerHTML = score;

    } 
  } 

  // now to trigger the shoot() when we press the spacebar
  switch(e.keyCode) {
    case 32:
      laserID = setInterval(moveDaLaser, 100);
      console.log(aliensTakenDown.length);
      console.log(spaceInvaders.length);
      break;
  }
}

document.addEventListener('keydown', shootDaAliens);
