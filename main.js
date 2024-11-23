var config = {
    type: Phaser.Auto,
    width: 800,
    height: 600,
    physics:{
        default: "arcade",
        arcade:{
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
    canFire = true;
    asteroidSpeed = 80;

    player.body.collideWorldBounds = true;
    gameEnd = false;

    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    Space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    setInterval(()=>{
        addAsteroids(this);
    },1000);

    this.physics.add.collider(player,asteroidsGroup,(player,asteroid)=>{
        asteroid.destroy();
        explosion = this.add.image(asteroid.x,asteroid.y,"explosion").setScale(0.07,0.07);
        this.time.delayedCall(1000,()=>{
            explosion.destroy();
        })
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
        if(Space.isDown && canFire){
            addBullet(this,player);
            canFire = false;
            this.time.delayedCall(200,()=>{canFire = true});
        }
    }else{
            gameEnd = true;
            this.add.image(player.x,player.y,"explosion").setScale(0.3,0.3);
            player.destroy();
    }

    asteroidsGroup.getChildren().forEach((asteroid) => {
        if(asteroid.x < -50 || asteroid.x > config.width + 50 || asteroid.y < -50 || asteroid.y > config.height + 50){
            asteroid.destroy();
        }
    })
}

function addAsteroids(scene){
    spawnPlace = Phaser.Math.Between(0,3);
    if(spawnPlace == 0){
        asteroid = scene.physics.add.sprite(Phaser.Math.Between(0,config.width),-10,"asteroid").setScale(0.07,0.07);
        asteroid.setVelocityY(asteroidSpeed);
    }else if(spawnPlace == 1){
        asteroid = scene.physics.add.sprite(-10,Phaser.Math.Between(0,config.height),"asteroid").setScale(0.07,0.07);
        asteroid.setVelocityX(asteroidSpeed);
    }else if(spawnPlace == 2){
        asteroid = scene.physics.add.sprite(config.width + 10,Phaser.Math.Between(0,config.height),"asteroid").setScale(0.07,0.07);
        asteroid.setVelocityX(-asteroidSpeed);
    }else if(spawnPlace == 3){
        asteroid = scene.physics.add.sprite(Phaser.Math.Between(0,config.width),config.height + 10,"asteroid").setScale(0.07,0.07);
        asteroid.setVelocityY(-asteroidSpeed);
    }
    asteroid.body.setBounce(1);
    asteroidsGroup.add(asteroid);
}

function addBullet(scene,player){
    spaceshipAngle = Phaser.Math.DegToRad(player.angle)
    spaceshipHeight = player.displayHeight;
    spaceshipWidth = player.displayWidth;

    bulletOffsetX = Math.cos(spaceshipAngle)*(spaceshipHeight/2);
    bulletOffsetY = Math.sin(spaceshipAngle)*(spaceshipWidth/2);
    
    bullet = scene.physics.add.sprite(player.x + bulletOffsetX,player.y + bulletOffsetY,"bullet").setScale(0.2,0.2);
    //debug(scene);
    bullet.body.setSize(50,50);
    bullet.body.setOffset(300,300);
    bullet.rotation = player.rotation;
    bullet.setVelocity(Math.cos(player.rotation)*400,Math.sin(player.rotation)*400);
    
    scene.physics.add.collider(bullet,asteroidsGroup,(bullet,asteroid)=>{
        explosion = scene.add.image(asteroid.x,asteroid.y,"explosion").setScale(0.1,0.1);
        bullet.destroy();
        asteroid.destroy();
        scene.time.delayedCall(100,()=>{
            explosion.destroy();
        })
    })
}

function debug(scene){
    scene.physics.world.createDebugGraphic();
}
