import Scene from "./Wolfie2D/Scene/Scene";
import Sprite from "./Custom/Sprite";
import Proj from "./Custom/Proj";
import Particle from "./Custom/Particle";
import Enemy from "./Custom/Enemy";
import CanvasRenderer from "./Wolfie2D/Rendering/CanvasRenderer";
import Input from "./Wolfie2D/Input/Input";

export default class default_scene extends Scene{
    public size: number = 32;
    public hSize: number = this.size/2;
    public qSize: number = this.hSize/2;
    public static toLoad: number = 0;
    public static camX: number = 0;
    public static camY: number = 0;
    public static shCamX: number = 0;
    public static shCamY: number = 0;

    public static key: boolean[] = [];
    public static pey: boolean[] = [];

    public static ctx: CanvasRenderingContext2D;
    public static mr: DOMRect;

    private static mapRef: string[] = [' ', '-', '_', ']', '[', 's', 'f'];
    private static tiles: HTMLImageElement[] = [];
    private static grid: string[][];

    public static Player: Sprite;
    public Tar: Sprite;
    public Count: Sprite;
    public Ball: Sprite;
    public kBall: Sprite;
    public dTrail: Sprite[] = [];

    public static kl: Proj;

    public static genX: number;
    public static genY: number;
    public del: number;
    public cw: number;
    public ch: number;
    public hcw: number; // QID??
    public hch: number;
    public kicking: number = 0;
    public curve: number = 0;
    public dashing: number = -1;
    public dashCool: number = 0;
    public dashV: number;
    public throwing: number = 0;
    public static parrying: number = -1;
    public static parryCool: number = 0;
    public walking: number = 5;
    public walk: number;
    public wf: number = 2;
    public wDir: number = 1;
    public bSel: number = 0;
    public thl: number;
    public static vx: number = 0;
    public static vy: number = 0;
    public dashX: number = 0;
    public dashY: number = 0;
    public static mw: number;
    public static mh: number;
    public mdx: number = 0;
    public mdy: number = 0;
    public mdl: number;
    public newCamX: number = 0;
    public newCamY: number = 0;
    public static shct: number;
    public static shCam: number;
    public static mouseX: number = 0;
    public static mouseY: number = 0;
    public kfr: number = 9;
    public wGen: number;
    public static qid: number[][];
    public doubles: number[] = [87, 65, 83, 68, 0, 0, 0, 0];
    public ammo: number[] = [-1, 0, 0];


    public static hasBall: boolean = true;
    public grounded: boolean = true;
    public hk: boolean = false;
    public kp: boolean;

    loadScene(): void {
        //this.load.image("logo", "demo_assets/images/wolfie2d_text.png");
        //this.load.object("level1", "levels/level1.txt");
    }

    startScene(): void {
        default_scene.ctx = CanvasRenderer.ctxRef;
        this.cw = CanvasRenderer.cw; this.hcw = this.cw / 2;
        this.ch = CanvasRenderer.ch; this.hch = this.ch / 2;
        default_scene.mr = CanvasRenderer.mr;
        
        for(var i = 0; i < 300; i++){ //initialize the key and pey list capacities
            default_scene.key.push(false);
            default_scene.pey.push(false);
        }
        window.addEventListener("keydown", function (e){default_scene.pey[e.keyCode] = !default_scene.key[e.keyCode]; default_scene.key[e.keyCode] = true;}, true);
        window.addEventListener("keyup", function (e){default_scene.key[e.keyCode] = false;}, true);
        window.addEventListener('mousedown', function(e){default_scene.pey[229 + e.which] = !default_scene.key[229 + e.which]; default_scene.key[229 + e.which] = true;}, true);
        window.addEventListener('mouseup', function(e){default_scene.key[229 + e.which] = false;}, true); //230 = left mouse, 231 = middle, 232 = right mouse.
        window.addEventListener("mousemove", function(e){
            //if(key[16] && kp) curve += e.clientX - mr.left - size - mouseX, console.log(curve);
            default_scene.mouseX = e.clientX - default_scene.mr.left - Sprite.size, default_scene.mouseY = e.clientY - default_scene.mr.top - Sprite.size;
        });
        //this.addLayer("primary", 1);
        //console.log("TEST CTX::: " + default_scene.ctx);
        default_scene.Player = new Sprite("pn", true, 14, 32, 64);
        this.Tar = new Sprite("tar");
        this.kBall = new Sprite("ball");
        this.Count = new Sprite("count", false, 3);
        this.Count.hide();
        this.kBall.hide();

        //default_scene.ctx.rect(0, 0, 500, 500);
        //default_scene.ctx.fill();

        //var test = new Enemy(300, 100, 0);

        //this.build(this.load.getObject("level1").toString());
        this.build('                                 ,                                 ,-                          -     ,    -   -                0-      ,            -       -    -       ,                    --  -        ,------------------------------- -');
    }

    updateScene(delta: number): void {
        if(default_scene.toLoad > 0) return;
        this.del = delta*50;
        //if(this.del > .9) return; //throw away long frames???
        default_scene.ctx.clearRect(0, 0, this.cw, this.ch);
        this.kp = this.kicking <= 0 || this.kicking > 290 || !this.hk;
        if(this.kp) if(this.dashing > 0){
            this.dashV = this.dashing / 3;
            default_scene.vx = this.dashX * this.dashV * this.del;
            default_scene.vy = this.dashY * this.dashV * this.del;
            if(10 - Math.floor(this.dashing / 3) > this.dTrail.length){
                this.dTrail.push(new Sprite(default_scene.Player.getImage(), false, -1, default_scene.Player.x, default_scene.Player.y));
                //new Particle(Player.x+hSize, Player.y+hSize, '#a2a1ff', 10, -.1, -vx, -vy);
            }
            for(var i = 0; i < this.dTrail.length; i++) this.dTrail[i].alpha = (i+1)/this.dTrail.length * (this.dashing/50);
            if((this.dashing -= this.del) <= 0){
                for(var d of this.dTrail) d.del();
                this.dTrail = [];
            }
        }else{
            this.walk = (+default_scene.key[68] - +default_scene.key[65]);
            if((this.kicking > 0 || (default_scene.parrying -= this.del) >= 0) && this.grounded) this.walk = 0;
            if(this.walk != 0 && (this.walking -= this.del) < 0) this.walking = 5, this.wf += this.wDir, this.wDir *= +(this.wf == 2)*2-1;
            default_scene.Player.frame = this.wf;
            if(default_scene.key[65]) default_scene.Player.flip = true;
            else if(default_scene.key[68]) default_scene.Player.flip = false;
            else default_scene.Player.frame = 0;
            if(default_scene.parryCool <= 0 || this.grounded) default_scene.vx += this.walk, default_scene.vx *= this.del;
            if(default_scene.parrying <= 0 && default_scene.pey[16]) default_scene.parrying = 50;
        }
        this.wallCheck(true);
        if(!this.grounded){
            if(this.kp && this.dashing < 0) default_scene.vy += this.del * .5, default_scene.Player.frame = default_scene.vy < 0 ? 7 : 8;
            if(default_scene.vy < 0){
                if(default_scene.Player.y + default_scene.vy - this.qSize < 0) this.dashY = default_scene.vy = 0;
                else if(default_scene.Player.y > default_scene.mh) this.die();
                else if(default_scene.qid[this.wGen = Math.floor((default_scene.Player.y-this.qSize)/this.size)][Math.floor((default_scene.Player.x+this.qSize)/this.size)] == 1 || default_scene.qid[this.wGen][Math.ceil((default_scene.Player.x-this.qSize)/this.size)] == 1) default_scene.vy = 0;
                else this.wallCheck(false);
            }else{
                if(default_scene.qid[this.wGen = Math.floor((default_scene.Player.y+this.size+default_scene.vy)/this.size)][Math.round(default_scene.Player.x/this.size)] == 1) this.grounded = true, this.dashY = default_scene.vy = 0, default_scene.Player.y = (this.wGen-1)*this.size;
                this.wallCheck(false);
            }
        }else if(this.dashing < 0 && default_scene.key[32] && default_scene.qid[this.wGen = Math.floor((default_scene.Player.y-this.qSize)/this.size)][Math.floor((default_scene.Player.x+this.qSize)/this.size)] == 0 && default_scene.qid[this.wGen][Math.ceil((default_scene.Player.x-this.qSize)/this.size)] == 0) this.grounded = false, default_scene.vy = -8;
        else if(default_scene.qid[this.wGen = Math.round((default_scene.Player.y+this.size)/this.size)][Math.floor((default_scene.Player.x+this.qSize)/this.size)] == 0 && default_scene.qid[this.wGen][Math.ceil((default_scene.Player.x-this.qSize)/this.size)] == 0) this.grounded = false, default_scene.vy = 0;

        if(default_scene.parrying >= 0) default_scene.Player.frame = 12;
        else if(default_scene.parryCool > 0) default_scene.Player.frame = 13, default_scene.parryCool -= this.del;
        if(this.kp) default_scene.Player.move(default_scene.vx, default_scene.vy);
        this.mdx = default_scene.mouseX - default_scene.Player.x+default_scene.camX+this.hSize;
        this.mdy = default_scene.mouseY - default_scene.Player.y+default_scene.camY+this.hSize;
        this.mdl = Math.sqrt(this.mdx*this.mdx+this.mdy*this.mdy);
        this.mdx /= this.mdl; this.mdy /= this.mdl;
        this.Tar.setPos(default_scene.Player.x+this.hSize+this.mdx*20-3.5, default_scene.Player.y+this.hSize+this.mdy*20-3.5);

        if(this.dashCool > 0) this.dashCool -= this.del;
        else if(default_scene.parrying < 0) for(var i = 0; i < 4; i++){
            if(default_scene.pey[this.doubles[i]]) this.doubles[i+4] = this.doubles[i+4] > 0 ? -1 : 10;
            else this.doubles[i+4] = Math.max(this.doubles[i+4] - this.del, 0);
            if(this.doubles[i+4] == -1){
                this.dashX = this.getDash(i, true); this.dashY = this.getDash(i, false);
                if(default_scene.key[this.doubles[this.wGen = this.wrap(i+1, 4)]] || default_scene.key[this.doubles[this.wGen = this.wrap(i-1, 4)]]) this.dashX += this.getDash(this.wGen, true), this.dashY += this.getDash(this.wGen, false), this.dashX *= .707, this.dashY *= .707;
                this.dashing = 30; this.dashCool = 40;
                if(this.dashY > 0 && this.grounded) this.dashY = 0;
                this.doubles[i+4] = 0; break;
            }
        }

        if((default_scene.key[81] && this.kicking == 0 && default_scene.parrying < 0 && (default_scene.hasBall || this.bSel > 0)) || this.throwing > 0){
            if(this.throwing == 0){
                if(this.ammo[this.bSel] == 0) this.throwing = -this.del;
                else this.ammo[this.bSel]--;
                switch(this.bSel){
                    case 0:
                        if(this.kBall.hidden) this.kBall.setPos(default_scene.Player.x, default_scene.Player.y);
                        (this.Ball = this.kBall).show();
                    break; default:
                        this.Ball = new Sprite(this.bSel == 1 ? "grenade" : "sword");
                        this.Ball.setPos(default_scene.Player.x, default_scene.Player.y);
                    break;
                }
                //Count.show();
                this.Ball.removeProj();
                this.Ball.moveTo(this.Tar, 25, -this.qSize, -this.qSize);
            }
            this.throwing = Math.min(25, this.throwing + this.del);
            this.thl = Math.floor(this.throwing / 8);
            if(default_scene.key[81]) default_scene.key[81] = this.throwing < 25; //limit hit
        }if(this.throwing > 0){
            if(this.thl > 0 && !default_scene.key[81]){ //throw!
                this.thl *= 3;
                new Proj(this.Ball, this.mdx * this.thl, this.mdy * this.thl, 0, 0);
                this.Ball.moveTo(undefined);
                this.Ball.setPos(this.Tar.x-this.qSize, this.Tar.y-this.qSize);
                this.Count.hide(); default_scene.hasBall = false;
                this.Count.sh = this.throwing = 0; 
            }//else Player.frame = thfr + thl;
            default_scene.Player.flip = this.mdx < 0;
        }

        if(this.kicking > 0){
            default_scene.Player.flip = this.mdx < 0;
            default_scene.Player.frame = this.kfr + Math.floor(Math.min((300 - this.kicking)/3, 2));
            this.kicking -= this.del;
            if(!this.hk && this.kicking < 290){ //end wind up (hbox)
                default_scene.kl = this.getKick(default_scene.Player.x+this.hSize, default_scene.Player.y+this.hSize, this.size);
                if(this.kicking < 275) this.kicking = -50; //wiff for real
                else if(default_scene.kl != undefined){
                    this.hk = true;
                    default_scene.kl.vx = default_scene.kl.vy = default_scene.kl.sx = default_scene.kl.sy = 0;
                    default_scene.kl.s.shake(5, 290);
                    default_scene.kl.s.moveTo(this.Tar, 290, -this.qSize, -this.qSize);
                    this.Count.show();
                }
            }else if(this.hk && (!default_scene.key[230] || this.kicking < 0)){ //release (proj)
                default_scene.kl.s.shake(); default_scene.kl.s.moveTo(undefined);
                default_scene.kl.s.setPos(this.Tar.x-this.qSize, this.Tar.y-this.qSize);
                default_scene.kl.vx = this.mdx * 20; default_scene.kl.vy = this.mdy * 20;
                default_scene.kl.c = Math.min(this.thl, 3), default_scene.kl.g = 0;
                this.Count.hide(); this.Count.shake(undefined);
                this.Count.frame = default_scene.vy = 0;
                Proj.List.push(default_scene.kl);
                //camShake(3, 10);
                this.kicking = -30;
            }else if(default_scene.kl){
                this.thl = Math.floor((290-this.kicking)/30);
                this.Count.frame = default_scene.clamp(this.thl-1, 0, 2);
                this.Count.shake(this.Count.frame, 290);
                this.Count.setPos(default_scene.Player.x+this.qSize, default_scene.Player.y-this.hSize);
            }
        }else if(this.kicking < 0 && (this.kicking += this.del) > 0) this.kicking = 0; //cooldown
        else if(default_scene.pey[230] && default_scene.parrying < 0) this.kicking = 300, this.curve = 0, this.hk = false, default_scene.kl = undefined;

        this.newCamX = default_scene.camX + (default_scene.Player.x-this.hcw - default_scene.camX)/10;
        if(this.newCamX > 0 && this.newCamX < default_scene.mw - this.cw) default_scene.camX = this.newCamX;
        this.newCamY = default_scene.camY + (default_scene.Player.y-this.hch - default_scene.camY)/10;
        if(this.newCamY > 0 && this.newCamY < default_scene.mh - this.ch) default_scene.camY = this.newCamY;
        if((default_scene.shct -= this.del) > 0){
            default_scene.shCamX = default_scene.rand(default_scene.shCam);
            default_scene.shCamY = default_scene.rand(default_scene.shCam);
        }

        //default_scene.ctx.drawImage(default_scene.tiles[1], 32, 32);

        this.makeMap();
        Enemy.Run(this.del);
        Proj.Run(this.del);
        Sprite.Run(this.del);
        Particle.Run(this.del);
        default_scene.pey = [];
    }
    public wallCheck(ex: boolean): void{
        if(default_scene.vx == 0) return;
        if(default_scene.vx < 0){
            if(ex && default_scene.Player.x + default_scene.vx < -this.qSize) default_scene.Player.x = -this.qSize, default_scene.vx= 0;
            else if(default_scene.qid[ex ? Math.round(default_scene.Player.y/this.size) : Math.ceil(default_scene.Player.y/this.size)][this.wGen = Math.floor((default_scene.Player.x+this.qSize+default_scene.vx)/this.size)] == 1) default_scene.Player.x = (this.wGen+1)*this.size - this.qSize, default_scene.vx = 0;
        }else{
            if(ex && default_scene.Player.x + default_scene.vx > default_scene.mw - this.hSize - this.qSize) default_scene.Player.x = default_scene.mw - this.hSize - this.qSize, default_scene.vx = 0;
            else if(default_scene.qid[ex ? Math.round(default_scene.Player.y/this.size) : Math.ceil(default_scene.Player.y/this.size)][this.wGen = Math.floor((default_scene.Player.x+this.hSize+this.qSize+default_scene.vx)/this.size)] == 1) default_scene.Player.x = (this.wGen-1)*this.size + this.qSize, default_scene.vx = 0;
        }
    }
    public static rand(x: number): number{
        return (Math.random()*2-1)*x;
    }
    public static camShake(i: number, t: number): void{
        default_scene.shCam = i;
        default_scene.shct = t;
    }
    public static distance(s1: Sprite, s2: Sprite, d1 = 0, d2 = 0): number{
        return Math.sqrt((default_scene.genX = s2.x+d1-s1.x-d2)*default_scene.genX + (default_scene.genY = s2.y+d1-s1.y-d2)*default_scene.genY);
    }

    private build(str: string): void{
        default_scene.grid = str.split(',').map(s => s.split(''));
        default_scene.mh = default_scene.grid.length * this.size; default_scene.mw = default_scene.grid[0].length * this.size; //set dimensions of the map
        default_scene.qid = []; var loads = [], mGen;
        for(var i = 0; i < default_scene.grid.length; i++){ //build qid and decide what images to load / unload
            default_scene.qid.push([]);
            for(var n = 0; n < default_scene.grid[i].length; n++){
                if((mGen = default_scene.mapRef.indexOf(default_scene.grid[i][n])) > 4 || mGen == -1) switch(default_scene.grid[i][n]){
                    case 's': default_scene.Player.setPos(n*this.size, i*this.size); default_scene.camX = default_scene.clamp(default_scene.Player.x - this.hcw, 0, default_scene.mw-this.cw); default_scene.camY = default_scene.clamp(default_scene.Player.y + this.hch, this.ch, default_scene.mh); break;
                    case 'f': break;
                    default: new Enemy(n*this.size, i*this.size, parseInt(default_scene.grid[i][n])); mGen = 0; break; //Enemy placement
                }
                default_scene.qid[default_scene.qid.length-1].push(mGen);
                loads[default_scene.qid[i][n]] = true;
            }
        }
        var tl = Math.max(default_scene.tiles.length, loads.length);
        while(default_scene.tiles.length < tl) default_scene.tiles.push(undefined);
        while(loads.length < tl) loads.push(undefined);
        for(var i = 1; i < tl; i++){
            if(loads[i] && default_scene.tiles[i] == undefined){ //load
                default_scene.tiles[i] = new Image(this.size, this.size);
                default_scene.tiles[i].onload = function(){default_scene.toLoad--;}
                default_scene.tiles[i].src = "images/tile" + i + ".png";
                default_scene.toLoad++;
            }else if(!loads[i] && default_scene.tiles[i] != undefined) default_scene.tiles[i] = undefined; //unload
        }
    }

    public makeMap(): void{
        for(var i = 0; i < default_scene.qid.length; i++) for(var n = 0; n < default_scene.qid[i].length; n++) if(default_scene.qid[i][n] != 0 && Math.abs(n*this.size-default_scene.camX) < this.cw && Math.abs(i*this.size-default_scene.camY) < this.ch) this.make(n, i);
    }

    public make(x: number, y: number): void{
        default_scene.ctx.drawImage(default_scene.tiles[default_scene.qid[y][x]], x*this.size - default_scene.camX - default_scene.shCamX, y*this.size - default_scene.camY - default_scene.shCamY);
    }
    public static damage(): void{
        console.log("OUCH!!! --> took damage!");
    }
    private die(): void{
        console.log("DEAD!!!");
    }
    private getKick(x: number, y: number, d: number): Proj{
        for(var p of Proj.List) if(Math.sqrt((default_scene.genX = p.s.x-x+this.qSize)*default_scene.genX + (default_scene.genY = p.s.y-y+this.qSize)*default_scene.genY) <= d) return p;
        return undefined;
    }
    public static clamp(n: number, min: number, max: number): number{
        return Math.min(Math.max(n, min), max);
    }
    private wrap(p: number, l: number): number{
        while(p < 0) p += l;
        return p % l;
    }
    private getDash(x: number, b: boolean){
        return this.sign(x) * ((b ? x : x+1) % 2);
    }
    private sign(x: number): number{
        return Math.floor(x/2)*2-1;
    }
}