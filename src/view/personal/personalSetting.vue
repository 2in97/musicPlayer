<template>
      <div class="setting-part">
        <p class="title">个人资料</p>
        <el-form :model="info" class="setting-form" ref="ruleForm">
          <el-form-item label="头像" style="padding-top:50px">
            <el-upload
              class="avatar-uploader"
              ref="uploadAvatar"
              action="http://localhost:8080/file/upload2"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :auto-upload="false"
              :on-change="changeAvatar"
              :on-success="handleAvatarSuccess_update"
            >
              <el-avatar :size="180" :src="info.avatar"></el-avatar>
            </el-upload>
          </el-form-item>
          <el-row>
            <el-col style="width:400px; margin-right:50px">
              <el-form-item
                label="昵称"
                prop="username"
                :rules="[
      { required: true, message: '昵称不能为空',trigger: 'blur'},
    ]"
              >
                <el-input v-model="info.username"></el-input>
              </el-form-item>
            </el-col>
            <el-col style="width:400px;margin-right:50px">
              <el-form-item label="性别">
                <el-select v-model="info.sex" style="    width: 100%">
                  <el-option label="男" value="男"></el-option>
                  <el-option label="女" value="女"></el-option>
                  <el-option label="保密" value="保密"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col style="width:400px;">
              <el-form-item label="年龄">
                <el-select v-model="info.age" style="    width: 100%">
                  <el-option v-for="i in 100" :key="i" :label="i" :value="i"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="简介">
            <el-input v-model="info.introduction" type="textarea" :rows="3"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
</template>
<script>
import qs from "qs";


export default {
  data() {
    return {
      info: {},
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      let phone = sessionStorage.getItem("tel");
      this.$axios
        .post(
          "http://localhost:8080/user/getInfo",
          qs.stringify({
            tel: phone
          })
        )
        .then(res => {
          this.info = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              "http://localhost:8080/user/updateInfo",
              qs.stringify({
                tel: this.info.tel,
                username: this.info.username,
                avatar: this.info.avatar,
                introduction: this.info.introduction,
                sex: this.info.sex,
                age: this.info.age
              })
            )
            .then(res => {
              window.location.reload();
            })
            .catch(err => {
              console.log(err);
              this.$message.error("提交失败！");
            });
        }
      });
    },
    toPersonal(){
      this.$router.push("/personalCenter")
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        setTimeout(() => {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }, 1000);
      }
      return isJPG && isLt2M;
    },
    changeAvatar(file, fileList) {
      this.info.avatar = URL.createObjectURL(file.raw);
    },
    handleAvatarSuccess_update(res, file) {
      this.info.avatar = res.url[0];
      this.onSubmit("ruleForm");
    },
    submit() {
      this.$refs.uploadAvatar.submit();
    }
  }
};
</script>
<style scoped>
.avatar-uploader >>> .el-upload__input {
  display: none;
}
.setting-part {
  width: 1300px;
  margin: auto;
  padding-top: 30px;
}
.title {
  font: 20px bolder;
}

</style>
