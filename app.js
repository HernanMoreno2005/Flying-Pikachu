let config = {
  renderer: Phaser.AUTO,
  width: 1920,
  height: 1000,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: true
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
let backgroundMessage;
let speed = 50;  

function create() {
  background = this.add.tileSprite(0, 0, 1920, 1000, 'background').setOrigin(0, 0);

  const roads = this.physics.add.staticGroup();
  const road = roads.create(500, 860, 'road').setScale(2).refreshBody();
  road.displayWidth = 2700; 
  road.displayHeight = 150;

  topColumns = this.physics.add.group({
      key: 'column',
      repeat: 1,
      setXY: { x: 1200, y: 100, stepX: 300 }
  });

  topColumns.children.iterate(function (column) {
      column.displayWidth = 100;
      column.displayHeight = 200;
      column.setImmovable(true);  
      column.setGravityY(0);     
      column.setVelocityX(-speed); 
      column.body.allowGravity = false; 
      column.body.velocity.y = 0; 
  });


  bottomColumns = this.physics.add.group({
      key: 'column',
      repeat: 1,
      setXY: { x: 1200, y: 690, stepX: 300 }
  });

  bottomColumns.children.iterate(function (column) {
      column.displayWidth = 100;
      column.displayHeight = 200;
      column.setImmovable(true);  
      column.setGravityY(0);     
      column.setVelocityX(-speed); 
      column.body.allowGravity = false; 
      column.body.velocity.y = 0; 
  });

  
  pikachu = this.physics.add.sprite(100, 200, 'pikachu').setScale(2);
  pikachu.setBounce(0.2);
  pikachu.setCollideWorldBounds(true);

  this.physics.add.collider(pikachu, road);
  this.physics.add.collider(pikachu, topColumns);
  this.physics.add.collider(pikachu, bottomColumns);

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


  
 
}

function update() {
  if (this.wKey.isDown && !hasLanded) {
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

 
  if (cursors.space.isDown && !isGameStarted) {
      isGameStarted = true;
      messageToPlayer.setVisible(false);
      backgroundMessage.setVisible(false);
      messageToPlayer2.setVisible(false);
  }

  if (isGameStarted) {
    
      background.tilePositionX += speed;  


      topColumns.children.iterate(function (column) {
          if (column.x < -column.displayWidth) {
              column.x = 1920;  
          }
      });

      bottomColumns.children.iterate(function (column) {
          if (column.x < -column.displayWidth) {
              column.x = 1920; 
          }
      });
  }

  if (!hasLanded && !hasBumped) {
      pikachu.body.velocity.x = 50;
  } else {
      pikachu.body.velocity.x = 0;
      background.tilePositionX = 0;
  }

  if (!isGameStarted) {
      pikachu.setVelocityY(-160);
      pikachu.setVelocityX(0);
  }
 
}
