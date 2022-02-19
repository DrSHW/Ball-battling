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
                <!--
                <div class="bb-game-settings-error-messages">
                    用户名或密码错误！
                </div>
                -->
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
                <div class="bb-game-settings-password">
                    <div class="bb-game-settings-item">
                        <input type="password" placeholder="密码" />
                    </div>
                </div>
                <div class="bb-game-settings-password">
                    <div class="bb-game-settings-item">
                        <input type="password" placeholder="确认密码" />
                    </div>
                </div>
                <div class="bb-game-settings-submit">
                    <div class="bb-game-settings-item">
                        <button>注册</button>
                    </div>
                </div>
                <!--
                <div class="bb-game-settings-error-messages">
                    密码错不一致！
                </div>
                -->
                <div class="bb-game-settings-option">
                    登录
                </div>
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
        this.$register = this.$settings.find(".bb-game-settings-register");
        this.$register.hide();
        this.root.$bb_game.append(this.$settings);

        this.start();
    }

    start() {
        this.getinfo();
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
                    self.root.menu.show(); // 并显示游戏菜单
                }
                else
                { 
                    self.register(); // 如果没有登录就打开这个登录页面
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