// Declaração das variáveis para imagens e sprites
var towerImg, tower;
var doorImg, door, doorsGroup;
var climberImg, climber, climbersGroup;
var ghost, ghostImg;
var invisibleBlockGroup, invisibleBlock;
var gameState = "play"; // Estado inicial do jogo

function preload() {
    // Pré-carrega as imagens e o som necessários para o jogo
    towerImg = loadImage("tower.png");
    doorImg = loadImage("door.png");
    climberImg = loadImage("climber.png");
    ghostImg = loadImage("ghost-standing.png");
    spookySound = loadSound("spooky.wav");
}

function setup() {
    // Configuração inicial do jogo
    createCanvas(600, 600); // Cria um canvas com dimensões 600x600
    spookySound.loop(); // Toca o som em loop
    tower = createSprite(300, 300); // Cria a sprite da torre
    tower.addImage("tower", towerImg); // Adiciona a imagem à sprite
    tower.velocityY = 1; // Define a velocidade de movimento da torre

    doorsGroup = new Group(); // Cria um grupo para as portas
    climbersGroup = new Group(); // Cria um grupo para os escaladores
    invisibleBlockGroup = new Group(); // Cria um grupo para os blocos invisíveis

    ghost = createSprite(200, 200, 50, 50); // Cria a sprite do fantasma
    ghost.scale = 0.3; // Define a escala do fantasma
    ghost.addImage("ghost", ghostImg); // Adiciona a imagem à sprite do fantasma
}

function draw() {
    background(0); // Define o fundo como preto
    if (gameState === "play") { // Verifica se o jogo está em execução
        // Controles do jogador
        if (keyDown("left_arrow")) { // Move o fantasma para a esquerda
            ghost.x = ghost.x - 3;
        }
        if (keyDown("right_arrow")) { // Move o fantasma para a direita
            ghost.x = ghost.x + 3;
        }
        if (keyDown("space")) { // Faz o fantasma pular
            ghost.velocityY = -10;
        }
        ghost.velocityY = ghost.velocityY + 0.8; // Adiciona gravidade ao movimento do fantasma

        // Movimento da torre em loop
        if (tower.y > 400) {
            tower.y = 300;
        }

        spawnDoors(); // Gera as portas

        // Verifica a colisão do fantasma com os escaladores
        if (climbersGroup.isTouching(ghost)) {
            ghost.velocityY = 0;
        }

        // Verifica se o fantasma colidiu com um bloco invisível ou caiu fora da tela
        if (invisibleBlockGroup.isTouching(ghost) || ghost.y > 600) {
            ghost.destroy(); // Destroi o fantasma
            gameState = "end"; // Altera o estado do jogo para "fim de jogo"
        }

        drawSprites(); // Desenha todos os sprites na tela
    }

    if (gameState === "end") { // Verifica se o jogo terminou
        stroke("yellow"); // Define a cor da borda do texto
        fill("yellow"); // Define a cor de preenchimento do texto
        textSize(30); // Define o tamanho do texto
        text("Fim de Jogo", 230, 250); // Exibe "Fim de Jogo" na tela
    }
}

function spawnDoors() {
    // Função para gerar as portas na torre
    if (frameCount % 240 === 0) { // Gera uma porta a cada 240 frames
        // Cria as sprites para a porta, o escalador e o bloco invisível
        var door = createSprite(200, -50);
        var climber = createSprite(200, 10);
        var invisibleBlock = createSprite(200, 15);
        
        // Define as posições aleatórias das portas
        door.x = Math.round(random(120, 400));
        climber.x = door.x;
        invisibleBlock.x = door.x;

        // Adiciona as imagens às sprites da porta e do escalador
        door.addImage(doorImg);
        climber.addImage(climberImg);

        // Define as velocidades das portas, escaladores e blocos invisíveis
        door.velocityY = 1;
        climber.velocityY = 1;
        invisibleBlock.velocityY = 1;

        // Ajusta a profundidade do fantasma em relação às portas
        ghost.depth = door.depth;
        ghost.depth += 1;

        // Define o tempo de vida das portas, escaladores e blocos invisíveis
        door.lifetime = 800;
        climber.lifetime = 800;
        invisibleBlock.lifetime = 800;

        // Adiciona as portas, os escaladores e os blocos invisíveis aos seus respectivos grupos
        doorsGroup.add(door);
        invisibleBlock.debug = true;
        climbersGroup.add(climber);
        invisibleBlockGroup.add(invisibleBlock);
    }
}