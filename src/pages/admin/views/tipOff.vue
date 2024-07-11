<template>
  <div>
    <el-table
        :data="tipOffData"
        style="width: 100%">
      <el-table-column
          prop="blogId"
          label="博客ID"
          width="180">
      </el-table-column>
      <el-table-column
          prop="title"
          label="博客标题"
          width="180">
      </el-table-column>
      <el-table-column
          prop="cover"
          label="博客封面"
          width="180">
        <template slot-scope="scope">
          <el-image :src="scope.row.cover"  style="width:180px;"></el-image>
        </template>
      </el-table-column>
      <el-table-column
          prop="description"
          label="博客简介"
          width="180">
      </el-table-column>
      <el-table-column
          prop="reason"
          label="举报原因">
      </el-table-column>
      <el-table-column
          label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="goDetail(scope.row)" size="small">详情</el-button>
          <el-button type="primary" @click="ignoreTipOff(scope.row)" size="small">忽略</el-button>
          <el-button type="danger" @click="rejectedBlog(scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import tipOffService from "@/service/tipOffService";
export default {
  name: "tipOff",
  data(){
    return {
      tipOffData:[],
      searchParams:{
        limit:10,
        offset:0,
      },
      totalNum:0
    }
  },
  created(){
   this.getTipOffData();
  },
  methods:{
    getTipOffData(){
      tipOffService.getTipOffData(this.searchParams).then(rs=>{
        this.totalNum = rs.data.data.totalNum;
        this.tipOffData = rs.data.data.tipOffData;
      })
    },
    goDetail(row){
      this.$router.push(`/article/${row.blogId}`);
    },
    ignoreTipOff(article) {
      tipOffService.ignoreTipOffDataById({
        tipOffId: article._id
      }).then(rs => {
        if (rs.status === 200) {
          this.$message.success("忽略成功");
          this.getTipOffData();
        }
      })
    },
    rejectedBlog(article) {
      tipOffService.deleteTipOffDataById({
        tipOffId: article._id
      }).then(rs => {
        if (rs.status === 200) {
          this.$message.success("删除成功");
          this.getTipOffData();
        }
      })
    }
  }
}
</script>

<style scoped>
</style>