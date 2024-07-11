<template>
  <el-form ref="form" :model="userForm" label-width="100px">
    <el-form-item label="头像" prop="myAvatar">
      <el-upload
          name="blogIllustrations"
          class="avatar-uploader"
          :action="`${defaultConfig.baseApiUrl}/uploadImg`"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
      >
        <img v-if="userForm.myAvatar" :src="userForm.myAvatar" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="用户信息" prop="userName">
      <el-input v-model="userForm.introduction" placeholder="请输入用户信息"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm()">提交</el-button>
      <el-button type="warning" @click="resetForm()">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import userService from "@/service/userService";
import defaultConfig from "@/config/configDefault";
export default {
  name: "userSetting",
  data() {
    return {
      userForm: {
        myAvatar: "",
        introduction:""
      },
      defaultConfig
    }
  },
  methods: {
    submitForm() {
      if(this.userForm.myAvatar&&this.userForm.introduction){
        userService.updateUserInfo(this.userForm).then(()=>{
          this.$message.success("用户信息更新");
          this.$router.go(0);
        })
      }else{
        this.$message.error("请先完善信息");
      }
    },
    handleAvatarSuccess(rs) {
      console.log('头像上传成功', rs.data.imgList[0]);
      this.userForm.myAvatar = rs.data.imgList[0];
    },
    resetForm(){
      this.$refs.form.resetFields();
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px !important;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>