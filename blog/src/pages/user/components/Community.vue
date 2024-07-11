<template>
  <div>
    <globalArticles
        v-for="(blogItem, index) of blogList"
        :article-data="blogItem"
        :key="index"
    ></globalArticles>
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
import globalArticles from "@/components/globalArticles";
import blogService from "@/service/blogService";

export default {
  name: "Community",
  components: {
    globalArticles
  },
  data() {
    return {
      blogList: [],
      params: {
        limit: 2,
        offset: 0
      },
      totalNum: 0
    }
  },
  created() {
    this.getBlogData()
  },
  methods: {
    getBlogData() {
      blogService.getPublicBlog(this.params).then(rs => {
        console.log("博客数据", rs.data.data);
        this.totalNum = rs.data.data.totalNum;
        this.blogList = rs.data.data.blogList;
      })
    },
    changePage(page){
      this.params.offset = (page - 1)*this.params.limit;
      this.getBlogData();
    }
  }
}
</script>

<style scoped>

</style>