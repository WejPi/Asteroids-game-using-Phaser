var config = {
    type: Phaser.Auto,
    width: 800,
    height: 600,
    physics:{
        default: "arcade",
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
    this.load.image("space","assets/space.jpg");
    this.load.image("spaceship","assets/spaceship.png");
    this.load.image("asteroid","assets/asteroid.png");
    this.load.image("explosion","assets/explosion.png");
    this.load.image("bullet","assets/bullet.png");
}



function create(){
    this.add.image(config.width/2,config.height/2,"space");
    player = this.physics.add.sprite(config.width/2,config.height-100,"spaceship").setScale(0.15,0.15);
    asteroidsGroup = this.add.group();

    player.body.collideWorldBounds = true;
    gameEnd = false;

    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    Space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    for(let i=0;i<5;i++){
        asteroid = this.physics.add.sprite(Phaser.Math.Between(0,config.width),Phaser.Math.Between(0,config.height),"asteroid").setScale(0.07,0.07)
        asteroid.body.collideWorldBounds = true;
        asteroidsGroup.add(asteroid);
    }

    this.physics.add.collider(player,asteroidsGroup,function(){
        gameEnd = true;
    })
    this.physics.add.collider(asteroidsGroup,asteroidsGroup)

    this.cursors = this.input.keyboard.createCursorKeys();
}



function update(){
    if(gameEnd == false){
        if(this.cursors.left.isDown || keyA.isDown){
            player.body.angularVelocity = -100;
        }else if(this.cursors.right.isDown || keyD.isDown){
            player.body.angularVelocity = 100;
        }else{
            player.body.angularVelocity = 0;
        }
        if(this.cursors.up.isDown || keyW.isDown){
            player.setVelocity(Math.cos(player.rotation)*100,Math.sin(player.rotation)*100);
        }else{
            player.setAcceleration(0);
        }
        if(Space.isDown){
            console.log("Pew!");
        }
    }else{
            gameEnd = true;
            this.add.image(player.x,player.y,"explosion").setScale(0.3,0.3);
            player.destroy();
    }
}
