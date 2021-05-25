<template>
  <div class="whole">
    <div class="bg-part">
      <img src="../../assets/bg4.jpg" alt class="bg" />
    </div>
    <div class="bg2"></div>
    <div style="height:100%">
      <div class="box">
        <div class="nav-part-left">
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-nav"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :collapse="isCollapse"
            router
          >
            <el-menu-item @click="changeCollapsse">
              <i v-show="isCollapse" class="el-icon-arrow-right"></i>
              <span v-show="isCollapse" slot="title">展开</span>
              <i v-show="!isCollapse" class="el-icon-arrow-left"></i>
              <span v-show="!isCollapse" slot="title">收起</span>
            </el-menu-item>
            <el-menu-item v-for="item in routes" :index="item.path" :key="item.icon">
              <i :class="item.icon"></i>
              <span slot="title">{{item.name}}</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="form-part-right">
          <div class="title">
            <span class="title1">歌手</span>
            <span class="title2">管理</span>
          </div>
          <el-main class="table-center">
            <el-row>
              <el-col :span="12">
                <div class="content-left">
                  <el-button class="delete-bt" @click="toDeleteAll()">删除</el-button>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="content-right">
                  <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
                    <template slot="prepend">歌手</template>
                    <el-button
                      class="search-bt"
                      slot="append"
                      icon="el-icon-search"
                      @click="toSearch"
                    ></el-button>
                  </el-input>
                </div>
              </el-col>
            </el-row>
            <br />
            <br />
            <el-table
              class="song-table"
              :data="artists"
              stripe
              style="width: 100%"
              border
              :row-style="{height:'20px'}"
              :cell-style="{padding:'3px'}"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column label="头像">
                <template slot-scope="scope">
                  <el-popover placement="top-start" title trigger="hover">
                    <img :src="scope.row.avatar" alt style="width: 150px;height: 150px" />
                    <img slot="reference" :src="scope.row.avatar" style="width: 35px;height: 35px" />
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="歌手"></el-table-column>
              <el-table-column prop="language" label="语种"></el-table-column>
              <el-table-column prop="birthday" label="生日"></el-table-column>
              <el-table-column label="操作" width="230">
                <template slot-scope="scope">
                  <el-button @click="editPage(scope.row.id)" icon="el-icon-edit"></el-button>
                  <el-button @click="detailPage(scope.row.id)" icon="el-icon-view"></el-button>
                  <el-button @click="toDelete(scope.row.id)" icon="el-icon-delete"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="currentPage1"
              :page-size="10"
              layout="total, prev, pager, next, jumper"
              :total="page.recordsNum"
              fixed="right"
            ></el-pagination>
          </el-footer>
        </div>
      </div>
      <el-dialog title="详细信息" :visible.sync="dialogTableVisible">
        <el-table :data="artistDetail">
          <el-table-column prop="id" label="编号" width="115"></el-table-column>
          <el-table-column label="头像">
            <template slot-scope="scope">
              <el-popover placement="top-start" title trigger="hover">
                <img :src="scope.row.avatar" alt style="width: 150px;height: 150px" />
                <img slot="reference" :src="scope.row.avatar" style="width: 40px;height: 40px" />
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="歌手"></el-table-column>
          <el-table-column prop="language" label="语种"></el-table-column>
          <el-table-column prop="birthday" label="生日"></el-table-column>
        </el-table>
        <el-table :data="artistDetail">
          <el-table-column prop="detail" label="详细信息"></el-table-column>
        </el-table>
      </el-dialog>

      <el-dialog title="修改" :visible.sync="dialogFormVisible" width="35%">
        <el-form :model="artistUpdate" :rules="rules" ref="ruleForm">
          <el-row>
            <el-col :span="10">
              <el-form-item prop="avatar">
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
                  <img v-if="artistUpdate.avatar" :src="artistUpdate.avatar" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="歌手" prop="name">
                <el-input
                  :disabled="true"
                  v-model="artistUpdate.name"
                  autocomplete="off"
                  style="width:80%"
                ></el-input>
              </el-form-item>
              <el-form-item label="语种" prop="language">
                <el-select v-model="artistUpdate.language" placeholder="请选择" style="width:80%">
                  <el-option
                    v-for="item in language"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生日" prop="birthday">
                <el-date-picker
                  v-model="artistUpdate.birthday"
                  type="date"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="详细信息">
            <el-input
              type="textarea"
              v-model="artistUpdate.detail"
              autocomplete="off"
              style="width:100%"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      routes: [
        { name: "歌曲管理", path: "/songManage", icon: "el-icon-menu" },
        { name: "歌手管理", path: "/artistManage", icon: "el-icon-user-solid" },
        { name: "专辑管理", path: "/albumManage", icon: "el-icon-folder" },
        {
          name: "首页推荐",
          path: "/index_recommend",
          icon: "el-icon-s-platform"
        }
      ],
      isCollapse: false, //导航栏收缩
      playing: false, // 播放状态
      search: "",
      artists: [],
      picAddress: "",
      checkModel: [],
      page: "",
      currentPage1: 1,
      currentPage2: 2,
      artistDetail: [],
      artistUpdate: {},
      artist: {
        avatar: "",
        name: "",
        nation: "",
        birthday: "",
        detail: ""
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      language: [
        { value: "2600", name: "华语" },
        { value: "2601", name: "欧美" },
        { value: "2602", name: "粤语" },
        { value: "2603", name: "日语" },
        { value: "2604", name: "韩语" },
        { value: "2605", name: "其他" }
      ],
      ruleForm: {
        avatar: "",
        artist: "",
        language: "",
        birthday: "",
        detail: ""
      },
      rules: {
        name: [{ required: true, message: "请输入歌手", trigger: "blur" }]
      }
    };
  },
  beforeMount(){
        this.isCollapse=JSON.parse(localStorage.getItem("isCollapse"))
  },
  mounted() {
    this.turnPageByArtist(1, this.serach);
  },
  activated: function() {
    this.turnPageByArtist(1, this.serach);
  },
  methods: {
    changeAvatar(file, fileList) {
      this.artistUpdate.avatar = URL.createObjectURL(file.raw);
    },
    changeCollapsse() {
      if (this.isCollapse) this.isCollapse = false;
      else this.isCollapse = true;
      localStorage.setItem("isCollapse",JSON.stringify(this.isCollapse))
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
    handleSelectionChange(val) {
      this.checkModel = [];
      val.forEach(array => {
        this.checkModel.push(array.id);
      });
      console.log("handleSelectionChange--", this.checkModel);
    },
    handleCurrentChange(val) {
      this.turnPageByArtist(val, this.serach);
    },

    toSearch() {
      this.turnPageByArtist(1, this.serach);
    },
    toDeleteAll() {
      this.$confirm("此操作将永久删除所有歌手及其所有歌曲, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios.get(
          "http://localhost:8080/artist/deleteAllArtists?id=" + this.checkModel
        );
        window.location.reload();
      });
    },
    toDelete(id) {
      this.$confirm("此操作将永久删除该歌手及其所有歌曲, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios.get("http://localhost:8080/artist/deleteArtist?id=" + id);
        window.location.reload();
      });
    },

    turnPageByArtist(pageNum) {
      this.$axios
        .get(
          "http://localhost:8080/artist/getArtistsPerPage?pageNum=" +
            pageNum +
            "&search=" +
            this.search
        )
        .then(res => {
          this.artists = res.data;
        })
        .catch(err => {
          console.log(err);
        });
      this.$axios
        .get("http://localhost:8080/artist/getPage?search=" + this.search)
        .then(res => {
          this.page = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    editPage(sid) {
      this.artistDetail = [];
      for (var i in this.artists) {
        if (this.artists[i].id == sid) {
          this.artistUpdate = this.artists[i];
          console.log(this.artistUpdate);
        }
      }
      this.dialogFormVisible = true;
    },

    detailPage(sid) {
      this.artistDetail = [];
      for (var i in this.artists) {
        if (this.artists[i].id == sid) {
          this.artistDetail.push(this.artists[i]);
        }
      }
      this.dialogTableVisible = true;
    },
    submitUpdate(formName) {
      this.$refs[formName].validate(valid => {
        console.log("10" + this.artistUpdate.avatar);
        if (valid) {
          this.$axios
            .post(
              "http://localhost:8080/artist/updateArtist",
              qs.stringify({
                id: this.artistUpdate.id,
                name: this.artistUpdate.name,
                avatar: this.artistUpdate.avatar,
                language: this.artistUpdate.language,
                birthday: this.artistUpdate.birthday,
                detail: this.artistUpdate.detail
              })
            )
            .then(res => {
              this.$message.success("提交成功！");
              this.dialogFormVisible = false;
              this.turnPageByArtist(this.page.pageNum);
            })
            .catch(err => {
              console.log(err);
              this.$message.error("提交失败！");
            });
        }
      });
    },
    submit() {
      new Promise((resolve, reject) => {
        this.$refs.uploadAvatar.submit();
        setTimeout(() => resolve(), 500);
      }).then(data => {
        this.submitUpdate("ruleForm");
      });
    },
    handleAvatarSuccess_update(res, file) {
      this.artistUpdate.avatar = res.url[0];
    }
  }
};
</script>
<style scoped>
.box {
  overflow: hidden;
  height: 100%;
}
.nav-part-left {
  float: left;
  height: 100%;
  min-height: 100%;
}
.el-menu-vertical-nav:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100%;
  height: 100%;
}
.el-menu-vertical-nav {
  min-height: 100%;
  height: 100%;
}
.bg {
  z-index: -2;
  width: 100%;
  height: 100%;
  position: fixed;
}
.bg2 {
  z-index: -1;
  background: rgba(20, 27, 47, 0.6);
  width: 100%;
  height: 100%;
  position: fixed;
}
.whole {
  top: 0;
  left: 0;
  background-size: cover;
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: auto;
}
.el-container {
  width: 100%;
  margin: auto;
  position: relative;
}
.add-bt {
  background-color: rgba(7, 176, 255, 0.4);
  border-color: rgba(7, 176, 255, 0.4);
  color: white;
  margin-left: 30px;
  border: 1px solid rgb(168, 168, 168);
  width: 120px;
}
.delete-bt {
  background-color: rgba(255, 0, 0, 0.4);
  border-color: rgba(255, 0, 0, 0.4);
  color: white;
  margin-left: 30px;
  border: 1px solid rgb(168, 168, 168);
  width: 120px;
}
.search-bt {
  width: 50px;
}
.search-select {
  width: 100px;
}
.input-with-select {
  width: 500px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.upload-song >>> .el-upload__input {
  display: none !important;
}
.upload-song >>> .el-upload-dragger {
  width: 100%;
  height: 130px;
}
.upload-song >>> .el-upload--text {
  width: 100%;
}
.el-button:focus,
.el-button:hover {
  color: white;
  border-color: white;
  background-color: rgba(0, 0, 0, 0.2);
}
.title {
  text-align: center;
  padding-top: 20px;
}
.title1 {
  font: 20px bold;
  color: white;
  text-align: center;
}
.title2 {
  font: 20px bold;
  color: #ff9102;
  text-align: center;
}
.song-table {
  background-color: rgba(0, 0, 0, 0.2);
}
.el-pagination {
  float: right;
}
.el-pagination >>> .el-pagination__total {
  color: white;
}
.el-pagination >>> .el-pagination__jump {
  color: white;
}
.content-left {
  float: left;
}
.content-right {
  float: right;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 180px;
  margin-top: 10%;
  margin-left: 8%;
}
.avatar-uploader >>> .el-upload__input {
  display: none;
}
.upload-lyric >>> .el-upload__input {
  display: none;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
