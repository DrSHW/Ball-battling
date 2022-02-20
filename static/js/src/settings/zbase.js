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
