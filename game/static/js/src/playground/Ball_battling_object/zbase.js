let BALL_BATTLIING_OBJECTS = [];

class Ball_battling_object {
    constructor() {
        BALL_BATTLIING_OBJECTS.push(this);

        this.has_called_start = false;  //  是否执行过start函数
        this.timedelta = 0; //  当前帧距离上一帧的时间间隔
    }

    start() {   // 只会在第一帧执行一次

    }

    update() {  // 每一帧都会执行一次

    }

    on_destroy() {  // 在被销毁前执行一次

    }

    destroy () {    // 删除该物体
        this.on_destroy();

        for(let i = 0; i < BALL_BATTLIING_OBJECTS.length; i ++) {
            if(BALL_BATTLIING_OBJECTS[i] === this)
            {
                BALL_BATTLIING_OBJECTS.splice(i, 1);
                break;
            }
        }
    }

}

let last_timestamp;
let BALL_BATTLIING_ANIMATION = function(timestamp){
    for(let i = 0; i < BALL_BATTLIING_OBJECTS.length; i ++ ) {
        let obj = BALL_BATTLIING_OBJECTS[i];
        if(!obj.has_called_start) {
            obj.start;
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(BALL_BATTLIING_ANIMATION);
};


requestAnimationFrame(BALL_BATTLIING_ANIMATION);
