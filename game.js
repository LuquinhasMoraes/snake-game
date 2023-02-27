class SnakeGame {
  turnIA = 1
  xPesoIA = 1
  yPesoIA = 1
  currentObstacleX = -1
  speed = 1
  speedX = 0
  speedY = 0
  positionX = 10
  positionY = 29
  obstacleX = 20
  obstacleY = 20
  lengthPart = 20
  qtdPart = 30
  appleX = 10
  appleY = 10
  trail = []
  tail = 10
  score = 0
  highscore = 0
  context = document.getElementById('game').getContext('2d')

  constructor() {
    let highscore = localStorage.getItem('highscore')
    document.getElementById('highscore').innerHTML = highscore ? highscore : 0
  }

  drawMap(context) {
    context.fillStyle = 'pink'
    context.fillRect(0, 0, 600, 600)
  }

  drawRandomApple() {
    let X = Math.floor(Math.random() * this.qtdPart)
    let Y = Math.floor(Math.random() * this.qtdPart)

    const conflit = this.trail.filter(t => t.x === X && t.y === Y).length > 0

    if(!conflit) {
      this.appleX = X
      this.appleY = Y
    } else {
      this.drawRandomApple()
    }

  }

  drawObstacles(context) {
    const image = document.getElementById("image")
    context.fillStyle = 'brown'
    context.drawImage(image, this.obstacleX * this.lengthPart, this.obstacleY * this.lengthPart, 40, 40);
  }

  drawApple(context) {
    context.fillStyle = 'rgb(244, 58, 89)'
    context.fillRect(this.appleX * this.lengthPart, this.appleY * this.lengthPart, this.lengthPart - 1, this.lengthPart - 1)
  }

  drawSnake(context) {
    for (let i = 0; i < this.trail.length; i++) {
      context.fillStyle = 'rgb(61, 34, 34)'
      context.fillRect(this.trail[i].x * this.lengthPart, this.trail[i].y * this.lengthPart, this.lengthPart - 1, this.lengthPart - 1)      
      this.verifyGameOver(this.trail[i].x, this.trail[i].y)
    }
    
    this.trail.push({x: this.positionX, y: this.positionY})

    while(this.trail.length > this.tail) {
      this.trail.shift()
    }

    if(this.positionX == this.appleX && this.positionY == this.appleY ) {
      this.tail++
      this.drawRandomApple()
      this.setScore()
      // this.obstacleX = Math.floor(Math.random() * this.lengthPart)
      // this.obstacleY = Math.floor(Math.random() * this.lengthPart)
    }
  }

  setHighScore() {
    if(this.score > this.highscore) {
      localStorage.setItem('highscore', this.score)
      document.getElementById('highscore').innerHTML = this.score
      this.score = 0
    }
  }

  setScore() {
    this.score++
    document.getElementById('score').innerHTML = this.score
  }

  verifyGameOver(trailX, trailY) {
    if(this.positionX == trailX && this.positionY == trailY && this.tail > 5) {
    // if((this.positionX == trailX && this.positionY == trailY && this.tail > 5) || (this.positionX >= this.obstacleX && this.positionX < this.obstacleX + 2 && this.positionY >= this.obstacleY && this.positionY < this.obstacleY + 2)) {
      if(this.speedX > 0) {
        this.positionX--
      } else if (this.speedX < 0) {
        this.positionX++
      } else if (this.speedY > 0) {
        this.positionY--
      } else if (this.speedY < 0) {
        this.positionY++
      }
      this.tail = 5
      this.speedX = 0
      this.speedY = 0
      this.setHighScore()
      console.log('Game over!')
    }
  }

  changeDirection() {
    if (this.positionX < 0) {
      this.positionX = this.qtdPart - 1
    }
    if (this.positionX > this.qtdPart - 1) {
      this.positionX = 0
    }
    if (this.positionY < 0) {
      this.positionY = this.qtdPart - 1
    }
    if (this.positionY > this.qtdPart - 1) {
      this.positionY = 0
    }
  }

  init() {
    this.positionX += this.speedX
    this.positionY += this.speedY

    this.changeDirection()
    this.drawMap(this.context)
    this.drawApple(this.context)
    // this.drawObstacles(this.context)
    this.drawSnake(this.context)
    this.playerIA()
  }

  moveDown () {
    if(this.speedY == 0) {
      this.speedX = 0
      this.speedY = this.speed
    }
  }

  moveUp () {
    if(this.speedY == 0) { 
      this.speedX = 0
      this.speedY = -this.speed
    }
  }

  moveRight () {
    if(this.speedX == 0) {
      this.speedX = this.speed
      this.speedY = 0
    }
  }

  moveLeft () {
    if(this.speedX == 0) {
      this.speedX = -this.speed
      this.speedY = 0
    }
  }

  generateDistinctRandomNumber() {
    let lastNumber

    function made() {
      let n = Math.floor(Math.random() * 5)
      if(n == lastNumber) {
        return made()
      } else {
        return n
      }
    }

    lastNumber = made()
    return lastNumber
  }
  
  playerIA() {
    if(this.turnIA > 30) this.turnIA = 1

    if(this.positionX == this.qtdPart - 1 && this.positionY == this.qtdPart - (!(this.turnIA % 2 == 0) ? this.turnIA - 1 : this.turnIA)) {
      this.moveUp()
      setTimeout(this.moveLeft.bind(this), 1)
      this.turnIA++
    }
    else if(this.positionX == 0 && this.positionY == this.qtdPart - (this.turnIA % 2 == 0 ? this.turnIA - 1 : this.turnIA)) {
      this.moveUp()
      setTimeout(this.moveRight.bind(this), 1)
      this.turnIA++
    } 
  }

  start() {
    setInterval(this.init.bind(this), 1)
    document.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'ArrowDown':
          this.moveDown()
          break;
        case 'ArrowUp':
          this.moveUp()
          break;
        case 'ArrowRight':
          this.moveRight()
          break;
        case 'ArrowLeft':
          this.moveLeft()
          break;
        default:
          break;
      }
    })
  }
}

let snakeGame = new SnakeGame()
snakeGame.start()