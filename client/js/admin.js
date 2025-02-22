// eslint-disable-next-line no-undef
const socket = io('http://localhost:8180');
let gameRunning = false;
const engegerButton = document.querySelector('#engegar');

socket.emit('join', 'admin');

const width = document.getElementById('width');
const height = document.getElementById('height');
const pisos = document.getElementById('pisos');
const svg = document.getElementById('gameMap');
const area2 = document.getElementById('area2');

// Configurar mapa
document.querySelector('#configurar').addEventListener('click', (event) => {
  const settings = {
    width: parseInt(width.value),
    height: parseInt(height.value),
    pisos: parseInt(pisos.value)
  };
  socket.emit('inicializeMap', settings);
});

// Iniciar/Parar juego
engegerButton.addEventListener('click', (event) => {
  if (!gameRunning) {
    socket.emit('iniciar');
    engegerButton.textContent = 'Parar';
    engegerButton.classList.add('stopping');
    gameRunning = true;
  } else {
    socket.emit('stopGame');
    engegerButton.textContent = 'Engegar';
    engegerButton.classList.remove('stopping');
    gameRunning = false;
  }
});

// Recibir y mostrar ladrillos
socket.on('bricks', (bricks) => {
  const stonesGroup = document.getElementById('stones');

  const existingBricks = new Map();
  stonesGroup.childNodes.forEach((child) => {
    if (child.id) existingBricks.set(child.id, child);
  });

  bricks.forEach((brick) => {
    const brickElement = existingBricks.get(brick.id);

    if (!brickElement) {
      const brickElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      brickElement.setAttributeNS(null, 'href', '../assets/mapElements/ladrillo.png');
      brickElement.setAttributeNS(null, 'x', brick.x);
      brickElement.setAttributeNS(null, 'y', brick.y);
      brickElement.setAttributeNS(null, 'width', '20');
      brickElement.setAttributeNS(null, 'height', '20');
      stonesGroup.appendChild(brickElement);
    }
  });
});

socket.on('mapUpdated', (map) => {
  svg.setAttribute('width', map.width);
  svg.setAttribute('height', map.height);
  svg.setAttribute('viewBox', `0 0 ${map.width} ${map.height}`);
  area2.setAttribute('x', map.width - 90);
  area2.setAttribute('y', map.height - 90);
});

const currentPlayers = [];
socket.on('drawPlayers', (players) => {
  currentPlayers.push(...players);
  drawPlayers(players);
});

function drawPlayers (players) {
  const playersGroup = document.getElementById('players');

  const existingPlayers = new Map();
  playersGroup.childNodes.forEach((child) => {
    if (child.id) existingPlayers.set(child.id, child);
  });

  players.forEach((player) => {
    let playerElement = existingPlayers.get(player.id);
    const teamColor = player.team === 'blue' ? '../assets/img/fotoPlayer.png' : '../assets/img/fotoPlayer2.png';

    if (!playerElement) {
      playerElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      playerElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', teamColor);
      playerElement.setAttributeNS(null, 'id', player.id);
      playerElement.setAttributeNS(null, 'width', '40');
      playerElement.setAttributeNS(null, 'height', '40');
      playersGroup.appendChild(playerElement);
    }

    playerElement.setAttributeNS(null, 'x', player.position.x);
    playerElement.setAttributeNS(null, 'y', player.position.y);

    existingPlayers.delete(player.id);
  });

  existingPlayers.forEach((playerElement) => {
    playersGroup.removeChild(playerElement);
  });
}
