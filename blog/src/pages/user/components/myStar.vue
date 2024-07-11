<template>
  <div>
    <el-card class="box-card" v-for="(starsItem,index) in starsList" :key="index" style="margin-bottom: 20px;">
        <el-row :gutter="10">
         <el-col :span="6">
           <el-avatar :src="starsItem.myAvatar"></el-avatar>
           <br>
           <span>{{ starsItem.userName}}</span>
         </el-col>
          <el-col :span="14" style="text-align: left;">
            <span>{{starsItem.introduction}}</span>
          </el-col>
          <el-col :span="4">
            <el-button
                type="primary"
                :icon="userData.userDetails.stars.includes(starsItem.userName)?'el-icon-circle-check':'el-icon-circle-plus-outline'"
                @click="switchStars(starsItem.userName)"
            >关注
            </el-button>
          </el-col>
        </el-row>
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
  name: "myStar",
  data() {
    return {
      starsList: [],
      params: {
        limit: 5,
        offset: 0
      },
      totalNum: 0,
      userData: JSON.parse(sessionStorage.getItem("userData")),
    }
  },
  created() {
    this.getBlogData()
  },
  methods: {
    getBlogData() {
      userDetailsService.getStarsList(this.params).then(rs => {
        this.totalNum = rs.data.data.totalNum;
        this.starsList = rs.data.data.starsList;
      })
    },
    changePage(page){
      this.params.offset = (page - 1)*this.params.limit;
      this.getBlogData();
    },
    switchStars(userName) {
      if (this.userData.userDetails.stars.includes(userName)) {
        let tempData = JSON.parse(sessionStorage.getItem("userData"));
        tempData.userDetails.stars.splice(tempData.userDetails.stars.indexOf(userName), 1);//从本地数据移除用户名
        sessionStorage.setItem("userData", JSON.stringify(tempData));

        this.userData.userDetails.stars.splice(this.userData.userDetails.stars.indexOf(userName), 1);

        userDetailsService.unStars({
          userName: userName
        }).then(rs => {
          if (rs.data.status === 200) {
            this.$message.success("取消关注成功");
          } else {
            this.$message.error("取消关注失败");
          }
        })

      } else {
        let tempData = JSON.parse(sessionStorage.getItem("userData"));
        tempData.userDetails.stars.push(userName);
        sessionStorage.setItem('userData', JSON.stringify(tempData));
        this.userData.userDetails.stars.push(userName);
        userDetailsService.setStars({
          userName: userName
        }).then(rs => {
          if (rs.data.status === 200) {
            this.$message.success("关注成功");
          } else {
            this.$message.error("关注失败");
          }

        })
      }
    },
  }
}
</script>

<style scoped>

</style>