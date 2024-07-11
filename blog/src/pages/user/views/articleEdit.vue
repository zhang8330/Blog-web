<template>
 <div>
   <el-page-header
   @back="goBack"
   ></el-page-header>
   <globalEditor @publishSuccess="goBack"></globalEditor>
 </div>
</template>

<script>
import globalEditor from "@/components/globalEditor";
export default {
  name: "articleEdit",
  components:{
    globalEditor
  },
  methods:{
    goBack(){
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>

</style>