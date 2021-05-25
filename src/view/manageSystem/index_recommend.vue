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
            <span class="title1">推荐</span>
            <span class="title2">设置</span>
          </div>
          <el-main>
            <div>
              <div>
                <span class="title3">预览</span>
                <div class="scroll_panel">
                  <el-carousel :interval="4000" type="card" height="260px">
                    <el-carousel-item v-for="(item,index) in recommends" :key="index">
                      <img class="scroll_img" :src="item.url" style="width:650px;height:260px" />
                    </el-carousel-item>
                  </el-carousel>
                </div>
                <hr />
                <div style="padding-top:10px">
                  <span class="title3">设置</span>
                  <el-button class="add-bt" @click="addPage()">增加</el-button>
                  <el-button class="delete-bt" @click="toDeleteAll()">删除</el-button>
                  <el-table
                    class="table"
                    :data="recommends"
                    stripe
                    style="width: 100% ;margin-top:10px"
                    border
                    max-height="300"
                    :row-style="{height:'20px'}"
                    :cell-style="{padding:'3px'}"
                    @selection-change="handleSelectionChange"
                  >
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column label="图片">
                      <template slot-scope="scope">
                        <el-popover placement="top-start" title trigger="hover">
                          <img :src="scope.row.url" alt style="width: 360px;height: 150px" />
                          <img
                            slot="reference"
                            :src="scope.row.url"
                            style="width: 70px;height: 35px"
                          />
                        </el-popover>
                      </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注"></el-table-column>
                    <el-table-column label="操作" width="100">
                      <template slot-scope="scope">
                        <el-button @click="toDelete(scope.row.id)" icon="el-icon-delete"></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </el-main>
          <el-footer></el-footer>
        </div>
      </div>
    </div>
    <el-dialog title="新增" :visible.sync="dialogFormVisible" width="35%">
      <el-form :model="recommend" ref="ruleForm">
        <el-upload
          class="upload-recommend"
          ref="upload"
          action="http://localhost:8080/file/upload2"
          :file-list="fileList"
          :before-upload="beforeAvatarUpload"
          :auto-upload="false"
          :on-success="handleAvatarSuccess"
          list-type="picture-card"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
        </el-upload>

        <el-form-item label="详细信息">
          <el-input
            type="textarea"
            v-model="recommend.remark"
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
      img:"",
      fileList:[],
      recommend: {
        img: "",
        remark: ""
      },
      recommends: [

      ],
      dialogFormVisible: false,
      isCollapse: false, //导航栏收缩
      playing: false // 播放状态
    };
  },
  mounted() {
    this.getAllRecommends()
  },
  beforeMount(){
        this.isCollapse=JSON.parse(localStorage.getItem("isCollapse"))
  },
  methods: {
    getAllRecommends(){
      this.$axios
        .get(
          "http://localhost:8080/admin/getAllRecommends"
        )
        .then(res => {
          console.log(res.data);
          this.recommends = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    addPage() {
      this.fileList=[];
      this.recommend.img = "";
      this.recommend.remark = "";
      this.dialogFormVisible = true;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      return isJPG;
    },
    changeCollapsse() {
      if (this.isCollapse) this.isCollapse = false;
      else this.isCollapse = true;
      localStorage.setItem("isCollapse",JSON.stringify(this.isCollapse))
    },
    handleSelectionChange(val) {
      this.checkModel = [];
      val.forEach(array => {
        this.checkModel.push(array.id);
      });
      console.log("handleSelectionChange--", this.checkModel);
    },

    toDeleteAll() {
      this.$confirm("此操作将永久删除所有数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios.get(
          "http://localhost:8080/admin/deleteAllRecommends?id=" + this.checkModel
        );
        window.location.reload();
      });
    },
    toDelete(id) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios.get("http://localhost:8080/admin/deleteRecommend?id=" + id);
        window.location.reload();
      });
    },

    submitUpload(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              "http://localhost:8080/admin/addRecommend",
              qs.stringify({
                img: this.img,
                remark: this.recommend.remark
              })
            )
            .then(res => {
              this.$message.success("提交成功！");
              this.recommends.push({url:this.img,remra1:this.recommend.remark})
              this.dialogFormVisible = false;
            })
            .catch(err => {
              console.log(err);
              this.$message.error("提交失败！");
            });
        }
      });
    },
    submit() {
      this.$refs.upload.submit();
    },
    handleAvatarSuccess(res, file) {
      this.img=res.url[0]
      this.submitUpload("ruleForm");
    }
  }
};
</script>
<style scoped>
.upload-recommend >>> .el-upload__input {
  display: none !important;
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
table {
  background-color: rgba(0, 0, 0, 0.2);
}
.title3 {
  font: 20px bold;
  color: white;
}
.scroll_panel {
  margin: 0 auto;
  width: 1300px;
}
.el-carousel__item {
  width: 50%;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

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
  z-index: -100;
  width: 100%;
  height: 100%;
  position: fixed;
}
.bg2 {
  z-index: -99;
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
</style>
