import default_scene from "../default_scene";

export default class Particle{
    public static List: Particle[] = [];

    public x: number;
    public y: number;
    public c: string;
    public t: number;
    public l: number;
    public g: number;
    public vx: number;
    public vy: number;
    constructor(x: number, y: number, c: string, l: number, g: number, vx: number, vy: number){
        this.x = x;
        this.y = y;
        this.c = c;
        this.t = this.l = l;
        this.g = g;
        this.vx = vx;
        this.vy = vy;
        Particle.List.push(this);
    }
    static Run(del: number){
        for(var p of Particle.List) p.run(del);
        default_scene.ctx.globalAlpha = 1;
    }
    static Cloud(x: number, y: number, r: number, n: number, c: string, l: number, g: number, vx: number, vy: number){
        for(var i = 0; i < n; i++) new Particle(x+default_scene.rand(r), y+default_scene.rand(r), c, l, g, vx+default_scene.rand(r), vy+default_scene.rand(r));
    }
    run(del: number){
        this.x += this.vx * del;
        this.y += this.vy * del;
        this.vy += this.g * del;
        if((this.t -= del) < 0) Particle.List.splice(Particle.List.indexOf(this), 1);
        else{
            default_scene.ctx.beginPath();
            default_scene.ctx.fillStyle = this.c;
            default_scene.ctx.globalAlpha = this.t / this.l;
            default_scene.ctx.rect(this.x-2.5-default_scene.camX, this.y-2.5-default_scene.camY, 5, 5);
            default_scene.ctx.fill();
        }
    }
}