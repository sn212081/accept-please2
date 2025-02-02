let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  // A utility to get the position of the touch or mouse event
  getClientPosition(e) {
    if (e.touches) { // Touch event
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else { // Mouse event
      return { x: e.clientX, y: e.clientY };
    }
  }

  init(paper) {
    // Mouse and touchmove events
    const moveHandler = (e) => {
      if (!this.rotating) {
        const position = this.getClientPosition(e);
        this.mouseX = position.x;
        this.mouseY = position.y;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = this.mouseX - this.mouseTouchX;
      const dirY = this.mouseY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Mouse and touchstart events
    const startHandler = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      const position = this.getClientPosition(e);
      this.mouseTouchX = position.x;
      this.mouseTouchY = position.y;
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      if (e.type === 'mousedown' && e.button === 2) {
        this.rotating = true;
      }
    };

    // Mouse and touchend events
    const endHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    // Mouse events
    paper.addEventListener('mousedown', startHandler);
    window.addEventListener('mouseup', endHandler);
    document.addEventListener('mousemove', moveHandler);

    // Touch events
    paper.addEventListener('touchstart', (e) => {
      e.preventDefault(); // Prevent touch scrolling
      startHandler(e);
    });
    window.addEventListener('touchend', (e) => {
      endHandler();
    });
    document.addEventListener('touchmove', (e) => {
      moveHandler(e);
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
