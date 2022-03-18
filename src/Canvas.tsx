import React, { useState } from 'react';
import sprite from './maleWarriorSprite.png';

const SCALE = 3;
const WIDTH = 16;
const HEIGHT = 18;
const SCALED_WIDTH = SCALE * WIDTH;
const SCALED_HEIGHT = SCALE * HEIGHT;
const FRAME_LIMIT = 12;

enum Directions {
    FACING_UP = 0,
    FACING_RIGHT = 1,
    FACING_DOWN = 2,
    FACING_LEFT = 3,    
}

const MOVEMENT_SPEED = 2;
const CYCLE_LOOP = [0, 1, 0, 2];

let currentDirection = Directions.FACING_DOWN;
let currentLoopIndex = 0;
let frameCount = 0;
let positionX = 0;
let positionY = 0;
let img = new Image();

let keyPresses: {
    [key: string]: boolean
} = {};

window.addEventListener('keydown', keyDownListener, false);
function keyDownListener(event: any) {
    keyPresses[event.key] = true;
}

window.addEventListener('keyup', keyUpListener, false);
function keyUpListener(event: any) {
    keyPresses[event.key] = false;
}

function Canvas() {
    const [imageLoaded, setImageLoaded] = useState(false);

    function loadImage() {
        img.src = sprite;
        img.onload = function() {
            setImageLoaded(true);
            window.requestAnimationFrame(gameLoop);
        };
    }

    loadImage();

    let canvas;
    let ctx: CanvasRenderingContext2D | null;

    if (imageLoaded) {
        canvas = document.querySelector('canvas');
        ctx = canvas && canvas.getContext('2d');
    }

    type drawFrameType = (fx: number, fy: number, cx: number, cy: number) => void;
    const drawFrame: drawFrameType = function(frameX, frameY, canvasX, canvasY) {
        ctx && ctx.drawImage(
            img,
            frameX * WIDTH,
            frameY * HEIGHT,
            WIDTH,
            HEIGHT,
            canvasX,
            canvasY,
            SCALED_WIDTH,
            SCALED_HEIGHT
        );
    }
    
    const canvasWidth: number = (canvas && canvas.width) || 0;
    const canvasHeight: number = (canvas && canvas.height) || 0;
    function gameLoop() {
        ctx && ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      
        let hasMoved = false;
      
        // Separate IFs between W/S and A/D to move character diagonally
        if (keyPresses.w) {
            moveCharacter(0, -MOVEMENT_SPEED, Directions.FACING_UP);
            hasMoved = true;
        } else if (keyPresses.s) {
            moveCharacter(0, MOVEMENT_SPEED, Directions.FACING_DOWN);
            hasMoved = true;
        } else if (keyPresses.a) {
            moveCharacter(-MOVEMENT_SPEED, 0, Directions.FACING_LEFT);
            hasMoved = true;
        } else if (keyPresses.d) {
            moveCharacter(MOVEMENT_SPEED, 0, Directions.FACING_RIGHT);
            hasMoved = true;
        }
      
        if (hasMoved) {
            frameCount++;
            if (frameCount >= FRAME_LIMIT) {
                frameCount = 0;
                currentLoopIndex++;
                if (currentLoopIndex >= CYCLE_LOOP.length) {
                    currentLoopIndex = 0;
                }
            }
        }
      
        if (!hasMoved) {
            currentLoopIndex = 0;
        }
        drawFrame(CYCLE_LOOP[currentLoopIndex], currentDirection, positionX, positionY);
        window.requestAnimationFrame(gameLoop);
    }

    function moveCharacter(
        deltaX: number,
        deltaY: number,
        direction: Directions
    ): void {
        if (positionX + deltaX > 0 && positionX + SCALED_WIDTH + deltaX < canvasWidth) {
            positionX += deltaX;
        }
        if (positionY + deltaY > 0 && positionY + SCALED_HEIGHT + deltaY < canvasHeight) {
            positionY += deltaY;
        }
        currentDirection = direction;
    }
    

    return (<canvas
            width="900"
            height="600"
        />);
}

export default Canvas;