const ROBOT_RADIUS = 25;
const FAST_COLOR = "#4444ff";
const SLOW_COLOR = "#8888ff";
const FAST_SPEED = 5;
const SLOW_SPEED = 2;

// Modify this to change the behavior of the robots
const STEPS = [
    {
        positions: {
            fast: {x: 0, y: 0},
            slow1: {x: 50, y: 0},
            slow2: {x: 100, y: 0}
        },
        label: "Step 1\nline 2"
    }, {
        positions: {
            fast: {x: 30, y: 30},
            slow1: {x: 80, y: 90},
            slow2: {x: 20, y: 20}
        },
        label: "Step 2"
    }
];

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "field.png";

const robotPositions = JSON.parse(JSON.stringify(STEPS[0].positions));

let step = 0;

function getRobotTargets() {
    return STEPS[step].positions;
}

function getLabelText() {
    return STEPS[step].label;
}

function mainloop() {
    if (!img.complete) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let robotTargetPositions = getRobotTargets();
    let labelText = getLabelText();
    for (let robot of ["fast", "slow1", "slow2"]) {
        let isFast = robot === "fast";
        let dx = robotTargetPositions[robot].x - robotPositions[robot].x;
        let dy = robotTargetPositions[robot].y - robotPositions[robot].y;
        let distance = (dx ** 2 + dy ** 2) ** 0.5;
        let speed = isFast ? FAST_SPEED : SLOW_SPEED;
        if (distance < speed) {
            robotPositions[robot].x = robotTargetPositions[robot].x;
            robotPositions[robot].y = robotTargetPositions[robot].y;
        } else {
            robotPositions[robot].x += dx / distance * speed;
            robotPositions[robot].y += dy / distance * speed;
        }
        ctx.fillStyle = isFast ? FAST_COLOR : SLOW_COLOR;
        ctx.beginPath();
        ctx.ellipse(robotPositions[robot].x, robotPositions[robot].y, ROBOT_RADIUS, ROBOT_RADIUS, 0, 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.font = "30px Courier New";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    let lines = labelText.split("\n");
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], canvas.width / 2, 30 * i);
    }
    ctx.fillStyle = "#444444";
    for (let isRight of [false, true]) {
        const c = x => isRight ? canvas.width - x : x;
        ctx.beginPath();
        ctx.moveTo(c(50), 50);
        ctx.lineTo(c(100), 25);
        ctx.lineTo(c(100), 75);
        ctx.closePath();
        ctx.fill();
    }
}

canvas.addEventListener("click", e => {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (Math.abs(y - 50) < 25) {
        if (Math.abs(x - 75) < 25) step--;
        if (Math.abs(x - (canvas.width - 75)) < 25) step++;
        step = (step + STEPS.length) % STEPS.length;
    } else {
        console.table({x, y});
    }
});

setInterval(mainloop, 1);