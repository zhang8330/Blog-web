<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="文章审核" name="article">
        <el-table
            :data="blogList"
            style="width: 100%">
          <el-table-column
              type="expand"
          >
            <template slot-scope="scope">
              <div v-html="scope.row.content"></div>
            </template>
          </el-table-column>
          <el-table-column
              prop="title"
              label="文章标题"
              width="180"
          >
          </el-table-column>
          <el-table-column
              prop="blogId"
              label="博客ID"
          >
          </el-table-column>
          <el-table-column
              label="封面"
          >
            <template slot-scope="scope">
              <el-image
                  fit="fill"
                  :src="scope.row.cover"
                  style="width:100px;"
              >
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
              label="发布时间"
          >
            <template slot-scope="scope">
              {{ scope.row.lastModifiedTime | transformTime }}
            </template>
          </el-table-column>
          <el-table-column
              prop="description"
              label="简介"
          >
          </el-table-column>
          <el-table-column
              label="tags"
          >
            <template slot-scope="scope">
              <el-tag type="success"
                      v-for="(tag, index) in scope.row.tags"
                      :key="index"
                      style="margin-right: 10px;margin-bottom: 10px;">{{tag}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              label="操作"
              width="180"
          >
            <template slot-scope="scope">
              <el-button type="primary" @click="approvedBlog(scope.row)">通过</el-button>
              <el-button type="danger" @click="rejectedBlog(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="新用户审核" name="user">
        <el-table
            :data="userList"
            style="width: 100%">
          <el-table-column
              prop="userName"
              label="用户名"
              width="180"
          >
          </el-table-column>
          <el-table-column
              prop="myAvatar"
              label="头像"
          >
            <template slot-scope="scope">
              <el-image
                  fit="fill"
                  :src="scope.row.myAvatar"
                  style="width:100px;"
              >
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
              prop="introduction"
              label="用户简介"
          >
          </el-table-column>
          <el-table-column
              label="操作"
              width="180"
          >
            <template slot-scope="scope">
              <el-button type="primary" @click="approvedUser(scope.row)">通过</el-button>
              <el-button type="danger" @click="rejectedUser(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="display: flex;justify-content: center;margin-top:20px;">
          <el-pagination
              layout="prev, pager, next"
              :total="userTotalNum"
              :page-size="searchUserParams.limit"
              @current-change="handlerUserCurrentChange"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import userService from "@/service/userService";
import blogService from "@/service/blogService";

export default {
  name: "Review",
  data() {
    return {
      searchUserParams: {
        limit: 10,
        offset: 0
      },
      userTotalNum: 0,
      userList: [],
      searchBlogParams: {
        limit: 10,
        offset: 0
      },
      blogTotalNum: 0,
      blogList: [],
      activeName: "article"
    }
  },
  created() {
    this.getUserList();
    this.getBlogList();
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
  methods: {
    getBlogList() {
      blogService.getUnapprovedBlog(this.searchBlogParams).then(rs => {
        this.blogTotalNum = rs.data.data.blogTotalNum;
        this.blogList = rs.data.data.blogList;
      })
    },
    approvedBlog(article) {
      blogService.approvedBlog({
        blogId: article.blogId
      }).then(rs => {
        if (rs.status === 200) {
          this.$message.success("批准成功");
          this.getBlogList();
        }
      })
    },
    rejectedBlog(article) {
      blogService.deleteBlog({
        blogId: article.blogId
      }).then(rs => {
        if (rs.status === 200) {
          this.$message.success("删除成功");
          this.getBlogList();
        }
      })
    },
    handlerBlogCurrentChange(page) {
      this.searchBlogParams.offset = (page - 1) * this.searchBlogParams.limit;
      this.getBlogList();
    },

    getUserList() {
      userService.getUnapprovedUserList(this.searchUserParams).then(rs => {
        this.userTotalNum = rs.data.data.userTotalNum;
        this.userList = rs.data.data.userList;
      })
    },
    approvedUser(user) {
      userService.approvedUser({
        key: user.key
      }).then(rs => {
        if (rs.status === 200) {
          this.$message.success("批准成功");
          this.getUserList();
        }
      })
    },
    rejectedUser(user) {
      userService.deleteUser({
        key: user.key
      }).then(rs => {
        if (rs.status === 200) {
          this.$message.success("删除成功");
          this.getUserList();
        }
      })
    },
    handlerUserCurrentChange(page) {
      this.searchUserParams.offset = (page - 1) * this.searchUserParams.limit;
      this.getUserList();
    }
  }
}
</script>

<style scoped>

</style>