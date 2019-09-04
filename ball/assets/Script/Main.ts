const { ccclass, property } = cc._decorator;

@ccclass
export class Main extends cc.Component {
    private visualBoard: cc.Node = null;
    private touchBoard: cc.Node = null;
    private rigidBoard: cc.Node = null;
    public onLoad(): void {
        const manager: cc.PhysicsManager = cc.director.getPhysicsManager();
        manager.enabled = true;
        manager.gravity = cc.v2(0, 0);
        manager.enabledAccumulator = true;
        console.log("球数为", cc.find("Canvas/balls").childrenCount * 3);
        this.visualBoard = cc.find("Canvas/VisualBoard");
        this.touchBoard = cc.find("Canvas/TouchBoard");
        this.rigidBoard = cc.find("Canvas/Board");
        this.touchBoard.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchBoard.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd,this);
    }
    public onTouchEnd():void{
        this.selectImg();
    }
    public update(): void {
        const deltaX: number = this.visualBoard.x - this.rigidBoard.x;
        const deltaY: number = this.visualBoard.y - this.rigidBoard.y;
        const effectiveX: number = Math.abs(deltaX) > 5 ? deltaX : 0;
        const effectiveY: number = Math.abs(deltaY) > 5 ? deltaY : 0;
        if (effectiveX === 0 && effectiveY === 0) {
            this.rigidBoard.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            return;
        }
        this.rigidBoard.getComponent(cc.RigidBody).linearVelocity = cc.v2(effectiveX * 30, effectiveY * 30);
    }
    private onTouchMove(touch: cc.Event.EventTouch): void {
        const newX: number = this.visualBoard.x + touch.getDeltaX();
        const newY: number = this.visualBoard.y + touch.getDeltaY();
        const halfWidth: number = this.visualBoard.width * this.visualBoard.scaleX / 2;
        let finalX: number = this.visualBoard.x;
        let finalY: number = this.visualBoard.y;
        if ((newX > 0 && newX + halfWidth <= 320) || (newX < 0 && newX - halfWidth >= -320)) {
            finalX = newX;
        }
        if (newY > this.touchBoard.y && newY < this.touchBoard.y + this.touchBoard.height) {
            finalY = newY;
        }
        this.visualBoard.setPosition(finalX, finalY);
    }
    private selectImg():void{
        const canvas = document.createElement('canvas');
        document.body.insertBefore(canvas,document.body.firstChild);
        // const image = document.createElement('image');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        // image
        const image: Image = new Image();
        image.onload = function(){
            ctx.drawImage(image,0,0,200,200);
            var pixel = ctx.getImageData(15, 15, 1, 1);
            console.log(pixel);
            console.log(pixel.height);
            console.log(pixel.width);
            console.log(pixel.data);
            for(let i:number = 0;i< pixel.data.length;i++){
            console.log(pixel.data[i]);
            }
            /*********************** */
            //todo
            let size = 1;
            let timer = setInterval(
                ()=>{
                    size++;
                    if(size > 15){
                        clearInterval(timer);
                        timer = null;
                    }
                    const width = 200;
                    const height = 200;
                
                    // context.drawImage(img, 0, 0, width, height)
                    const imageData = ctx.getImageData(0, 0, width, height)
                    const pixels = imageData.data
                
                    for (let x = 1; x < imageData.width / size; x++) {
                    for (let y = 1; y < imageData.height / size; y++) {
                        const tx = (size * x) - (size / 2)
                        const ty = (size * y) - (size / 2)
                        const pos = (Math.floor(ty - 1) * imageData.width * 4) + (Math.floor(tx -1) * 4)
                        const red = pixels[pos]
                        const green = pixels[pos+1]
                        const blue = pixels[pos+2]
                
                        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`
                        ctx.fillRect(tx, ty, size, size)
                    }
                    }

                },1000
            )
            // for(let size:number = 0;size< 15;i++){
                // const width = 200;
                // const height = 200;
            
                // // context.drawImage(img, 0, 0, width, height)
                // const imageData = ctx.getImageData(0, 0, width, height)
                // const pixels = imageData.data
            
                // for (let x = 1; x < imageData.width / size; x++) {
                // for (let y = 1; y < imageData.height / size; y++) {
                //     const tx = (size * x) - (size / 2)
                //     const ty = (size * y) - (size / 2)
                //     const pos = (Math.floor(ty - 1) * imageData.width * 4) + (Math.floor(tx -1) * 4)
                //     const red = pixels[pos]
                //     const green = pixels[pos+1]
                //     const blue = pixels[pos+2]
            
                //     ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`
                //     ctx.fillRect(tx, ty, size, size)
                // }
                // }
            // }
            
            /************************* */
        }
        // document.create
        const tmpSelectFile = function(){
        console.log("AAA");
        const tempfileInput = document.getElementById("fileInput");
        const fr = new FileReader();
        fr.onload = function(){
        image.src = fr.result;
        }
        fr.readAsDataURL(tempfileInput.files[0]);
        }
        var fileInput = document.getElementById("fileInput");
        if (fileInput == null){
            fileInput = document.createElement("input");
            fileInput.id = "fileInput";
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.style.height = "9100px";
            fileInput.style.display = "block";
            fileInput.style.overflow = "hidden";
            // fileInput.multiple = "multiple"; // 多选
            document.body.insertBefore(fileInput, document.body.firstChild); //将 fileInput 这个element插入到body里面作为第一个subelement
            fileInput.addEventListener('change', tmpSelectFile, false); //选择的东西变化之后会触发 tmpSelectFile
        }
        setTimeout(function () { fileInput.click() }, 3000);//3000是延迟3000毫秒之后触发点击
    }
    // function test(ima,size) {
        
    // }
}
