<template>
  <div>
    <el-page-header
        @back="goBack"
        :content="blogData.title"
    ></el-page-header>
    <el-card class="box-card" style="margin-top: 20px;">
      <div slot="header" class="clearfix">
        <el-row :gutter="10">
          <el-col :span="2">
            <el-avatar
                :src="blogData.authorInformation.myAvatar">
            </el-avatar>
          </el-col>
          <el-col :span="6">
            <span>{{ blogData.authorInformation.name }}</span>
            <br>
            <span>{{ blogData.lastModifiedTime | transformTime }}</span>
          </el-col>
          <el-col :span="8" :offset="8">
            <el-button
                type="warning"
                :icon="userData.userDetails.likes.includes(blogId)?'el-icon-star-on':'el-icon-star-off'"
                circle
                @click="switchLike"
            ></el-button>
            <el-button
                type="primary"
                :icon="userData.userDetails.stars.includes(blogData.authorInformation.name)?'el-icon-circle-check':'el-icon-circle-plus-outline'"
                @click="switchStars"
                v-if="!(blogData.authorInformation.name === userData.userName)"
            >关注
            </el-button>
            <el-button
                type="danger"
                icon="el-icon-circle-close"
                @click="switchBlackList"
                v-if="!(blogData.authorInformation.name === userData.userName)"
            >{{ userData.userDetails.blacklist.includes(blogData.authorInformation.name) ? '已拉黑' : '拉黑' }}
            </el-button>
            <el-button
                type="danger"
                icon="el-icon-warning-outline"
                @click="switchTipOff"
            >举报</el-button>
          </el-col>
        </el-row>
      </div>
      <div>
        <div v-html="blogData.content"></div>
        <div style="margin-top: 20px">
          <el-tag type="success" v-for="(tag,index) in blogData.tags" :key="index" style="margin-right:20px">{{
              tag
            }}
          </el-tag>
        </div>
        <div style="margin-top: 20px">
          <el-row :gutter="10">
            <el-col :span="2"><i class="el-icon-place"></i>{{ blogData.likes }}</el-col>
            <el-col :span="2"><i class="el-icon-view"></i>{{ blogData.views }}</el-col>
            <el-col :span="2"><i class="el-icon-chat-square"></i>{{ blogData.comments.length }}</el-col>
          </el-row>
        </div>
      </div>
      <el-divider><i class="el-icon-chat-square"></i></el-divider>
      <globalComments
          :blog-id="blogId"
          :comments="blogData.comments"
      ></globalComments>
    </el-card>
    <el-dialog
        title="举报信息"
        :visible.sync="isShowTipOff"
        width="30%"
    >
      <el-input v-model="tipOffReason" placeholder="举报原因" type="textarea"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowTipOff = false">取 消</el-button>
        <el-button type="primary" @click="switchTipOff">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import blogService from "@/service/blogService";
import userDetailsService from "@/service/userDetailsService";
import tipOffService from "@/service/tipOffService";
import globalComments from "@/components/globalComments";

export default {
  name: "articleDetail",
  components:{
    globalComments
  },
  data() {
    return {
      blogId: "",
      blogData: {
        title: "",
        authorInformation: {
          userName: "",
          myAvatar: ""
        },
        description: "",
        comments: [],
        cover: "",
        views: 0,
        likes: 0,
        lastModifiedTime: "",
        tags: []
      },
      userData: JSON.parse(sessionStorage.getItem("userData")),
      tipOffReason:"无",
      isShowTipOff:false
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    switchTipOff(){
      this.isShowTipOff = !this.isShowTipOff;
      if(!this.isShowTipOff){
        const data = {
          blogId:this.blogId,
          description:this.blogData.description,
          cover:this.blogData.cover,
          title:this.blogData.title,
          reason:this.tipOffReason
        };
        tipOffService.tipOffBlog(data).then(()=>{
          this.$message.success("举报成功");
        });
      }
    },
    switchLike() {
      if (this.userData.userDetails.likes.includes(this.blogId)) {
        //取消点赞
        let tempData = JSON.parse(sessionStorage.getItem("userData"));
        tempData.userDetails.likes.splice(tempData.userDetails.likes.indexOf(this.blogId), 1);//从本地数据移除点赞的博客
        sessionStorage.setItem("userData", JSON.stringify(tempData));

        this.userData.userDetails.likes.splice(this.userData.userDetails.likes.indexOf(this.blogId), 1);

        userDetailsService.unLikes({
          blogId: this.blogId
        }).then(rs => {
          if (rs.data.status === 200) {
            this.$message.success("取消点赞成功");
          } else {
            this.$message.error("取消点赞失败");
          }
        })

      } else {
        let tempData = JSON.parse(sessionStorage.getItem("userData"));
        tempData.userDetails.likes.push(this.blogId);//增加点赞的博客
        sessionStorage.setItem("userData", JSON.stringify(tempData));

        this.userData.userDetails.likes.push(this.blogId);
        //点赞
        userDetailsService.setLikes({
          blogId: this.blogId
        }).then(rs => {
          if (rs.data.status === 200) {
            this.$message.success("点赞成功");
          } else {
            this.$message.error("点赞失败");
          }

        })
      }
    },
    switchStars() {
      if (this.userData.userDetails.stars.includes(this.blogData.authorInformation.name)) {
        let tempData = JSON.parse(sessionStorage.getItem("userData"));
        tempData.userDetails.stars.splice(tempData.userDetails.stars.indexOf(this.blogData.authorInformation.name), 1);//从本地数据移除用户名
        sessionStorage.setItem("userData", JSON.stringify(tempData));

        this.userData.userDetails.stars.splice(this.userData.userDetails.stars.indexOf(this.blogData.authorInformation.name), 1);

        userDetailsService.unStars({
          userName: this.blogData.authorInformation.name
        }).then(rs => {
          if (rs.data.status === 200) {
            this.$message.success("取消关注成功");
          } else {
            this.$message.error("取消关注失败");
          }
        })

      } else {
        let tempData = JSON.parse(sessionStorage.getItem("userData"));
        tempData.userDetails.stars.push(this.blogData.authorInformation.name);
        sessionStorage.setItem('userData', JSON.stringify(tempData));
        this.userData.userDetails.stars.push(this.blogData.authorInformation.name);
        userDetailsService.setStars({
          userName: this.blogData.authorInformation.name
        }).then(rs => {
          if (rs.data.status === 200) {
            this.$message.success("关注成功");
          } else {
            this.$message.error("关注失败");
          }

        })
      }
    },
    switchBlackList() {
      if (this.userData.userDetails.blacklist.includes(this.blogData.authorInformation.name)) {
        let tempData = JSON.parse(sessionStorage.getItem("userData"));
        tempData.userDetails.blacklist.splice(tempData.userDetails.blacklist.indexOf(this.blogData.authorInformation.name), 1);//从本地数据移除用户名
        sessionStorage.setItem("userData", JSON.stringify(tempData));

        this.userData.userDetails.blacklist.splice(this.userData.userDetails.blacklist.indexOf(this.blogData.authorInformation.name), 1);

        userDetailsService.unBlackList({
          userName: this.blogData.authorInformation.name
        }).then(rs => {
          if (rs.data.status === 200) {
            this.$message.success("取消拉黑成功");
          } else {
            this.$message.error("取消拉黑失败");
          }
        })
      } else {
        let tempData = JSON.parse(sessionStorage.getItem("userData"));
        tempData.userDetails.blacklist.push(this.blogData.authorInformation.name);

        this.userData.userDetails.blacklist.push(this.blogData.authorInformation.name);
        userDetailsService.setBlackList({
          userName: this.blogData.authorInformation.name
        }).then(rs => {
          if (rs.data.status === 200) {
            this.$message.success("拉黑成功");
          } else {
            this.$message.error("拉黑失败");
          }

        })
      }
    }
  },
  filters: {
    transformTime(time) {
      let blogCreateTime = new Date(time);//获取发布时间
      let currentTime = new Date();
      let offsetTime = currentTime - blogCreateTime;
      let offsetST = offsetTime / 1000;
      let offsetMT = offsetST / 60;
      let offsetHT = offsetMT / 60;
      let offsetDT = offsetHT / 24;
      if (offsetDT >= 365) {
        return `发表于${Math.floor(offsetDT / 365)} 年之前`;
      } else if (offsetDT >= 30 && offsetDT < 365) {
        return `发表于${Math.floor(offsetDT / 30)} 月之前`;
      } else if (offsetDT >= 7 && offsetDT < 30) {
        return `发表于${Math.floor(offsetDT / 7)} 周之前`;
      } else if (offsetDT >= 1 && offsetDT < 7) {
        return `发表于${Math.floor(offsetDT)} 天之前`;
      } else if (offsetHT >= 1) {
        return `发表于${Math.floor(offsetHT)} 小时之前`;
      } else if (offsetMT >= 1) {
        return `发表于${Math.floor(offsetMT)} 分钟之前`;
      } else if (offsetST >= 0) {
        return `发表于${Math.floor(offsetST)} 秒钟之前`;
      }
    }
  },
  created() {
    this.blogId = Number(this.$route.params.id);
    blogService.getBlogById({
      blogId: this.blogId
    }).then(rs => {
      console.log("博客的详细数据", rs.data);
      this.blogData = rs.data.data.blogData;
    });
  }
}
</script>

<style scoped>

</style>