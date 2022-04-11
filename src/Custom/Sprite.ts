import default_scene from "../default_scene";
import Proj from "./Proj";

export default class Sprite{
    public static size: number = 32;
    public static hSize: number = Sprite.size/2;
    public static qSize: number = Sprite.hSize/2;

    public static Loaded: any[] = [];
    public static List: Sprite[] = [];
    private static genString: string;
    public static genEx: any[];
    public static genImg: any;

    public frames: any[];
    public flips: any[];
    public frame: number = 0;
    public sx: number = 0;
    public sy: number = 0;
    public r: number = 0;
    public flip: boolean;
    public hidden: boolean;
    public x: number = 0;
    public y: number = 0;
    public alpha: number = 1;
    public tt: number = 0;
    public tl: number = 0;
    public tar: Sprite;
    public sh: number = 0;
    public st: number = 0;
    public rot: number = 0;
    public rt: number = 0;
    public rl: number = 0;
    public ox: number = 0;
    public oy: number = 0;
    public p: Proj;

    constructor(name: string, dof = false, fr = -1, x = 0, y = 0){
        this.frames = [];
        this.flips = [];
        this.frame = this.sx = this.sy = this.r = 0;
        this.flip = this.hidden = false;
        this.x = x;
        this.y = y;
        this.alpha = 1;
        for(var i = 0; i < Math.max(fr, 1); i++){
            Sprite.genString =  name + (fr == -1 ? '' : i) + ".png";
            this.loadImage(name, i, Sprite.genString);
            if(dof) this.loadImage(name, i, Sprite.genString, true)
        }
        Sprite.List.push(this);
    }
    loadImage(n: string, i: number, s: string, g = false){
        Sprite.genEx = (g ? this.flips : this.frames);
        Sprite.genEx.push();
        if(typeof n == 'object') return Sprite.genEx[i] = n;
        if((Sprite.genImg = Sprite.haveLoaded(s)) != undefined) return (Sprite.genEx[i] = Sprite.genImg);
        Sprite.genEx[i] = new Image(Sprite.size, Sprite.size);
        Sprite.genEx[i].onload = function(){default_scene.toLoad--; Sprite.Loaded.push(this);}
        Sprite.genEx[i].src = (g ? 'images/~' : 'images/') + s;
        default_scene.toLoad++;
    }
    static haveLoaded(s: string){
        for(var l of Sprite.Loaded) if(l.src == s) return l;
        return undefined;
    }
    static Run(del: number){
        for(var s of Sprite.List) s.run(del);
        default_scene.ctx.globalAlpha = 1;
    }
    run(del: number){
        if(this.sh){
            this.sx = default_scene.rand(this.sh);
            this.sy = default_scene.rand(this.sh);
            if((this.st -= del) < 0) this.sh = this.sx = this.sy = 0;
        }
        if(this.tar){
            //console.log(this.tar.toString());
            if((this.tt -= del) < 0) this.tt = 0;
            this.move(this.tar.x+this.ox-this.x, this.tar.y+this.oy-this.y, 1 - this.tt/this.tl);
            if(this.tt == 0) this.tar = undefined;
            
        }
        if(this.rot){
            this.rotate(this.rot-this.r, 1 - this.rt/this.rl);
            if((this.rt -= del) < 0) this.rot = undefined;
        }
        if(this.hidden) return;
        default_scene.ctx.globalAlpha = this.alpha;
        default_scene.ctx.drawImage(this.flip ? this.flips[this.frame] : this.frames[this.frame], this.x+this.sx-default_scene.camX-default_scene.shCamX, this.y+this.sy-default_scene.camY-default_scene.shCamY);
        //console.log(this.toString() + "::: " + default_scene.camX + ", " + default_scene.camY);
    }
    del(){
        Sprite.List.splice(Sprite.List.indexOf(this), 1);
        //delete this;
    }
    removeProj(){
        if(this.p) this.p.del();
    }
    hide(){
        this.hidden = true;
    }
    show(){
        this.hidden = false;
    }
    check(p: Sprite){
        //return p.x - this.x <= 0 && p.x - this.x >= -hSize && p.y - this.y <= qSize && p.y - this.y <= -size;
        return Math.abs(p.x - this.x) < Sprite.hSize && Math.abs(p.y - this.y) < Sprite.hSize;
    }
    rotate(r: number, f = 1){
        this.r += r * f;
    }
    rotateTo(rot: number, rt: number){
        this.rot = rot;
        this.rl = this.rt = rt;
    }
    move(vx: number, vy: number, f = 1){
        this.x += vx * f;
        this.y += vy * f;
    }
    shake(s = 0, t = 0){
        this.sh = s;
        this.st = t;
        if(s == 0) this.sx = this.sy = 0;
    }
    moveTo(tar: Sprite, tt = 0, ox = 0, oy = 0){
        this.tar = tar;
        this.ox = ox;
        this.oy = oy;
        this.tl = this.tt = tt;
    }
    setPos(x: number, y: number){
        this.x = x;
        this.y = y;
    }
    getImage(){
        //console.log(typeof (this.flip ? this.flips : this.frames)[this.frame]);
        return (this.flip ? this.flips : this.frames)[this.frame];
    }
    toString(){
        return this.getImage().src;
    }
}