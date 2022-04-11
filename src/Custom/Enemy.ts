import default_scene from "../default_scene";
import Sprite from "./Sprite";
import Particle from "./Particle";
import Proj from "./Proj";

export default class Enemy{
    private static ref = ["goomba", -1];
    public static List: Enemy[] = [];
    private static wGen: number;

    public t: number;
    public vx: number;
    public vy: number;
    public s: Sprite;
    public grounded: boolean;
    constructor(x: number, y: number, t = 0){
        this.t = t;
        this.vx = this.vy = 0;
        switch(t){
            case 0: this.vx = 1; this.grounded = true; break;
            case 1: break;
            case 2: break;
        }
        this.s = new Sprite(Enemy.ref[t*2].toString(), true, +Enemy.ref[t*2+1], x, y);
        Enemy.List.push(this);
    }
    static Run(del: number){
        for(var e of Enemy.List) e.run(del);
    }
    run(del: number){
        switch(this.t){
            case 0: //goomba AI
                if(this.grounded = default_scene.qid[Enemy.wGen = Math.round(this.s.y/Sprite.size)+1][Math.round(this.s.x/Sprite.size)] != 0){
                    if(default_scene.qid[Math.round(this.s.y/Sprite.size)][Math.round((this.s.x+this.vx*Sprite.qSize)/Sprite.size)]) this.vx *= -1;
                    this.vy = 0, this.s.y = (Enemy.wGen-1)*Sprite.size, this.s.x += this.vx * del;
                }else this.vy += .4 * del, this.s.y += this.vy;
            break; case 1: //bat AI

            break; case 2: //something else AI

            break;
        }
    }
    check(p: Proj){
        if(!this.s.check(p.s)) return false;
        //console.log(p.s.x + ", " + p.s.y + " + " + this.s.x + ", " + this.s.y);
        switch(this.t){
            case 0: break;
            case 1: break;
            case 2: break;
        }
        if(p.t != 1){ //blood splat if not grenade
            Particle.Cloud(p.s.x+Sprite.qSize, p.s.y+Sprite.qSize, 10, 10, '#ff0000', 50, .4, p.vx, p.vy);
            Particle.Cloud(p.s.x+Sprite.qSize, p.s.y+Sprite.qSize, 10, 5, '#ff0000', 50, .4, -.2*p.vx, -.2*p.vy);
            default_scene.camShake(3, 10);
        }else p.del();
        /*if(p.t == 0){ //ball bounces up
            p.vx = -.1 * Math.sign(p.vx);
            p.vy = -9; p.c = 0;
        }*/
        return true;
    }
}