import './style.css'
import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
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
let leha
let items = []
var score = 0
var scoreText
let item2
const game = new Phaser.Game(config);

function preload ()
{
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
}

function create ()
{
  const addToLost = (lost, item)=>{
    item.destroy()
    score = score +1
    scoreText.setText('Счёт: ' + score);
  }
  const catchVomit = (tazik, vomit) => {
    console.log(tazik)
    vomit.destroy()
  }
  
  const spawnItems = (items)=>{
    let vomit;
    let item;
    let itemsToSpawn = Phaser.Math.Between(0,3)
      // let itemType = Phaser.Math.Between(0,5)
      let itemType = 5
      switch(itemType){
        case 0:
          item = this.add.image(500, 100, 'item-2')
          item.setScale(0.1,0.1)

          break;
        case 1:
          item =  this.add.image(500, 100, 'item-3')
          item.setScale(0.1,0.1)
          break;
        case 2:
          item =  this.add.image(500, 100, 'item-4')
          item.setScale(0.3,0.3)
          break;
        case 3:
          item =  this.add.image(500, 100, 'item-9')
          item.setScale(0.1,0.1)
          break;
        case 4:
          item = this.add.image(500, 100, 'item-1')
          break;
        case 5:
          vomit = this.add.image(500,100, 'vomit')
          break;
      }
      if (item){
        console.log(item)
      item = this.physics.add.existing(item);
      item.setInteractive({draggable:true})
      this.physics.add.overlap(lost, items, addToLost, null, this);

      items.add(item);
      const xVel = Phaser.Math.Between(-100, -200)
      const yVel = Phaser.Math.Between(-100, 200)

      items.setVelocity(xVel,yVel)
      item.on('dragend', ()=>{
      items.setVelocity(-1,-1)
      })
      }
      if (vomit){
        vomit = this.physics.add.existing(vomit);
        vomit.setInteractive({draggable:true})

        this.physics.add.overlap(tazik, vomit, catchVomit, null, this);
        items.add(vomit);
      }

      setTimeout(_ => spawnItems(items), Phaser.Math.Between(3000, 5000)); 
    }
  let items = this.physics.add.group({draggable:true})
  this.add.image(400, 300, 'bg-1');
  let leha = this.add.image(400,300, 'leha');
  leha.setScale(0.3,0.3)
  let platorm = this.add.image(600, 600, 'platform')
  this.add.image(300, 600, 'platform')
  this.add.image(100, 600, 'platform')
  let tazik = this.physics.add.staticImage(100,525, 'tazik')
  tazik.setScale(0.25)
  tazik.setInteractive({draggable:true})
  let lost = this.physics.add.staticImage(700,510, 'lost')


  tazik.on('dragend', (pointer, gameObject)=>{
    tazik.x = 100
    tazik.y = 525
  })
  
  scoreText = this.add.text(16, 16, `Лови ништяки! Cчёт: ${score}`).setFontSize(30);
  this.input.on('dragstart', function (pointer, gameObject) {
    items.on('dragend', function (point, ddragX, dragY){
      console.log('lalal')
      items.setVelocity(0,0)
    })

}, this);


this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
  
  gameObject.x = dragX;
  gameObject.y = dragY;

});
spawnItems(items)

}

function update ()
{ 

}

