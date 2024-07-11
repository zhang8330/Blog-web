<template>
  <div>
    <el-card class="box-card" v-for="(commentsItem,index) in commentsList" :key="index" style="margin-bottom: 20px;">
      <div slot="header" class="clearfix">
        <el-row :gutter="10">
         <el-col :span="10">
           <h3 @click="goBlogDetails(commentsItem.blogId)">{{commentsItem.blogData.title}}</h3>
         </el-col>
          <el-col :span="14" style="text-align: right;">
            <el-avatar :src="commentsItem.blogData.authorInformation.myAvatar"></el-avatar>
            <br>
            <span>{{commentsItem.blogData.authorInformation.name}}</span>
          </el-col>
        </el-row>
      </div>
      <div v-for="(item,index) in commentsItem.commentsData" :key="index" style="margin-bottom: 20px;">
        <el-row :gutter="10">
         <el-col :span="2">
           <el-avatar :src="item.userData.myAvatar"></el-avatar>
         </el-col>
         <el-col :span="22" style="box-shadow: 0 0 2px 2px #eceff3 ">
           <div style="padding: 10px;">
             {{item.content}}
           </div>
         </el-col>
        </el-row>
      </div>
    </el-card>
    <el-pagination
        layout="prev, pager, next"
        :page-size="params.limit"
        :total="totalNum"
        @current-change="changePage"
    >
    </el-pagination>
  </div>
</template>

<script>
import userDetailsService from "@/service/userDetailsService";

export default {
  name: "myComment",
  data() {
    return {
      commentsList: [],
      params: {
        limit: 5,
        offset: 0
      },
      totalNum: 0,
    }
  },
  created() {
    this.getBlogData()
  },
  methods: {
    getBlogData() {
      userDetailsService.getCommentsList(this.params).then(rs => {
        this.totalNum = rs.data.data.totalNum;
        this.commentsList = rs.data.data.commentsList;
      })
    },
    changePage(page){
      this.params.offset = (page - 1)*this.params.limit;
      this.getBlogData();
    },
    goBlogDetails(blogId){
      this.$router.push(`/article/${blogId}`);
    }
  }
}
</script>

<style scoped>

</style>