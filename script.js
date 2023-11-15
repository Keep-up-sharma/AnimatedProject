function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class DisabledArea {
    constructor(y, x, sizex = 0, sizey = 0, debug = false) {
        this.y = y;
        this.x = x;
        this.sizey = sizey;
        this.sizex = sizex;
        this.debug = debug;
    }

    collision_check(x, y) {
        var points = [[this.x, this.y], [this.x, this.sizex], [this.sizex, this.sizey], [this.x, this.sizey]];
        x = 270 - x;
        if ((y + 3 < this.y + this.sizey) && (y + 20 >= this.y)) {
            if (Math.abs(this.x - 30 - x) < 5) {
                // left of box
                return [false, false, true, false];
            }
            if (Math.abs(x - (this.x + this.sizex)) < 5) {
                // right of box
                return [true, false, false, false];
            }
        }

        if ((x < this.x + this.sizex) && (x + 30 >= this.x)) {
            if (Math.abs(y + 30 - this.y) < 5) {
                // top of box
                return [false, false, false, true];
            }
            if (Math.abs(y - this.y - this.sizey) < 3) {
                // bottom of box
                return [false, true, false, false];
            }
        }

        return [false, false, false, false];
    }
    render(context) {
        context.fillStyle = this.debug ? "#79041299" : "transparent";
        context.fillRect(this.x, this.y, this.sizex, this.sizey);
    }
}

class Pokemon {
    constructor(pokenum = 0) {
        this.pokenum = pokenum;
        this.sprite = new Image();
        this.sprite.src = './Assets/Pokemon/animated/' + pokenum + '.gif';
        let img = document.createElement("img");
        img.src = this.sprite.src;
        img.style = {"position":"absolute","top":"100px","left":"100px"};
        document.getElementById("canvasdiv").appendChild(img);
    }

    collision_check(x, y) {
        // if (Math.abs(x - 100) < 5 && Math.abs(y - 130) < 5) this.house.exitHouse();
        return [false, false, false, false];
    }
    render(context) {
        // context.drawImage(this.sprite, 180, 25, 64, 64);

    }
}

class BattleBackground {
    constructor() {
        this.sprite = new Image();
        this.sprite.src = './Assets/battleBackground.png';
        document.addEventListener('keydown', (key) => { this.handle(key) })
        this.done = false;
    }

    collision_check(x, y) {

        return [false, false, false, false];
    }
    render(context) {
        context.drawImage(this.sprite, 0, 0, 300, 150);
    }

    handle(key) {
        if (key.key === 'Escape' || key.key === 'Enter') {
            document.getElementsByTagName("img")[0].remove();
            if(key.key === 'Enter'&& !this.done){
                setTimeout(()=>window.alert('You caught a pokemon, Sent to lab'),1000);
            }
            game.topLayer = [];
            game.altscreen = false;
        }
    }
}

class HouseBackground {
    constructor(house) {
        this.house = house;
        this.sprite = new Image();
        this.sprite.src = './Assets/inside.jpg';
    }

    collision_check(x, y) {
        if (Math.abs(x - 100) < 5 && Math.abs(y - 130) < 5) this.house.exitHouse();
        return [false, false, false, false];
    }
    render(context) {
        context.drawImage(this.sprite, 0, 0, 300, 150);
    }
}

class Grass {
    constructor(y, x) {
        this.y = y;
        this.x = x;
        this.sprite = new Image();
        this.sprite.src = './Assets/tallGrass.png';
    }

    battle() {
        game.topLayer.push(new BattleBackground());
        game.topLayer.push(new Pokemon(Math.floor(Math.random() * 386)));
        game.altscreen = true;
    }

    collision_check(x, y) {
        if (Math.abs(x - this.x + 20) < 20 & (Math.abs(y - this.y + 15) < 10)) {
            if (Math.floor(Math.random() * 10) == 4) { this.battle(); }
            this.sprite.src = './Assets/tallGrassGlow.png';
        } else {
            this.sprite.src = './Assets/tallGrass.png';
        }
        return [false, false, false, false];
    }
    render(context) {
        context.drawImage(this.sprite, 0, 0, 400, 400, 300 - this.x, this.y, 20, 20);
    }
}

class House {
    constructor(y, x_offset = 0, sprite_num_x = 0) {
        this.posy = y;
        this.x_offset = x_offset;
        this.x = 0;
        this.sprite_num_x = sprite_num_x;
        this.sprite_num_y = 0;
        this.sprite = new Image();
        this.sprite.src = './Assets/House.png';
    }

    enterHouse() {
        game.player.x = 100;
        game.player.posy = 120;
        game.topLayer.push(new HouseBackground(this));
        game.topLayer.push(game.player);
        game.topLayer.push(new DisabledArea(0, 0, 300, 20, this.debug));
        game.topLayer.push(new DisabledArea(75, 53, 30, 30, this.debug));
        game.topLayer.push(new DisabledArea(0, 120, 20, 60, this.debug));
        game.topLayer.push(new DisabledArea(0, 280, 10, 60, this.debug));
        game.topLayer.push(new DisabledArea(60, 118, 50, 10, this.debug));
        game.topLayer.push(new DisabledArea(60, 250, 50, 20, this.debug));
        game.topLayer.push(new DisabledArea(120, 250, 50, 20, this.debug));
        game.topLayer.push(new DisabledArea(125, 120, 20, 20, this.debug));
        game.altscreen = true;
    }

    exitHouse() {
        game.player.x = 235;
        game.player.posy = 70;
        game.topLayer = [];
        game.altscreen = false;
    }

    collision_check(x, y) {
        if (Math.abs((x - this.x - this.x_offset)) < 120 && (Math.abs(y - this.posy) < 75)) {
            if (Math.abs(x - 230) < 5 && Math.abs(y - 70) < 5) this.enterHouse();

        }

        return [false, false, false, false];;
    }
    render(context) {
        context.drawImage(this.sprite, this.sprite_num_x * 112, this.sprite_num_y * 88, 112, 88, 300 - this.x_offset - this.x, this.posy, 112, 88);
    }
}

class Player {
    constructor(y, x_offset = 0) {
        this.posy = y;
        this.x_offset = x_offset;
        this.x = 200 + this.x_offset;
        this.sprite_num_x = 0;
        this.sprite_num_y = 0;
        this.kb = new KeyboardEvent('keydown')
        this.sprite = new Image();
        this.sprite.src = './Assets/player.png';
        this.prev = null;
        this.obstacles = [];
        document.addEventListener('keydown', (ev) => this.update(ev))
        document.addEventListener('keyup', (ev) => { this.sprite_num_x = 0 })
    }

    set_obstacles(obstacles) {
        this.obstacles = obstacles;
    }

    collision_check(x, y) { return false; }

    update(key) {
        this.x = Math.max(this.x, 0);
        this.x = Math.min(this.x, 270);
        this.posy = Math.max(this.posy, 0);
        this.posy = Math.min(this.posy, 130);
        this.collided = [false, false, false, false];
        for (var i = 0; i < this.obstacles.length; i++) {
            var br = false;
            var collided = this.obstacles[i].collision_check(this.x, this.posy);
            for (var j = 0; j < collided.length; j++) {
                var temp = collided[j];
                if (temp) {
                    this.collided[j] = true;
                }

            }
        }


        if (key.key === "ArrowLeft") {
            if (!this.collided[0]) {

                this.x += 3;
            }

            this.sprite_num_y = 1;
        }
        if (key.key === "ArrowUp") {
            if (!this.collided[1]) {

                this.posy -= 3;
            }

            this.sprite_num_y = 3;
        }
        if (key.key === "ArrowRight") {
            if (!this.collided[2]) {
                this.x -= 3;
            }
            this.sprite_num_y = 2;
        }
        if (key.key === "ArrowDown") {
            if (!this.collided[3]) {
                this.posy += 3;
            }
            this.sprite_num_y = 0;
        }

        if (key.key === "Control") {
            if (this.sprite.src.match('./Assets/player_cycle.png') == null) {
                this.sprite.src = './Assets/player_cycle.png'
            } else { this.sprite.src = './Assets/player.png' }
        }

        if (key.key == this.prev) {
            if (this.sprite_num_x == 3 && this.sprite_num_y == 1) {
                this.sprite_num_x = 0;
            }
            if (this.sprite_num_x == 3) {
                this.sprite_num_x = 0;
            }
            this.sprite_num_x += 1;
        }

        this.prev = key.key;

    }

    render(context) {
        context.drawImage(this.sprite, this.sprite_num_x * 68, this.sprite_num_y * 72, 68, 72, 270 - this.x, this.posy, 32, 34);
    }
}

class Tree {
    constructor(y, x_offset = 0) {
        this.posy = y;
        this.x_offset = x_offset;
        this.x = 0;
        this.sprite_num_x = Math.floor(Math.random() * 3);
        this.sprite_num_y = 0;
        this.sprite = new Image();
        this.sprite.src = './Assets/trees3d.png';
    }

    collision_check(x, y) { return false; }
    render(context) {
        context.drawImage(this.sprite, this.sprite_num_x * 42.7, this.sprite_num_y * 57, 40, 57, 300 - this.x_offset - this.x, this.posy, 50, 50);


    }
}

class Game {

    constructor(title, width, height) {
        this.title = title;
        this.width = width;
        this.height = height;
        this.elements = [];
        this.topLayer = [];
        this.altscreen = false;
        this.createCanvas();
        this.createElements();
        this.loop();
        this.debug = false;
    }


    createCanvas() {
        this.canvas = document.getElementById("base");
        this.ctx = this.canvas.getContext("2d");
    }

    createElements() {
        this.player = new Player(80, 25, this.elements);
        this.elements.push(new Grass(15, 80))
        this.elements.push(new Grass(35, 80));
        this.elements.push(new Grass(55, 80));
        this.elements.push(new Grass(15, 100));
        this.elements.push(new Grass(35, 100));
        this.elements.push(new Grass(55, 100));
        this.elements.push(new House(0, 300, 0));
        this.elements.push(this.player);
        this.elements.push(new Tree(-20, 50));
        this.elements.push(new Tree(0, 50));
        this.elements.push(new Tree(25, 50));
        this.elements.push(new Tree(55, 50));
        this.elements.push(new Tree(85, 50));
        this.elements.push(new Tree(120, 50));
        this.elements.push(new DisabledArea(5, 15, 80, 60, this.debug));
        this.elements.push(new DisabledArea(0, 250, 50, 200, this.debug));
    }

    async loop() {
        while (1) {
            this.ctx.clearRect(0, 0, 500, 700);

            if (!this.altscreen) {
                this.player.set_obstacles(this.elements);
                for (var x = 0; x < this.elements.length; x++) {
                    this.elements[x].render(this.ctx);

                }
            } else {
                for (var x = 0; x < this.topLayer.length; x++) {
                    this.topLayer[x].render(this.ctx);
                    this.player.set_obstacles(this.topLayer);
                }
            }
            await sleep(50);
        }

    }
}
    var game = new Game('', 500, 500);


