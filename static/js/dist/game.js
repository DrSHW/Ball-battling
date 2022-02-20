class Ball_battling_Menu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
        <div class="bb-game-menu">
            <div class="bb-game-menu-field">
                <div class="bb-game-menu-field-item bb-game-menu-field-item-solo-mode">
                    单人模式
                </div>
                <br>
                <div class="bb-game-menu-field-item bb-game-menu-field-item-muti-mode">
                    多人模式
                </div>
                <br>
                <div class="bb-game-menu-field-item bb-game-menu-field-item-settings">
                    退出
                </div>
                <br>
            </div>
        </div>
        `);
        this.$menu.hide();
        this.root.$bb_game.append(this.$menu);
        this.$solo_mode = this.$menu.find('.bb-game-menu-field-item-solo-mode');
        this.$muti_mode = this.$menu.find('.bb-game-menu-field-item-muti-mode');
        this.$settings = this.$menu.find('.bb-game-menu-field-item-settings');

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let self = this;
        this.$solo_mode.click(function(){
            self.hide();
            self.root.playground.show();
        });
        this.$muti_mode.click(function(){
            console.log("2");
        });
        this.$settings.click(function(){
            self.root.settings.logout_on_remote();
        });
    }
    
    show() {    // 显示 menu 界面
        this.$menu.show();
    }

    hide() {    // 隐藏 menu 界面
        this.$menu.hide();
    }
}
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
class GameMap extends Ball_battling_object {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext("2d");
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start() {

    }

    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); 
    }
}
class Particle extends Ball_battling_object {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.friction = 0.9;
        this.epx = 0.1;
    }

    start() {

    }

    update() {  
        if(this.move_length < this.epx || this.speed < this.epx) {
            this.destroy();
            return false;
        }
        
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}class Player extends Ball_battling_object {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.friction = 0.9;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;
        this.spent_time = 0;

        this.cur_skill = null;

        if(this.is_me) {
            this.img = new Image();
            this.img.src = this.playground.root.settings.photo;
        }

        this.start();
    }

    start() {
        if(this.is_me) {
            this.add_listening_events();
        } else {
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {
        let self = this;
        this.playground.game_map.$canvas.on("contextmenu", function(){ // 关闭画布上的鼠标监听右键
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e) {
            if(e.which === 3) {
                self.move_to(e.clientX, e.clientY);
            } else if(e.which === 1) {
                if(self.cur_skill === "fireball") {
                    self.shoot_fireball(e.clientX, e.clientY);
                }
                self.cur_skill = null;
            }
        });

        $(window).keydown(function(e){
            if(e.which === 81) {    // Q
                self.cur_skill = "fireball";
                return false;
            } 
        });
    }

    shoot_fireball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - y, tx - x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;
        let damage = this.playground.height * 0.01;
        new FireBall(this.playground, this, x, y, radius, vx, vy, speed, color, move_length, damage);
    }

    get_dist(x1, y1, x2, y2) {      // 求欧几里得距离
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    is_attacked(angle, damage) {
        for(let i = 0; i < 15 + Math.random() * 5; i ++ ) {     //  粒子效果
            let x = this.x, y = this.y;
            let radius = this.radius * Math.random() * 0.1;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle);
            let vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }

        this.radius -= damage;
        if(this.radius < 10) {
            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 60;
        this.speed *= 0.9;
    }

    update() {
        this.spent_time += this.timedelta / 1000;
        if(!this.is_me && this.spent_time > 5 && Math.random() < 1 / 300.0) {
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
            while(player === this)
                player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
            let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 0.3;
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 0.3;
            this.shoot_fireball(tx, ty);
        }

        if(this.damage_speed > 20)
        {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        } else {
            if(this.move_length < this.eps)
            {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if(!this.is_me) {
                    let tx = Math.random() * this.playground.width;
                    let ty = Math.random() * this.playground.height;
                    this.move_to(tx, ty);
                }
            } else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
        this.render();
    }

    render() {
        if(this.is_me) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2); 
            this.ctx.restore();
        }
        else {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }

    on_destroy () {    // 删除该物体
        for(let i = 0; i < this.playground.players.length; i ++) {
            if(this.playground.players[i] === this)
            {
                this.playground.players.splice(i, 1);
                break;
            }
        }
    }
}
class FireBall extends Ball_battling_object {
    constructor(playground, player, x, y, radius, vx, vy, speed, color, move_length, damage) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.player = player;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.1;
    }

    start() {

    }

    update() {
        if(this.move_length < this.eps)
        {
            this.destroy();
            return false;
        }
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
        for(let i = 0; i < this.playground.players.length; i ++ ) {
            let player = this.playground.players[i];
            if(this.player !== player && this.is_collision(player)) {
                this.attack(player);
            } 
        }
        this.render();
    }

    get_dist(x1, y1, x2, y2) {      // 求欧几里得距离
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
    
    is_collision(obj) {
        let dist = this.get_dist(this.x, this.y, obj.x, obj.y);
        if(dist < this.radius + obj.radius)
            return true;
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);
        this.destroy();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class Ball_battling_Playground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
        <div class="bb-game-playground"></div>
        `);

        this.hide();
        
        this.start();
    }

    get_random_color() {
        let colors = ["hotpink", "yellow", "cornflowerblue", "darkcyan", "springgreen"];
        return colors[Math.floor(Math.random() * 5)];
    }

    start() {
        
    }

    show() {    // 显示 playground 界面
        this.$playground.show();
        this.root.$bb_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));
        for(let i = 0; i < 5; i ++)
        {
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, this.get_random_color(), this.height * 0.15, false))
        }
    }

    hide() {    // 隐藏 playground 界面
        this.$playground.hide();
    }
}
class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB"
        if(this.root.BBOS) 
            this.platform = "ACAPP"
        this.username = ""
        this.photo = ""
        
        this.$settings = $(`
        <div class="bb-game-settings">
            <div class="bb-game-settings-login">
                <div class="bb-game-settings-title">登录</div>
                <div class="bb-game-settings-username">
                    <div class="bb-game-settings-item">
                        <input type="text" placeholder="用户名" />
                    </div>
                </div>
                <div class="bb-game-settings-password">
                    <div class="bb-game-settings-item">
                        <input type="password" placeholder="密码" />
                    </div>
                </div>
                <div class="bb-game-settings-submit">
                    <div class="bb-game-settings-item">
                        <button>登录</button>
                    </div>
                </div>
                <div class="bb-game-settings-error-messages">
                <!--    -->
                </div>
                <div class="bb-game-settings-option">
                    注册
                </div>
                <div class="bb-game-settings-acwing">
                    <img width="30" src="https://app1566.acapp.acwing.com.cn/static/images/settings/acwing_logo.png" />
                    <br/><br/>
                    <div>
                        AcWing一键登录
                    </div>
                </div>
            </div>
            <div class="bb-game-settings-register">
                <div class="bb-game-settings-title">注册</div>
                <div class="bb-game-settings-username">
                    <div class="bb-game-settings-item">
                        <input type="text" placeholder="用户名" />
                    </div>
                </div>
                <div class="bb-game-settings-password bb-game-settings-password-first">
                    <div class="bb-game-settings-item">
                        <input type="password" placeholder="密码" />
                    </div>
                </div>
                <div class="bb-game-settings-password bb-game-settings-password-second">
                    <div class="bb-game-settings-item">
                        <input type="password" placeholder="确认密码" />
                    </div>
                </div>
                <div class="bb-game-settings-submit">
                    <div class="bb-game-settings-item">
                        <button>注册</button>
                    </div>
                </div>
                <div class="bb-game-settings-error-messages">
                <!--    -->
                </div>
                <div class="bb-game-settings-option">
                    登录
                </div>
                <br/>
                <div class="bb-game-settings-acwing">
                    <img width="30" src="https://app1566.acapp.acwing.com.cn/static/images/settings/acwing_logo.png" />
                    <br/><br/>
                    <div>
                        AcWing一键登录
                    </div>
                </div>
            </div>
        </div>
        `);
        this.$login = this.$settings.find(".bb-game-settings-login");
        this.$login.hide();
        this.$login_username = this.$login.find(".bb-game-settings-username input"); // 用户名输入框
        this.$login_password = this.$login.find(".bb-game-settings-password input"); // 密码输入框
        this.$login_submit = this.$login.find(".bb-game-settings-submit button"); // 提交按钮
        this.$login_error_message = this.$login.find(".bb-game-settings-error-messages"); // 错误信息
        this.$login_register = this.$login.find(".bb-game-settings-option"); // 注册选项

        this.$register = this.$settings.find(".bb-game-settings-register");
        this.$register.hide();
        this.$register_username = this.$register.find(".bb-game-settings-username input"); 
        this.$register_password = this.$register.find(".bb-game-settings-password-first input"); 
        this.$register_password_confirm = this.$register.find(".bb-game-settings-password-second input"); // 确认密码输入框
        this.$register_submit = this.$register.find(".bb-game-settings-submit button");
        this.$register_error_message = this.$register.find(".bb-game-settings-error-messages");
        this.$register_login = this.$register.find(".bb-game-settings-option"); // 登陆选项

        
        this.root.$bb_game.append(this.$settings);

        this.start();
    }

    start() {
        this.getinfo();
        this.add_listening_events();
    }

    add_listening_events()
    {
        this.add_listening_events_register(); // 注册页面的监听
        this.add_listening_events_login(); // 登陆页面的监听
    }

    add_listening_events_register()
    {
        let self = this;

        this.$register_login.click(function(){ // 在注册页面点击登录选项就打开登录界面
            self.login(); 
        });
    }

    add_listening_events_login()
    {
        let self = this;

        this.$login_register.click(function(){ // 在登录页面点击注册选项就打开注册界面
            self.register();    
        });
        this.$login_submit.click(function(){
            self.login_on_remote();
        });
        this.$register_submit.click(function(){
            self.register_on_remote();
       });
    }

    register_on_remote() // 在远程服务器上登录
    {
        let self = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();

        this.$register_error_message.empty();

        $.ajax({
            url: "https://app1566.acapp.acwing.com.cn/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function(resp){
                console.log(resp);
                if(resp.result === "success") {
                    location.reload();
                } else {
                    self.$register_error_message.html(resp.result);
                }
            }
        });
    }

    login_on_remote() // 在远程服务器上登录
    {
        let self = this;

        let username = this.$login_username.val(); // 获取输入框中的用户名
        let password = this.$login_password.val(); // 获取输入框中的密码

        this.$login_error_message.empty(); // 清楚错误信息

        $.ajax({
            url: "https://app1566.acapp.acwing.com.cn/settings/login", // 访问url
            type: "GET",
            data: {
                username: username, // 传输数据
                password: password, 
            },
            success: function(resp){
                // console.log(resp.result);
                if (resp.result === "success")
                {
                    location.reload(); // 如果成功了就刷新
                }
                else
                {
                    self.$login_error_message.html(resp.result); // 如果失败了就显示错误信息
                }
            }
        });
    }

    logout_on_remote() // 在远程服务器上登出
    {
        if (this.platform === "ACAPP") return false; // 如果在ACAPP退出就直接退出

        $.ajax({
            url: "https://app1566.acapp.acwing.com.cn/settings/logout", // 访问url
            type: "GET",
            success: function(resp){
                // console.log(resp); // 测试输出
                if (resp.result === "success")
                {
                    location.reload(); // 如果成功了就直接刷新
                }
            }
        });
    }

    register() // 打开注册页面
    {
        this.$login.hide();
        this.$register.show();
    }

    login() // 打开登录页面
    {
        this.$register.hide();
        this.$login.show();
    }

    getinfo() {
        let self = this; 
        $.ajax({ // 发送一个请求
            url: "https://app1566.acapp.acwing.com.cn/settings/getinfo/", // 获取信息的URL
            type: "GET", // 获取方式类型
            data: {
                platform: self.platform, // 平台信息
            },
            success: function(resp){ // resp是发送请求之后返回的响应
                console.log(resp); // 测试，成功之后写入下面的
                if (resp.result === "success")
                {
                    self.username = resp.username;
                    self.photo = resp.photo;
                    self.hide();
                    self.root.menu.show(); // 并显示游戏菜单
                }
                else
                { 
                    self.login(); // 如果没有登录就打开这个登录页面
                }
            }
        });
    }

    hide()
    {
        this.$settings.hide();
    }

    show()
    {
        this.$settings.show();
    }

}
export class Ball_battling {
    constructor(id, BBOS) {
        this.id = id;
        this.$bb_game = $('#' + id);

        this.BBOS = BBOS;
        this.menu = new Ball_battling_Menu(this);
        this.playground = new Ball_battling_Playground(this);
        this.settings = new Settings(this);

        this.start();
    }

    start() {

    }
}