<template>
  <div :style="loginBgStyle">
    <div id="slideFix">
      <el-tooltip class="item" effect="dark" content="访问作者github" placement="left">
        <span class="iconfont icon-github" @click="toMyGitHub"></span>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="访问作者csdn" placement="left">
        <span class="iconfont icon-csdn" @click="toMyCSDN"></span>
      </el-tooltip>
    </div>
    <el-row
        :gutter="10"
        style="width: 100%;height: 100%;"
    >
      <el-col :span="10">
        <div class="loginWrapper" v-show="isLogin">
          <h1 style="text-align: center;margin-bottom: 60px">登录</h1>

          <el-form ref="loginForm" :model="loginForm" label-width="100px" :rules="rules">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="loginForm.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="passWord">
              <el-input v-model="loginForm.passWord" placeholder="请输入密码" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="confirmButton" type="primary" @click="submitForm('loginForm')">提交</el-button>
              <el-button class="confirmButton" type="warning" @click="resetForm('loginForm')">重置</el-button>
            </el-form-item>

          </el-form>

          <div style="text-align: right">你可以选择
            <el-button type="primary" @click="changeStatus">注册</el-button>
          </div>
        </div>
        <div class="registerWrapper" v-show="!isLogin">
          <h1 style="text-align: center;margin-bottom: 60px;">注册</h1>
          <el-form ref="registerForm" :model="registerForm" label-width="100px" :rules="rules">
            <el-form-item label="头像" prop="myAvatar">
              <el-upload
                  name="blogIllustrations"
                  class="avatar-uploader"
                  :action="`${defaultConfig.baseApiUrl}/uploadImg`"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
              >
                <img v-if="registerForm.myAvatar" :src="registerForm.myAvatar" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="registerForm.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="passWord">
              <el-input v-model="registerForm.passWord" placeholder="请输入密码" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input v-model="registerForm.confirmPassword" placeholder="请再次输入密码" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="confirmButton" type="primary" @click="submitForm('registerForm')">提交</el-button>
              <el-button class="confirmButton" type="warning" @click="resetForm('registerForm')">重置</el-button>
            </el-form-item>
          </el-form>
          <div style="text-align: right">你可以选择
            <el-button type="primary" @click="changeStatus">登录</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import defaultConfig from "@/config/configDefault";
import userService from "@/service/userService";

export default {
  name: "LoginPage",
  data() {
    let vm = this;

    function validatePassword1(rule, value, cb) {
      if (value === "") {
        cb(new Error("请输入密码"));
      } else {
        if (vm.registerForm.confirmPassword) {
          vm.$refs.registerForm.validateFiled("confirmPassword");
        }
        cb();
      }

    }

    function validatePassword2(rule, value, cb) {
      if (value === "") {
        cb(new Error("请输入密码"))
      } else if (value !== vm.registerForm.passWord) {
        cb(new Error("输入的密码不一致！！"));
      } else cb();
    }

    return {
      defaultConfig,
      isLogin: true,
      loginForm: {
        userName: "",
        passWord: ""
      },
      registerForm: {
        userName: "",
        passWord: "",
        confirmPassword: "",
        myAvatar: ""
      },
      rules: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          }, {
            min: 4,
            max: 10,
            message: "用户名长度应为4~10之间",
            trigger: "blur"
          }
        ],
        passWord: [
          {
            required: true,
            trigger: "blur",
            validator: validatePassword1
          }, {
            min: 6,
            max: 12,
            message: "密码名长度应为6~12之间",
            trigger: "blur"
          }
        ],
        confirmPassword: [
          {
            required: true,
            trigger: "blur",
            validator: validatePassword2
          }, {
            min: 6,
            max: 12,
            message: "密码名长度应为6~12之间",
            trigger: "blur"
          }
        ],
      }
    }
  },
  computed:{
    loginBgStyle(){
      return{
        width:"100vw",
        height:"100vh",
        backgroundImage:`url(${require('@/assets/loginPageBg.jpg')})`
      }
    }
  },
  methods: {
    changeStatus() {
      this.isLogin = !this.isLogin;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //this.$message.success("验证成功");
          if (formName === "loginForm") {
            userService.loginUser(this.loginForm).then(rs => {
              if (rs.data.status === 200) {
                this.$message.success("登录成功");
                sessionStorage.setItem("Authorization", rs.headers.authorization);
                window.location.replace(`${defaultConfig.hostname}/index.html`);
              } else {
                this.$message.error("登录失败："+rs.data.message);
              }
            })
          } else {
            userService.registerUser(this.registerForm).then(rs => {
              if (rs.data.status === 200) {
                sessionStorage.setItem("Authorization", rs.headers.authorization);
                this.$message.success("注册成功："+rs.data.message);
                //window.location.replace(`${defaultConfig.hostname}/index.html`);
              } else {
                this.$message.error("注册失败："+rs.data.message);
              }
            })
          }
        } else {
          this.$message.error("验证失败");
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleAvatarSuccess(rs) {
      console.log('头像上传成功', rs.data.imgList[0]);
      this.registerForm.myAvatar = rs.data.imgList[0];
    },
    toMyGitHub(){
      window.open("https://github.com/zhang8330");
    },
    toMyCSDN(){
      window.open("https://blog.csdn.net/weixin_43539655?spm=1000.2115.3001.5343");
    }

  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  border: 0;
}
.loginWrapper, .registerWrapper {
  width: 80%;
  margin: 40px auto;
  padding: 20px;
  border-radius: 10px;
  background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.9),
      rgba(240, 248, 255, 0.9));
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
span.icon-github{
  font-size:32px;
}
span.icon-csdn{
  font-size:32px;
  color:rgb(221,23,0);
}
.iconfont{
  cursor: pointer;
}
#slideFix{
  position:fixed;
  display: flex;
  flex-direction: column;
  gap:5px;
  top:40%;
  right:0;
  width:40px;
  padding: 5px;
  text-align: center;
  background-color: rgba(230, 232, 238, 0.5);
  z-index: 10;
}
.el-button.confirmButton{
  margin-left: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px !important;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
