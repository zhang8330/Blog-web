<template>
  <div>
    <div
        v-for="(commentsItem, index) in localComments"
        :key="index"
        class="comment-card"
        style="margin-bottom: 20px"
    >
      <el-row :gutter="10">
        <el-col :span="2">
          <el-avatar :src="commentsItem.userData.myAvatar" size="large"></el-avatar>
        </el-col>
        <el-col :span="6" style="font-size: 12px;">
          <span>{{ commentsItem.userData.userName }}</span>
          <br>
          <span>{{ commentsItem.lastModifiedTime | transformTime }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24" style="text-indent: 2em;">
          {{ commentsItem.content }}
        </el-col>
        <el-col :span="24" style="border-left: 1px solid #A9EEF1EE;margin-top: 20px;">
          <div
              v-for="(sonCommentsItem, index) in commentsItem.comments"
              :key="index"
              style="margin: 20px;border-bottom: 1px dashed #A9EEF1EE"
          >
            <el-row :gutter="10">
              <el-col :span="2">
                <el-avatar :src="sonCommentsItem.userData.myAvatar" size="large"></el-avatar>
              </el-col>
              <el-col :span="6" style="color:#f33ff3; font-size: 12px;">
                <span>{{ sonCommentsItem.userData.userName }}</span>
                <br>
                <span>{{ sonCommentsItem.lastModifiedTime | transformTime }}</span>
              </el-col>
              <el-col :span="16" style="text-indent: 2em;color:#DB7093FF;">
                {{ sonCommentsItem.content }}
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-button
              type="text"
              icon="el-icon-chat-square"
              @click="switchComment(commentsItem)"
          >回复
          </el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="commentsItem.isComment">
        <el-col :span="24">
          <el-input v-model="commentsStr" placeholder="请输入评论内容"></el-input>
        </el-col>
        <el-col :span="24" style="text-align: right;margin-top:20px;">
          <el-button type="primary" @click="cancelComment(commentsItem,'son')">取消</el-button>
          <el-button type="primary" @click="addComment(commentsItem,'son')">评论</el-button>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="10" v-if="isComment">
      <el-col :span="24">
        <el-input v-model="articleCommentsStr" placeholder="请输入评论内容"></el-input>
      </el-col>
      <el-col :span="24" style="text-align: right;margin-top:20px;">
        <el-button type="primary" @click="cancelComment(localComments,'father')">取消</el-button>
        <el-button type="primary" @click="addComment(localComments,'father')">评论</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import blogService from "@/service/blogService";

export default {
  name: "globalComments",
  props: {
    comments: {
      type: Array,
      default() {
        return []
      }
    },
    blogId: {
      type: Number,
      default: 0
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
  watch:{
    comments:{
      handler(){
        this.localComments = this.comments.slice(0);
      },
      immediate:true
    }
  },
  data() {
    return {
      articleCommentsStr: "",
      commentsStr: "",
      localComments:[],
      isComment:true,
      userData: JSON.parse(sessionStorage.getItem("userData")),
    }
  },
  methods: {
    switchComment(commentsItem){
      let tmp = commentsItem.isComment;
      this.localComments.forEach((item)=>{
        item.isComment = false;
      })
      commentsItem.isComment = !tmp;
      if(commentsItem.isComment){
        this.isComment = false;
      }else{
        this.isComment = true;
      }
    },
    cancelComment(target, type){
      switch (type){
        case "father":
          this.articleCommentsStr = "";
          break;
          case "son":
            this.commentsStr = "";
            target.isComment = false;
            this.isComment = true;
            break;
      }
    },
    addComment(target, type){
      let commentsData = {
        fatherId:"",
        blogId: this.blogId,
        comments: {}
      }
      switch (type){
        case "father":
          commentsData.fatherId = "";
          commentsData.comments = {
            userData:{
              userName:this.userData.userName,
              myAvatar:this.userData.myAvatar
            },
            content:this.articleCommentsStr,
            isComment:false,
            comments:[]
          }
          this.articleCommentsStr = "";
          break;
        case "son":
          commentsData.fatherId = target.commentId;
          commentsData.comments = {
            userData:{
              userName:this.userData.userName,
              myAvatar:this.userData.myAvatar
            },
            content:this.commentsStr,
          }
          this.commentsStr = "";
          target.isComment = false;
          this.isComment = true;
          break;
      }
      blogService.createBlogComment(commentsData).then(rs =>{
        switch (type){

          case "father":
            target.push(rs.data.data.commentsData);
            break;
          case "son":
            target.comments.push(rs.data.data.commentsData);
            target.isComment = false;
            break;
        }
      })
    }
  }
}
</script>

<style scoped>
.comment-card {
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 6px rgba(0, 0, 0, 0.1);
}
</style>