import "./style.css"
import Phaser from "phaser"

const canvas = document.querySelector(".canvas")

const sizes = {
  width: 600,
  height: 300
}

class GameScene extends Phaser.Scene {
  constructor() {
    super()

    // Player
    this.player = null
    this.playerStarting = {
      x: sizes.width / 2 - 30,
      y: sizes.height / 2
    }
    this.playerRotation = 0
    this.playerSpeed = 110
    this.playerKickPower = 200

    // Keys
    this.keyA = null
    this.keyD = null
    this.keyW = null
    this.keyS = null

    // Ball
    this.ball = null
    this.ballStarting = {
      x: sizes.width / 2,
      y: sizes.height / 2
    }

    // Goal
    this.goal = null
    this.goalZone = null

    // Score
    this.scoreText = null
    this.score = 0

    // Timings
    this.lastBallKick = null

    // NPCS
    this.goalkeeper = null
    this.goalkeeperStarting = {
      x: sizes.width - 30,
      y: sizes.height / 2
    }
  }

  preload() {
    this.load.audio("kick", "/assets/kick.mp3")
    this.load.image("player", "/assets/player.png")
    this.load.image("goalkeeper", "/assets/goalkeeper.png")
    this.load.image("soccerball", "/assets/ball_soccer.png")
    this.load.image("goal", "/assets/goal.png")
  }

  create() {
    // Keys
    this.keyA = this.input.keyboard.addKey("A")
    this.keyD = this.input.keyboard.addKey("D")
    this.keyW = this.input.keyboard.addKey("W")
    this.keyS = this.input.keyboard.addKey("S")

    // Ball
    this.ball = this.physics.add.image(this.ballStarting.x, this.ballStarting.y, "soccerball").setOrigin(0.5, 0.5)
    this.ball.setCollideWorldBounds()
    this.ball.setDrag(50)
    this.ball.setBounce(1)

    // Player
    this.player = this.physics.add.image(this.playerStarting.x, this.playerStarting.y, "player").setOrigin(0.5, 0.5)
    this.player.setCollideWorldBounds()
    this.player.setImmovable(false)

    // Goal
    this.goal = this.add.image(sizes.width, sizes.height / 2, "goal").setOrigin(0, 0.5).setAngle(180)
    this.goalZone = this.add.zone(this.goal.x, this.goal.y, 5, this.goal.height).setOrigin(1, 0.5)
    this.physics.world.enable(this.goalZone, Phaser.Physics.Arcade.STATIC_BODY)

    // NPCS
    this.goalkeeper = this.physics.add.image(this.goalkeeperStarting.x, this.goalkeeperStarting.y, "goalkeeper").setOrigin(0.5, 0.5).setAngle(180)
    this.goalkeeper.setImmovable()

    // Collision
    this.physics.add.collider(this.player, this.ball, this.handleBallKick, null, this)
    this.physics.add.collider(this.goalkeeper, this.ball, this.handleBallDefence, null, this)
    this.physics.add.collider(this.player, this.goalkeeper, this.disableMovement, null, this)
    this.physics.add.overlap(this.ball, this.goalZone, this.handleGoalScored, null, this)

    // UI
    this.scoreText = this.add.text(sizes.width - 5, 5, `Score: ${this.score}`, {
      fontStyle: "bold",
      fontFamily: "Verdana",
      color: "black",
      fontSize: "20px"
    }).setOrigin(1, 0)
  }

  update() {
    this.calculatePlayerVelocity()
    this.calculatePlayerRotation()
    this.ballSpin()
  }

  calculatePlayerVelocity() {
    this.player.setVelocity(0, 0)

    if (this.keyA.isDown && this.keyD.isDown) {
      this.player.setVelocity(0, 0)
    } else if (this.keyA.isDown) {
      this.player.setVelocityX(-this.playerSpeed)
    } else if (this.keyD.isDown) {
      this.player.setVelocityX(this.playerSpeed)
    }

    if (this.keyW.isDown && this.keyS.isDown) {
      this.player.setVelocity(0, 0)
    } else if (this.keyS.isDown) {
      this.player.setVelocityY(this.playerSpeed)
    } else if (this.keyW.isDown) {
      this.player.setVelocityY(-this.playerSpeed)
    }
  }

  calculatePlayerRotation() {
    if (this.keyW.isDown && this.keyA.isDown) {
      this.playerRotation = -135
    } else if (this.keyW.isDown && this.keyD.isDown) {
      this.playerRotation = -45
    } else if (this.keyS.isDown && this.keyA.isDown) {
      this.playerRotation = 135
    } else if (this.keyS.isDown && this.keyD.isDown) {
      this.playerRotation = 45
    } else if (this.keyW.isDown) {
      this.playerRotation = -90
    } else if (this.keyS.isDown) {
      this.playerRotation = 90
    } else if (this.keyA.isDown) {
      this.playerRotation = 180
    } else if (this.keyD.isDown) {
      this.playerRotation = 0
    }

    this.player.setAngle(this.playerRotation)
  }

  handleBallKick() {
    const playerAngleRad = Phaser.Math.DegToRad(this.player.angle)

    const kickX = Math.cos(playerAngleRad) * this.playerKickPower
    const kickY = Math.sin(playerAngleRad) * this.playerKickPower

    this.ball.setVelocity(kickX, kickY)

    if (!this.lastBallKick) {
      this.sound.play("kick")
      this.lastBallKick = this.time.now
    } else if (this.time.now > this.lastBallKick + 200) {
      this.sound.play("kick")
      this.lastBallKick = this.time.now
    }
  }

  handleBallDefence() {
    const goalkeeperAngleRad = Phaser.Math.DegToRad(this.goalkeeper.angle)

    const kickX = Math.cos(goalkeeperAngleRad) * this.playerKickPower / 2
    const kickY = Math.sin(goalkeeperAngleRad) * this.playerKickPower / 2

    this.ball.setVelocity(kickX, kickY)

    if (!this.lastBallKick) {
      this.sound.play("kick")
      this.lastBallKick = this.time.now
    } else if (this.time.now > this.lastBallKick + 200) {
      this.sound.play("kick")
      this.lastBallKick = this.time.now
    }
  }

  ballSpin() {
    if (this.ball.body.speed > 0) {
      this.ball.setAngularVelocity(this.ball.body.velocity.x * 2)
    } else {
      this.ball.setAngularVelocity(0)
    }
  }

  handleGoalScored() {
    this.score++
    this.scoreText.setText(`Score: ${this.score}`)
    this.player.setPosition(this.playerStarting.x, this.playerStarting.y)
    this.playerRotation = 0
    this.ball.setPosition(this.ballStarting.x, this.ballStarting.y)
    this.ball.setVelocity(0, 0)
  }

  disableMovement() {
    this.player.setVelocity(0, 0)
  }
}

const game = new Phaser.Game({
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: canvas,
  physics: {
    default: "arcade",
    arcade: {},
  },
  scene: [GameScene],
  backgroundColor: "#2DCC71"
})