const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  playerSides: {
    player: "player-cards",
    playerBox: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBox: document.querySelector("#computer-cards"),
  },
  actions: {
    buttom: document.getElementById("next-duel"),
  },
};

const pathImages = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    WinOf: [1],
    LoseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    WinOf: [2],
    LoseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    WinOf: [0],
    LoseOf: [1],
  },
];

async function drawSelectedCard(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
}

async function removeAllCardsImages() {
  let imgElements = state.playerSides.computerBox.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  imgElements = state.playerSides.playerBox.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "Empate";
  let playerCard = cardData[playerCardId];
  if(playerCard.WinOf.includes(computerCardId)){
    duelResults = "Ganhou";
    state.score.playerScore++;
    await playAudio ("win");
  }

  if(playerCard.LoseOf.includes(computerCardId)){
    duelResults = "Perdeu";
    state.score.computerScore++;
    await playAudio ("lose")
  }

  return duelResults;
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawButton(text) {
  state.actions.buttom.innerText = text;
  state.actions.buttom.style.display = "block";
}

async function setCardsField(cardId) {
  await removeAllCardsImages();
  let computerCardId = await getRandomCardId();
  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";
  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  let duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", IdCard);
  cardImage.classList.add("card");
  if (fieldSide === state.playerSides.player) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectedCard(IdCard);
    });

    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
  }

  return cardImage;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const ramdomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(ramdomIdCard, fieldSide);
    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function resetDuel() {
  state.cardSprites.avatar.src="";
  state.actions.buttom.style.display= "none";
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  init();
  
}

async function playAudio(status) {

  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
  
}

function init() {
  drawCards(5, state.playerSides.player);
  drawCards(5, state.playerSides.computer);

  const bgm = document.getElementById("bgm");
  bgm.play();
}

init();
