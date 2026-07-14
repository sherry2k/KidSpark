export function fireConfetti() {
  // Create confetti elements using DOM
  const colors = ['#ff6b9d', '#c44dff', '#4dc9f6', '#57d467', '#ffd93d', '#ff8c42', '#ff4757'];
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
  document.body.appendChild(container);

  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 6;
    const left = Math.random() * 100;
    const delay = Math.random() * 500;
    const duration = Math.random() * 1500 + 1500;
    const rotation = Math.random() * 360;
    const shapes = ['circle', 'square', 'star'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];

    confetti.style.cssText = `
      position:absolute;
      top:-20px;
      left:${left}%;
      width:${size}px;
      height:${size}px;
      background:${color};
      border-radius:${shape === 'circle' ? '50%' : shape === 'star' ? '0' : '2px'};
      transform:rotate(${rotation}deg);
      animation:confetti-fall ${duration}ms ease-in ${delay}ms forwards;
    `;
    container.appendChild(confetti);
  }

  // Add keyframes
  if (!document.querySelector('#confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
      @keyframes confetti-fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => container.remove(), 3000);
}

export function fireStars() {
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
  document.body.appendChild(container);

  for (let i = 0; i < 20; i++) {
    const star = document.createElement('div');
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const size = Math.random() * 30 + 20;
    const delay = Math.random() * 500;
    star.textContent = '⭐';
    star.style.cssText = `
      position:absolute;
      left:${left}%;
      top:${top}%;
      font-size:${size}px;
      animation:star-pop 1s ease-out ${delay}ms forwards;
      opacity:0;
    `;
    container.appendChild(star);
  }

  if (!document.querySelector('#star-style')) {
    const style = document.createElement('style');
    style.id = 'star-style';
    style.textContent = `
      @keyframes star-pop {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.5); opacity: 1; }
        100% { transform: scale(0); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => container.remove(), 2000);
}
