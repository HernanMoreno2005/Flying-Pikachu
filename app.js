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
        update: update,
    }
};

let game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/background.webp');
    this.load.image('road', 'assets/road.png');
    this.load.image('column', 'assets/Tuberia.webp');
    this.load.image('pikachu', 'assets/Pikachu.webp');
    this.load.image('topColumn', 'assets/TopTuberia.webp');
}

let hasLanded = false;
let hasBumped = false;
let isGameStarted = false;
let messageToPlayer;
let messageToPlayer2;
let intructions;
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
let description;
let controls;
let bestScoremessage

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

function create() {
    background = this.add.tileSprite(0, 0, 1920, 1000, 'background').setOrigin(0, 0);
    const roads = this.physics.add.staticGroup();
    const road = roads.create(500, 860, 'road').setScale(2).refreshBody();
    road.displayWidth = 2700; 
    road.displayHeight = 190;
  
    topColumns = this.physics.add.group({
        key: 'topColumn',
        repeat: 499,
        setXY: { x: 1200, y: 0, stepX: 300 }
    });
  
    bottomColumns = this.physics.add.group({
        key: 'column',
        repeat: 499,
        setXY: { x: 1200, y: 690, stepX: 300 }
    });
  
    topColumns.children.iterate(function (column) {
        column.displayWidth = 100;
        column.displayHeight = Phaser.Math.Between(150, 430);  
        column.setImmovable(true);
        column.setGravityY(0);
        column.setVelocityX(-speed);
        column.body.allowGravity = false;
        column.body.velocity.y = 0;
    });
  
    bottomColumns.children.iterate(function (column) {
        column.displayWidth = 100;
        column.displayHeight = Phaser.Math.Between(150, 430);  
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
    messageToPlayer = this.add.text(530 + 750 / 3.5, 100, 'Flying Pikachu!', {
        font: 'bold 32px Arial',
        fill: '#ffffff',
    });
  
     controls = this.add.text(520, 300, '- Controls: ', {
        font: 'bold 32px Arial',
        fill: '#ffffff',
    });
    intructions = this.add.text(520, 400, '- Press W to fly', {
        font: 'bold 32px Arial',
        fill: '#ffffff',
    });
     description = this.add.text(520, 200, 'Help Pikachu pass through the 500 pipes!', {
        font: 'bold 32px Arial',
        fill: '#ffffff',
    });
    messageToPlayer2 = this.add.text(500 + 750 / 3.5, 500, 'Press space to start', {
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

    this.restartGame = function () {
        score = 0;
        scoreMessage.setText('Score: ' + score);
        bestScore = localStorage.getItem('bestScore');
        if(!bestScore){
            localStorage.getItem('bestScore',0);
            bestScore = 0;
        }
        bestScoremessage.setText('Best Score: ' + bestScore);
        isGameStarted = false;
        hasLanded = false;
        hasBumped = false;
        gameOver = false;
        speed = 50;

        pikachu.setVelocity(0, 0);
        pikachu.setPosition(100, 200);

        this.restartMessage.setVisible(false);
        backgroundMessage.setVisible(true);
        messageToPlayer.setVisible(true);
        messageToPlayer2.setVisible(true);
        description.setVisible(true);
        controls.setVisible(true);
        intructions.setVisible(true);
        scoreMessage.setVisible(false);

        topColumns.clear(true, true);
        bottomColumns.clear(true, true);

        topColumns = this.physics.add.group({
            key: 'topColumn',
            repeat: 499,
            setXY: { x: 1200, y: 0, stepX: 300 }
        });

        bottomColumns = this.physics.add.group({
            key: 'column',
            repeat: 499,
            setXY: { x: 1200, y: 690, stepX: 300 }
        });

        topColumns.children.iterate(function (column) {
            column.displayWidth = 100;
            column.displayHeight = Phaser.Math.Between(150, 430);
            column.setImmovable(true);
            column.setGravityY(0);
            column.setVelocityX(-speed);
            column.body.allowGravity = false;
        });

        bottomColumns.children.iterate(function (column) {
            column.displayWidth = 100;
            column.displayHeight = Phaser.Math.Between(150, 430);
            column.setImmovable(true);
            column.setGravityY(0);
            column.setVelocityX(-speed);
            column.body.allowGravity = false;
        });

        background.tilePositionX = 0;

        this.physics.add.collider(pikachu, topColumns, (pikachu, column) => hitColumn.call(this, pikachu, column));
        this.physics.add.collider(pikachu, bottomColumns, (pikachu, column) => hitColumn.call(this, pikachu, column));
    }.bind(this); 
}



function update() {
    const maxX = config.width / 3;

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
        description.setVisible(false);
        controls.setVisible(false);
        intructions.setVisible(false);
        scoreMessage.setVisible(true);
    }

    if (isGameStarted) {
        topColumns.children.iterate(function (column) {
            if (column.x < pikachu.x && !column.passed) {
                column.passed = true;  
                score += 1; 
                scoreMessage.setText('Score: ' + score);
            }
        }, this);
    }

    if (!isGameStarted || gameOver) {
        if(!isGameStarted){
            pikachu.setVelocityY(-160);
        }
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
                this.restartGame();
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

    if (!hasLanded && !hasBumped && isGameStarted) {
        pikachu.body.velocity.x = 50;
    } else{
        pikachu.body.velocity.x = 0;
        background.tilePositionX = 0;
        if(score > bestScore){
            localStorage.setItem('bestScore',score)
        }
        localStorage.getItem('bestScore',bestScore)
        if (cursors.space.isDown) {
            this.restartGame();
            gameOver = false;
        }
    }
    if (score % 10 === 0) {
        speed += 1.5;  
    }
    if (score == 500) {
        this.restartMessage.setText('You win! Press space to restart');
        gameOver = true;
    pikachu.setVelocity(0, 0);
    bottomColumns.children.iterate(function (column) {
        column.setVelocityX(0);
    });
    topColumns.children.iterate(function (column) {
        column.setVelocityX(0);
    });
    this.add.text(400, 300, 'Game Over! Score: ' + score, {
        font: 'bold 32px Arial',
        fill: '#ffffff'
    }).setOrigin(0.5);
    gameOver = true;
    }
}