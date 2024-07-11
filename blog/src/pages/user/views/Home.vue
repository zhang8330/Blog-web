<template>
  <el-container>
    <el-header
    style="border-bottom:1px solid dimgray;padding:10px 0;margin-bottom: 15px;"
    >
      <el-row :gutter="10">
       <el-col
           :offset="3"
           :span="18"
            style="display: flex; align-items: center; justify-content: space-between"
       ><img src="@/assets/logo.png" style="height: 30px" alt="">
         <el-input
             v-model="searchStr"
             placeholder="请输入要搜索的博客标题"
             style="width:60%;"
             @keypress.enter.native="goBlogListPage"
         >
           <el-button type="primary" slot="append" icon="el-icon-search" @click="goBlogListPage"></el-button>
         </el-input>
         <el-dropdown v-if="hasPermission" @command="handleSelectSetting">
           <el-avatar
           :src = "userData.myAvatar"
           :title = "userData.userName"
           fit = "scale-down"
           shape="square"
           >

           </el-avatar>
           <el-dropdown-menu slot="dropdown">
             <el-dropdown-item disabled>{{ userData.userName }}</el-dropdown-item>
             <el-dropdown-item command="setting">设置</el-dropdown-item>
             <el-dropdown-item command="signOut">退出</el-dropdown-item>
           </el-dropdown-menu>
         </el-dropdown>
         <el-link type="primary" href="login.html" v-if="!hasPermission">登录</el-link>
         <el-button type="text" icon="el-icon-s-promotion" v-if="hasPermission" @click="goChatHome">小树洞</el-button>
         <el-button type="text" icon="el-icon-edit-outline" v-if="hasPermission" @click="moveToEditArticle">写文章</el-button>
         <el-button type="text" icon="el-icon-s-platform" v-if="isAdmin" @click="goAdmin">站点管理系统</el-button>
       </el-col>

      </el-row>
    </el-header>
    <el-container>
      <el-aside witdh="300px" v-if="hasPermission">
        <userInfo :user-data="userData"></userInfo>
      </el-aside>
      <el-main>
        <el-tabs v-model="activeName" @tab-click="switchTab">
          <el-tab-pane label="广场" name="articles">
            <Community></Community>
          </el-tab-pane>
          <el-tab-pane label="我的文章" name="myself">
            <myBlog></myBlog>
          </el-tab-pane>
          <el-tab-pane label="赞过" name="likes">
            <myLikeBlog></myLikeBlog>
          </el-tab-pane>
          <el-tab-pane label="评论" name="comments">
            <myComment></myComment>
          </el-tab-pane>
          <el-tab-pane label="关注" name="attentions">
            <myStar></myStar>
          </el-tab-pane>
          <el-tab-pane label="黑名单" name="blacklist">
            <myBlackList></myBlackList>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <el-dialog
        title="更新用户信息"
        :visible.sync="isShowSetting"
        width="60%"
        >
      <userSetting></userSetting>
    </el-dialog>
  </el-container>
</template>

<script>
import userService from "@/service/userService";
import userInfo from "@/pages/user/components/userInfo";
import Community from "@/pages/user/components/Community";
import myBlog from "@/pages/user/components/myBlog";
import myLikeBlog from "@/pages/user/components/myLikeBlog";
import myComment from "@/pages/user/components/myComment";
import myStar from "@/pages/user/components/myStar";
import myBlackList from "@/pages/user/components/myBlackList";
import userSetting from "@/pages/user/components/userSetting";
import defaultConfig from "@/config/configDefault";
export default {
  name: "Home",
  components:{
    userInfo,
    Community,
    myBlog,
    myLikeBlog,
    myComment,
    myStar,
    myBlackList,
    userSetting
  },
  data(){
    return {
      searchStr:"",
      hasPermission:false,
      isAdmin:false,
      userData:{

      },
      activeName:"",
      isShowSetting:false
    }
  },
  created() {
    userService.checkPermission().then(rs=>{
      if(rs.data.status === 200){
        this.hasPermission = true;
        this.userData = rs.data.data.userData;
        this.isAdmin = this.userData.isAdmin;
        sessionStorage.removeItem("userData");
        sessionStorage.setItem("userData",JSON.stringify(this.userData));
      }else {
        //window.location.replace(`${defaultConfig.hostname}/login.html`);
      }
    })
    this.activeName = this.$route.params.module?this.$route.params.module:"articles"
  },
  methods:{
    goAdmin(){
      window.location.replace(`${defaultConfig.hostname}/admin.html`)
    },
    goBlogListPage(){
      if(this.searchStr){
        this.$router.push(`/blogList/${this.searchStr}`);
      }
    },
    goChatHome(){
      this.$router.push("/chatHome");
    },
    moveToEditArticle(){
      this.$router.push("/editArticle");
    },
    switchTab(tab){
      this.$router.push(`/home/${tab.name}`);
    },
    handleSelectSetting(command){
      switch (command){
        case "setting":
          this.isShowSetting = !this.isShowSetting;
          break;
          case "signOut":
            this.signOut();
            break;
      }
    },
    signOut(){
      sessionStorage.removeItem("Authorization");
      window.location.replace(`${defaultConfig.hostname}/login.html`);
    }
  }
}
</script>

<style scoped>

</style>