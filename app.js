let config = {
    renderer: Phaser.AUTO,
    width: 1920,
    height: 1000,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/background.webp');
    this.load.image('road', 'assets/road.png');
    this.load.image('column', 'assets/tuberia.webp');
    this.load.image('pikachu', 'assets/pikachu.webp');
}

let hasLanded = false;
let hasBumped = false;
let isGameStarted = false;
let messageToPlayer;
let messageToPlayer2;
let scoreMessage;
let backgroundMessage;
let speed = 50;  
let passedColumns = false;
let score = 0;
let bestScore = localStorage.getItem('bestScore');
if(!bestScore){
    localStorage.getItem('bestScore',0);
    bestScore = 0;
}
let gameOver = false;
let restartMessage;
let topColumns;
let bottomColumns;


function hitColumn(pikachu, column) {
    pikachu.setVelocityX(0);
    pikachu.setVelocityY(0);
    gameOver = true;
    bottomColumns.children.iterate(function (col) {
        col.setVelocityX(0);
    });
    topColumns.children.iterate(function (col) {
        col.setVelocityX(0);
    });
    if(score > bestScore){
        localStorage.setItem('bestScore',score)
    }
}

function restartGame() {
    pikachu.setVelocityX(0);
    pikachu.setVelocityY(0);

    topColumns.children.iterate(function (col) {
        col.setVelocityX(0);
    });
    bottomColumns.children.iterate(function (col) {
        col.setVelocityX(0);
    });

    background.tilePositionX = 0;

    score = 0;
    scoreMessage.setText('Score: ' + score);

    pikachu.setPosition(100, 200);

    topColumns.children.iterate(function (column) {
        column.displayHeight = Phaser.Math.Between(150, 400); 
        column.setPosition(1200, Phaser.Math.Between(0, 600 - column.displayHeight));
        column.setVelocityX(-speed);
        column.passed = false;
    });
    bottomColumns.children.iterate(function (column) {
        column.displayHeight = Phaser.Math.Between(150, 400);  
        column.setPosition(1200, 690);
        column.setVelocityX(-speed);
    });

    isGameStarted = false;
    gameOver = false;
}

function create() {
    background = this.add.tileSprite(0, 0, 1920, 1000, 'background').setOrigin(0, 0);
    const roads = this.physics.add.staticGroup();
    const road = roads.create(500, 860, 'road').setScale(2).refreshBody();
    road.displayWidth = 2700; 
    road.displayHeight = 150;
  
    topColumns = this.physics.add.group({
        key: 'column',
        repeat: 500,
        setXY: { x: 1200, y: 0, stepX: 300 }
    });
  
    bottomColumns = this.physics.add.group({
        key: 'column',
        repeat: 500,
        setXY: { x: 1200, y: 690, stepX: 300 }
    });
  
    topColumns.children.iterate(function (column) {
        column.displayWidth = 100;
        column.displayHeight = Phaser.Math.Between(150, 400);  
        column.setImmovable(true);
        column.setGravityY(0);
        column.setVelocityX(-speed);
        column.body.allowGravity = false;
        column.body.velocity.y = 0;
    });
  
    bottomColumns.children.iterate(function (column) {
        column.displayWidth = 100;
        column.displayHeight = Phaser.Math.Between(150, 400);  
        column.setImmovable(true);
        column.setGravityY(0);
        column.setVelocityX(-speed);
        column.body.allowGravity = false;
        column.body.velocity.y = 0;
    });
  
    pikachu = this.physics.add.sprite(100, 200, 'pikachu').setScale(1);
    pikachu.setBounce(0.2);
    pikachu.setCollideWorldBounds(true);
  
    this.physics.add.collider(pikachu, road);
    this.physics.add.collider(pikachu, topColumns, (pikachu, column) => hitColumn.call(this, pikachu, column));
    this.physics.add.collider(pikachu, bottomColumns, (pikachu, column) => hitColumn.call(this, pikachu, column));
  
    cursors = this.input.keyboard.createCursorKeys();
    this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  
    backgroundMessage = this.add.graphics();
    backgroundMessage.fillStyle(0xFC6B4C, 1);
    backgroundMessage.fillRoundedRect(500, 50, 750, 500, 20);
  
    messageToPlayer = this.add.text(500 + 750 / 4, 50 + 500 / 4, 'Flying Pikachu!', {
        font: 'bold 32px Arial',
        fill: '#ffffff',
    });
  
    messageToPlayer2 = this.add.text(500 + 750 / 3, 50 + 500 / 3, 'Press space to start', {
        font: 'bold 32px Arial',
        fill: '#ffffff',
    });
    scoreMessage = this.add.text(500 + 750 / 3, 50 + 500 / 3, 'Score: ' + score, {});
    scoreMessage.setVisible(false);
    bestScoremessage = this.add.text(500 / 3, 50 + 500 / 3, 'Best Score: ' + localStorage.getItem('bestScore'), {});
    this.restartMessage = this.add.text(500 + 750 / 4, 50 + 500 / 4, 'Press space to restart', {
      font: 'bold 32px Arial',
      fill: '#ffffff',
    });
    this.restartMessage.setVisible(false);


}



function update() {
    const maxX = config.width / 2;

    if (this.wKey.isDown && !hasLanded && !gameOver) {
        pikachu.setVelocityY(-160);
    }

    if (pikachu.body.touching.down) {
        hasLanded = true; 
    } else {
        hasLanded = false; 
    }

    if (!hasLanded) {
        pikachu.body.velocity.x = 50;
    } else {
        pikachu.body.velocity.x = 0;
    }

    if (cursors.space.isDown && !isGameStarted && !gameOver) {
        isGameStarted = true;
        messageToPlayer.setVisible(false);
        backgroundMessage.setVisible(false);
        messageToPlayer2.setVisible(false);
        scoreMessage.setVisible(true);
    }

    if (isGameStarted) {
        background.tilePositionX += speed;

        topColumns.children.iterate(function (column) {
            if (column.x < pikachu.x && !column.passed) {
                column.passed = true;  
                score += 1; 
                scoreMessage.setText('Score: ' + score);
            }
        }, this);
    }

    if (!isGameStarted || gameOver) {
        pikachu.setVelocityY(-160);
        pikachu.setVelocityX(0);
        bottomColumns.children.iterate(function (column) {
            column.setVelocityX(0); 
        });
        topColumns.children.iterate(function (column) {
            column.setVelocityX(0); 
        });
        if (gameOver) {
            this.restartMessage.setVisible(true);
            if (cursors.space.isDown) {
                restartGame();
                gameOver = false;
            }
        }
    } else {
        bottomColumns.children.iterate(function (column) {
            column.setVelocityX(-speed); 
        });
        topColumns.children.iterate(function (column) {
            column.setVelocityX(-speed); 
        });
    }

    if (pikachu.x < 100) {  
        pikachu.x = 100;
    } else if (pikachu.x > maxX) {  
        pikachu.x = maxX;
    }

    if (pikachu.y < 0) {
        pikachu.y = 0;
        pikachu.setVelocityY(0);
    } else if (pikachu.y > this.physics.world.bounds.height) {
        pikachu.y = this.physics.world.bounds.height;
        pikachu.setVelocityY(0);
    }

    if (!hasLanded && !hasBumped) {
        pikachu.body.velocity.x = 50;
    } else {
        pikachu.body.velocity.x = 0;
        background.tilePositionX = 0;
        if(score > bestScore){
            localStorage.setItem('bestScore',score)
        }
        localStorage.getItem('bestScore',bestScore)
        if (cursors.space.isDown) {
            restartGame();
            gameOver = false;
        }
    }
}