<template>
  <el-card class="box-card" v-loading="isPublishing">
    <div slot="header" class="clearfix">
      <span>写文章</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="publicBlog">发布文章</el-button>
    </div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-upload
            name="blogIllustrations"
            class="avatar-uploader"
            :action="`${defaultConfig.baseApiUrl}/uploadImg`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
        >
          <img v-if="cover" :src="cover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon">文章封面</i>
        </el-upload>
      </el-col>
      <el-col :span="18">
        <el-row :gutter="10" style="margin-bottom: 20px;">
          <el-col :span="24">
            <el-input v-model="title" placeholder="请输入文章标题"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-bottom: 20px;">
          <el-col :span="24">
            <el-input v-model="description" placeholder="请输入文章摘要"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-tag
                :key="tag"
                v-for="tag in tags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
              {{ tag }}
            </el-tag>
            <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <div id="editor" ref="editor"></div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import defaultConfig from "@/config/configDefault";
import Editor from "wangeditor";
import highlight from "highlight.js";
import imgFileService from "@/service/imgFileService";
import blogService from "@/service/blogService";

export default {
  name: "globalEditor",
  data() {
    return {
      defaultConfig,
      title: "",
      description: "",
      tags: [],
      cover: "",
      inputVisible: false,
      inputValue: "",
      editor: null,
      isPublishing: false
    }
  },
  mounted() {
    this.editor = new Editor(this.$refs.editor);//初始化编辑器实例
    this.editor.highlight = highlight;//实现编辑器中代码高亮

    //功能菜单

    //编辑器的尺寸，聚焦，占位符
    this.editor.config.height = 800;
    this.editor.config.zIndex = 1000;
    this.editor.config.placeholder = "请输入文章内容";
    this.editor.config.focus = true;
    //字体颜色 背景色的预设值
    this.editor.config.menus = [
      'head',
      'bold',
      'fontSize',
      'fontName',
      'italic',
      'underline',
      'strikeThrough',
      'indent',
      'lineHeight',
      'foreColor',
      'backColor',
      'link',
      'list',
      'todo',
      'justify',
      'quote',
      'emoticon',
      'image',
      'video',
      'table',
      'code',
      'splitLine',
      'undo',
      'redo',
    ]

    this.editor.config.colors = [
      "#000",
      "#fff",
      "#1eea3f",
      "#15dfdf",
      "#e4f404"
    ]
    //字体种类
    this.editor.config.fontNames = [
      "黑体",
      "宋体"
    ]
    //字号预设值
    this.editor.config.fontSize = {
      'x-small': {name: '10px', value: '1'},
      'small': {name: '13px', value: '2'},
      'normal': {name: '16px', value: '3'},
      'large': {name: '18px', value: '4'},
      'x-large': {name: '24px', value: '5'},
      'xx-large': {name: '32px', value: '6'},
      'xxx-large': {name: '48px', value: '7'},
    }
    //行高
    this.editor.config.lineHeights = [
      "1",
      "1.25",
      "1.5",
      "2"
    ]
    //表情包
    // this.editor.config.emotions = [
    //   {
    //     title:"收藏",
    //     type:"image",
    //     content:[
    //       {
    //         alt:"[hahaha]",
    //         src:"data:image/jpeg;base64,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"
    //       }
    //     ]
    //   }
    // ]
    //支持的编辑语言
    this.editor.config.languageType = [
      "Bash",
      "JavaScript",
      "Java",
      "Html",
      "JSON"
    ]
    //是否支持全屏
    this.editor.config.showFullScreen = true;

    //自定义插入链接的内容的校验
    this.editor.config.linkCheck = function (text, link) {
      //alert("未配置,请再看一眼控制台");
      console.log(text, link);
      //校验逻辑待定
      //通过返回的布尔值来检测链接是否合格
      return true;
    }
    //插入网络图片的内容的校验
    this.editor.config.linkImgCallback = function () {
      //alert("未配置,请再看一眼控制台");
      //校验逻辑待定
      //通过返回的布尔值来检测链接是否合格
      return true;
    }
    //插入图片的校验
    this.editor.config.linkImgCheck = function (imgSrc) {
      console.log(imgSrc);
      return true;
    }
    //插入本地图片，实现本地图片的上传并插入到编辑器中
    this.editor.config.uploadImgMaxSize = 4 * 1024 * 1024;//单位为byte
    this.editor.config.uploadImgMaxLength = 10;//上传图片个数
    this.editor.config.customUploadImg = function (resultFiles, insertImgFn) {
      //resultFiles 相当于是input type=file 所选中的目标
      //insertImgFn 回调函数 ，获取图片的最终地址，插入到编辑器里面
      let imgData = new FormData();
      for (let i = 0, len = resultFiles.length; i < len; i++) {
        imgData.append("blogIllustrations", resultFiles[i]);
      }
      imgFileService.uploadImgFile(imgData).then(rs => {
        for (let i = 0, len = rs.data.data.imgList.length; i < len; i++) {
          insertImgFn(rs.data.data.imgList[i]);
        }

      })
    }

    //粘贴文本的内容处理
    this.editor.config.pasteTextHandle = function (pasteStr) {
      console.log(pasteStr);//只保留纯文本文档
      return pasteStr;
    }

    //编辑器内容的获取 纯文本，html，json

    //编辑器内容的修改
    this.editor.create();//把实例变成元素内容
  },
  methods: {
    handleAvatarSuccess(rs) {
      this.cover = rs.data.imgList[0];
    },
    handleClose(tag) {//删除标签
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
    handleInputConfirm() {
      if (this.inputValue) {
        this.tags.push(this.inputValue);
        this.inputValue = "";
      }
      this.inputVisible = false;
    },
    showInput() {
      this.inputVisible = true;
    },
    publicBlog() {
      let blogData = {
        title: this.title,
        description: this.description,
        tags: this.tags,
        cover: this.cover,
        content: this.editor.txt.html()
      }

      if(this.title&&this.description&&this.tags.length&&this.cover&&blogData.content){
        this.isPublishing = true;
         blogService.createBlog(blogData).then(rs =>{
        if(rs.data.status === 200){
          this.$message.success("发布成功");
          this.$emit("publishSuccess");
        }else{
          this.$message.error("发布失败");
        }
      }).finally(()=>{
        this.isPublishing = false;
      })
      }else{
        //this.$message.warning("信息缺失，请补齐");
      }


      console.log(this.editor.txt.html());
    }
  },
  beforeDestroy() {
    this.editor.destroy();
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

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