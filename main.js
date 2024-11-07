var config = {
    type: Phaser.Auto,
    width: 800,
    height: 600,
    physics:{
        default: 'arcade',
        arcade:{
            //gravity:{y: 5},
            debug:false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload(){
    this.load.image('space','assets/space.jpg');
    this.load.image('spaceship','assets/spaceship.png');
    this.load.image('asteroid','assets/asteroid.png');
    this.load.image('explosion','assets/explosion.png');
    this.load.image('bullet','assets/bullet.png');
}

function create(){
    this.add.image(config.width/2,config.height/2,'space');
    player = this.physics.add.sprite(config.width/2,config.height-100,'spaceship').setScale(0.15,0.15);
}

function update(){
    document.addEventListener('keydown',function(e){
        if(e.key == 'a' || e.key == "ArrowLeft"){
            player.body.angularVelocity = -100;
        }else if(e.key == 'd' || e.key == "ArrowRight"){
            player.body.angularVelocity = 100;
        }else{
            player.body.angularVelocity = 0;
        }
        if(e.key == 'w' || e.key == 'ArrowUp'){
            player.setVelocity(Math.cos(player.rotation)*100,Math.sin(player.rotation)*100);
        }else{
            player.setAcceleration(0);
        }
    })
}