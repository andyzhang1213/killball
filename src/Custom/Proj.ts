import default_scene from "../default_scene";
import Sprite from "./Sprite";
import Enemy from "./Enemy";

export default class Proj{
    public static List: Proj[] = [];
    private static wGen: number = 0;

    public s: Sprite;
    public vx: number = 0;
    public vy: number = 0;
    public c: number = 0;
    public t: number = 0;
    public sx: number = 0;
    public sy: number = 0;
    public g: number = 0;
    public h: boolean = false;
    public l: number = 0;
    constructor(s: Sprite, vx: number, vy: number, c: number, t = -1, sx = 0, sy = 0, g = 0){
        this.s = s;
        this.vx = vx;
        this.vy = vy;
        this.c = c;
        this.t = t;
        this.sx = sx;
        this.sy = sy;
        this.g = g;
        //this.h = false;
        if(c == 0) this.g = -.4;
        s.p = this;
        Proj.List.push(this);
    }
    static Run(del: number){
        for(var p of Proj.List) p.run(del);
    }
    del(){
        if(this.l && this == default_scene.kl && this.l <= 0){this.l = 100; return;}
        default_scene.hasBall = true;
        Proj.List.splice(Proj.List.indexOf(this), 1);
    }
    run(del: number){
        default_scene.genX = this.vx < 0 ? Sprite.hSize : 0;
        default_scene.genY = this.vy < 0 ? Sprite.hSize : 0;
        if(this.s.y + this.vy < 0 || this.s.y + this.vy + Sprite.hSize > default_scene.mh || default_scene.qid[Proj.wGen = Math.round((this.s.y + this.vy - default_scene.genY)/Sprite.size)][Math.round((this.s.x-Sprite.qSize)/Sprite.size)] == 1){ // || qid[Proj.wGen][Math.round((this.s.x+qSize)/size)] == 1
            if(this.vy > 0 && this.vy < .2) this.vy = 0;
            //this.s.y = (Proj.wGen - ((-Math.sign(this.vy)+1)/2))*size - slight*Math.sign(this.vy) - genY;
            this.vy *= -.8; this.vx *= .9;
            if(--this.c <= 0) this.g = -.4;
        }else if(this.s.x + this.vx < 0 || this.s.x + this.vx + Sprite.hSize > default_scene.mw || default_scene.qid[Math.round((this.s.y-Sprite.qSize)/Sprite.size)][Proj.wGen = Math.round((this.s.x + this.vx - default_scene.genX)/Sprite.size)] == 1){ // || qid[Math.round((this.s.y+qSize)/size)][Proj.wGen] == 1
            //this.s.x = (Proj.wGen - ((-Math.sign(this.vy)+1)/2))*size - slight*Math.sign(this.vx) - genX;
            this.vx *= -.8; this.vy *= .9;
            if(--this.c <= 0) this.g = -.4;
        }
        if(this.l && (this.l -= del) <= 0){this.del(); return;}
        if(!this.h && (Math.abs(this.vx) > 14 || Math.abs(this.vy) > 14)) for(var e of Enemy.List) if(e.check(this)){
            if(this.t == 0){
                this.vx = -.1 * Math.sign(this.vx);
                this.vy = -9; this.c = 0; this.g = -.4;
            }
            if(this.t != 2) return;
        }
        if((this.h || (default_scene.parrying >= 0 && Math.abs(this.vx) > 10 || Math.abs(this.vy) > 10)) && default_scene.distance(default_scene.Player, this.s, Sprite.hSize, Sprite.qSize) < Sprite.size){ //hit Player
            if(default_scene.parrying >= 0){
                if(this.h) this.l = 100;
                else default_scene.vx = this.vx, default_scene.vy = this.vy;
                this.vx *= -.1; this.vy = -5; this.c = 0; this.g = -.4;
                default_scene.parrying = -1, default_scene.parryCool = 40;
                this.h = false; default_scene.camShake(2, 10);
            }else if(this.h){
                default_scene.damage();
                this.del(); return;
            }
        }
        if(this.g == 0) this.vx += this.sx, this.vy += this.sy; //spin
        else if(this.vy != 0) this.vy -= this.g * del;
        else if(Math.abs(this.vx /= 2) < .1) this.del();
        this.s.move(this.vx, this.vy, del);
        this.s.rotate(this.vx, del);
    }
}