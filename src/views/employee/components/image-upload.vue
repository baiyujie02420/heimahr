<template>
  <el-upload
    class="avatar-uploader"
    action=""
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="uploadImage"
  >
    <!-- show-file-list不展示列表 -->
    <!-- http-request 覆盖默认的上传行为，可以自定义上传的实现 -->
    <img v-if="value" :src="value" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
import COS from 'cos-js-sdk-v5'
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    // :before-upload="beforeAvatarUpload"
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。

    beforeAvatarUpload(file) {
      // jpeg png gif bmp

      const isJPG = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 5 // 5M

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG PNG GIF BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isJPG && isLt2M
    },
    uploadImage(params) {
      console.log(params.file) // 你上传的文件
      // 完成cos对象的初始化
      const cos = new COS({
        SecretId: 'AKIDGQJxMVP2RaYSCgx0NVO3RZT7WfaFeMp2',
        SecretKey: '1nJZfW6bzKUO1OTWKwLWROCl5HFySgfQ'
      })
      cos.putObject({
        Bucket: 'renzi-test-1316969662', // 存储桶名称
        Region: 'ap-nanjing', // 地域名称
        Key: params.file.name, // 文件名称
        StorageClass: 'STANDARD', // 固定值
        Body: params.file // 文件对象
      }, (err, data) => {
        if (data.statusCode === 200 && data.Location) {
          // 拿到了腾讯云返回的地址
          console.log(data.Location)
          // 通过input自定义事件将地址传出去
          this.$emit('input', 'http://' + data.Location)
        } else {
          this.$message.error(err.Message) // 上传失败提示消息
        }
      })
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
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
