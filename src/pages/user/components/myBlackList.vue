<template>
  <div>
    <el-card class="box-card" v-for="(blacklistItem,index) in blacklist" :key="index" style="margin-bottom: 20px;">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-avatar :src="blacklistItem.myAvatar"></el-avatar>
          <br>
          <span>{{ blacklistItem.userName }}</span>
        </el-col>
        <el-col :span="14" style="text-align: left;">
          <span>{{ blacklistItem.introduction }}</span>
        </el-col>
        <el-col :span="4">
          <el-button
              type="danger"
              icon="el-icon-circle-close"
              @click="switchBlackList(blacklistItem.userName)"
          >{{ userData.userDetails.blacklist.includes(blacklistItem.userName) ? '已拉黑' : '拉黑' }}
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
  name: "myBlackList",
  data() {
    return {
      blacklist: [],
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
      userDetailsService.getBlackList(this.params).then(rs => {
        this.totalNum = rs.data.data.totalNum;
        this.blacklist = rs.data.data.blacklist;
      })
    },
    switchBlackList(userName) {
      if (this.userData.userDetails.blacklist.includes(userName)) {
        let tempData = JSON.parse(sessionStorage.getItem("userData"));
        tempData.userDetails.blacklist.splice(tempData.userDetails.blacklist.indexOf(userName), 1);//从本地数据移除用户名
        sessionStorage.setItem("userData", JSON.stringify(tempData));
        this.userData.userDetails.blacklist.splice(this.userData.userDetails.blacklist.indexOf(userName), 1);

        userDetailsService.unBlackList({
          userName: userName
        }).then(rs => {
          if (rs.data.status === 200) {
            this.$message.success("取消拉黑成功");
          } else {
            this.$message.error("取消拉黑失败");
          }
        })

      } else {
        let tempData = JSON.parse(sessionStorage.getItem("userData"));
        tempData.userDetails.blacklist.push(userName);

        this.userData.userDetails.blacklist.push(userName);
        userDetailsService.setBlackList({
          userName: userName
        }).then(rs => {
          if (rs.data.status === 200) {
            this.$message.success("拉黑成功");
          } else {
            this.$message.error("拉黑失败");
          }

        })
      }
    },
    changePage(page) {
      this.params.offset = (page - 1) * this.params.limit;
      this.getBlogData();
    },
  }
}
</script>

<style scoped>

</style>