import './style.css'
import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 100 },
          debug: false
      }
  },
  audio: {
    disableWebAudio: true
},
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};
let items = []
var score = 0
var scoreText
var livesText
const game = new Phaser.Game(config);
var isDragging = false;
let tazik
var lives = 5; // Initial number of lives
let gameOverText
function preload ()
{
  this.load.audio('backgroundMusic', 'music/music.mp3');

  this.load.image('leha', 'leha/leha-1.png');
  this.load.image('item-2', 'items/item-2.png');
  this.load.image('item-3', 'items/item-3.png')
  this.load.image('item-4', 'items/item-4.png')
  this.load.image('item-9', 'items/item-9.png')
  this.load.image('bg-1', 'bg/bg-1.jpg')
  this.load.image('platform', 'tools/platform.png')
  this.load.image('tazik', 'tools/tool-1.png')
  this.load.image('lost', 'tools/lost-1.png')
  this.load.image('vomit', 'tools/vomit.png')
  this.load.image('heart', 'tools/heart.png')
  this.load.image('barTable', 'tools/BarTable.png')
  this.load.image('hand', 'tools/hand.png')
}

function create ()
{
  var music = this.sound.add('backgroundMusic');
  music.play({
    loop: true
});
let gameOver
  const addToLost = (lost, item)=>{
    item.destroy()
    score = score +1
    scoreText.setText('Счёт: ' + score);
    if (score > 49){
      win()
    }
  }
  const catchVomit = (tazik, vomit) => {
    console.log(tazik)
    vomit.destroy()
  }
  
  const spawnItems = (items)=>{
    let vomit;
    let item;
    let randomAngle
    let randomX =  Phaser.Math.Between(200, 1000)
      let itemType = Phaser.Math.Between(0,5)
      switch(itemType){
        case 0:
          item = this.add.image(randomX,300, 'item-2')
          item.setScale(0.1,0.1)

          break;
        case 1:
          item =  this.add.sprite(randomX,300, 'item-3')
          item.setScale(0.1,0.1)
          break;
        case 2:
          item =  this.add.sprite(randomX,300, 'item-4')
          item.setScale(0.3,0.3)
          break;
        case 3:
          item =  this.add.sprite(randomX,300, 'item-9')
          item.setScale(0.1,0.1)
          break;
        case 4:
          vomit = 'vomit'

          break;
        case 5:
          vomit = 'vomit'
          break;
      }
      if (item){
      item = this.physics.add.existing(item);
      item.setInteractive({draggable:true})
      this.physics.add.overlap(lost, items, addToLost, null, this);

      items.add(item);
      const xVel = Phaser.Math.Between(-250, 250)
      const yVel = Phaser.Math.Between(-400, 0)

      items.setVelocity(xVel,yVel)
      item.on('dragend', ()=>{
      // items.setVelocity(-100,-1100)
      item.onWorldBounds = true;
      item.body.setCollideWorldBounds(true);

      })
      }
      if (vomit){
        vomit = this.physics.add.sprite(600,300, 'vomit')
        randomAngle = Phaser.Math.DegToRad(Phaser.Math.Between(0, 360)); // Random angle between 0 and 360 degrees
        vomit.setAngle(randomAngle);
        // vomit = this.physics.add.existing(vomit);
        vomit.setInteractive({draggable:true})
      
        var velocity = new Phaser.Math.Vector2(300, 0); // Adjust the velocity as needed
    velocity.rotate(randomAngle);
    vomit.setVelocity(velocity.x, velocity.y);
    vomit.body.onWorldBounds = true;

    // Set the world bounds for the 'vomit' group
        vomit.body.setCollideWorldBounds(true);
    this.physics.add.overlap(tazik, vomit, catchVomit, null, this);
      }

      setTimeout(_ => spawnItems(items), Phaser.Math.Between(1500, 3000)); 
    }
    
  let items = this.physics.add.group({draggable:true})
  this.add.image(600, 400, 'bg-1');
  let leha = this.add.image(600,300, 'leha');
  let hand = this.add.image(885,400, 'hand').setScale(0.5);
  let barTable = this.add.image(600,480, 'barTable').setScale(0.7)
  this.physics.add.staticImage(1100,50, 'heart').setScale(0.1)
  leha.setScale(0.3,0.3)
  let platform = this.physics.add.staticSprite(100, 600, 'platform')
  tazik = this.physics.add.sprite(100,525, 'tazik')

  tazik.setScale(0.25)
  tazik.setInteractive();
  this.physics.world.enable(platform);
  this.physics.add.collider(platform, tazik, null, null, this);
  this.input.setDraggable(tazik);  
  this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
    gameObject.x = dragX;
    gameObject.y = dragY;
});

  let lost = this.physics.add.staticImage(1100,510, 'lost')


  tazik.on('dragend', (pointer, gameObject)=>{
    tazik.x = 100
    tazik.y = 525
    isDragging = false
  })
  
  scoreText = this.add.text(16, 16, `Cчёт: ${score}`).setFontSize(30);
  livesText = this.add.text(1150, 25, `${lives}`).setFontSize(60);
  this.input.on('dragstart', function (pointer, gameObject) {
    isDragging = true;
    tazik.on('drag', (point, x,y)=>{
      tazik.x=x
      tazik.y =y
      isDragging = true

    })
}, this);
items.on('dragend', function (point, ddragX, dragY){
  console.log('lalal')
  items.setVelocity(0,0)
  this.physics.world.enable(gameObject.body); // Enable physics when dragging ends
})

this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
  
  gameObject.x = dragX;
  gameObject.y = dragY;

});
this.physics.world.on('worldbounds', function (body) {
  if (body.gameObject instanceof Phaser.GameObjects.Sprite) {
    console.log(body)
      body.gameObject.destroy(); // Destroy the 'vomit' object when it goes out of bounds
      lives--;
      livesText.setText(lives);
      // Check if the number of lives is zero, trigger game over logic
      if (lives === 0) {
          gameOver()
      }
  }
});
gameOver = () => {
  if (score >=50){
    return
  }
  var scene = this;

    // Create a semi-transparent overlay
    var overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7); // Adjust transparency as needed
    overlay.fillRect(0, 0, scene.game.config.width, scene.game.config.height);

    // Display the game over message
    var gameOverText = scene.add.text(scene.game.config.width / 2, scene.game.config.height / 2, 'Game Over\nЛёха лох', {
        fontSize: '32px',
        fill: '#ffffff',
        align: 'center'
    });
    gameOverText.setOrigin(0.5);

    // Set the overlay and game over text as a group
    var gameOverGroup = scene.add.group([overlay, gameOverText]);

    // Disable input on the game over group to prevent interaction with the game underneath

}
const win = () => {
  var scene = this;

    // Create a semi-transparent overlay
    var overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7); // Adjust transparency as needed
    overlay.fillRect(0, 0, scene.game.config.width, scene.game.config.height);

    // Display the game over message
    var gameOverText = scene.add.text(scene.game.config.width / 2, scene.game.config.height / 2, 'Секретный пароль\nЛёха хороший друг', {
        fontSize: '32px',
        fill: '#ffffff',
        align: 'center'
    });
    gameOverText.setOrigin(0.5);

    // Set the overlay and game over text as a group
    var gameOverGroup = scene.add.group([overlay, gameOverText]);

    // Disable input on the game over group to prevent interaction with the game underneath

}
spawnItems(items)

}

function update ()
{ 
  if (!isDragging) {
    // Apply gravity only when not dragging
    tazik.body.setAllowGravity(true);
}
if (isDragging) {
  // Apply gravity only when not dragging
  tazik.body.setAllowGravity(false);
}
}

