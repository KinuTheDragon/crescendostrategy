const ROBOT_RADIUS = 25;
const FAST_COLOR = "#ff4444";
const SLOW_COLOR = "#ff8888";
const TRAIL_COLOR = "#008800";
const TRAIL_MARK_SIZE = 10;
const FAST_SPEED = 10;
const SLOW_SPEED = 5;

// Modify this to change the behavior of the robots
const STEPS = [
    {
        positions: {
            fast: {x: 639, y: 445},
            slow1: {x: 685, y: 260},
            slow2: {x: 464, y: 220}
        },
        label: "At the end of autonomous\n(robot positions are arbitrary)"
    }, {
        positions: {
            fast: {x: 75, y: 500},
            slow1: {x: 725, y: 203},
            slow2: {x: 639, y: 203}
        },
        label: "Amping first cycle"
    }, {
        positions: {
            fast: {x: 681, y: 196},
            slow1: {x: 55, y: 429},
            slow2: {x: 139, y: 472}
        },
        label: "Coopertition amp cycle"
    }, {
        positions: {
            fast: {x: 98, y: 458},
            slow1: {x: 683, y: 260},
            slow2: {x: 718, y: 358}
        },
        label: "Amplification period starts"
    }, {
        positions: {
            fast: {x: 687, y: 294},
            slow1: {x: 55, y: 429},
            slow2: {x: 139, y: 472}
        },
        label: "Amplification period ends"
    }, {
        positions: {
            fast: {x: 75, y: 500},
            slow1: {x: 725, y: 203},
            slow2: {x: 639, y: 203}
        },
        label: "Amping second cycle"
    }, {
        positions: {
            fast: {x: 687, y: 294},
            slow1: {x: 55, y: 429},
            slow2: {x: 139, y: 472}
        },
        label: "Amplification period starts"
    }, {
        positions: {
            fast: {x: 98, y: 458},
            slow1: {x: 683, y: 260},
            slow2: {x: 718, y: 358}
        },
        label: "Amplification period ends"
    }, {
        positions: {
            fast: {x: 681, y: 196},
            slow1: {x: 55, y: 429},
            slow2: {x: 139, y: 472}
        },
        label: "Amping third cycle\n(First note)"
    }, {
        positions: {
            fast: {x: 81, y: 470},
            slow1: {x: 681, y: 196},
            slow2: {x: 685, y: 292}
        },
        label: "Amping third cycle\n(Second note - score\nfirst amped note)"
    }, {
        positions: {
            fast: {x: 685, y: 292},
            slow1: {x: 378, y: 345},
            slow2: {x: 507, y: 477}
        },
        label: "Score second amped note\n(Potential pick up third)"
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
        ctx.strokeStyle = TRAIL_COLOR;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(robotPositions[robot].x, robotPositions[robot].y);
        ctx.lineTo(robotTargetPositions[robot].x, robotTargetPositions[robot].y);
        ctx.stroke();
        for (let i of [-1, 1]) {
            ctx.beginPath();
            ctx.moveTo(robotTargetPositions[robot].x - TRAIL_MARK_SIZE / 2 * i, robotTargetPositions[robot].y - TRAIL_MARK_SIZE / 2);
            ctx.lineTo(robotTargetPositions[robot].x + TRAIL_MARK_SIZE / 2 * i, robotTargetPositions[robot].y + TRAIL_MARK_SIZE / 2);
            ctx.stroke();
        }
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
        if (step === 0 && !isRight) continue;
        if (step === STEPS.length - 1 && isRight) continue;
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
        step = Math.min(Math.max(step, 0), STEPS.length - 1);
    } else {
        console.table({x, y});
    }
});

setInterval(mainloop, 1);