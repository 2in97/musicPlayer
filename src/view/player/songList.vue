<template>
  <div>
    <div class="list-select-part" style="font-size:15px;">
      <el-row>
        <el-col :span="8">
          <i class="el-icon-chat-dot-round" style="font-weight:bold">语种</i>
          <ul>
            <li v-for="item in languages" :key="item.value" class="img_list">
              <el-button  @click="changeTag(item.value)" class="select-bt" size="mini">{{item.name}}</el-button>
            </li>
          </ul>
        </el-col>
        <el-col :span="8">
          <i class="el-icon-headset" style="font-weight:bold">流派</i>
          <ul>
            <li v-for="item in styles" :key="item.value">
              <el-button  @click="changeTag(item.value)" class="select-bt" size="mini">{{item.name}}</el-button>
            </li>
          </ul>
        </el-col>
        <el-col :span="8">
          <i class="el-icon-sunny" style="font-weight:bold">情感</i>
          <ul>
            <li v-for="item in emotions" :key="item.value">
              <el-button  @click="changeTag(item.value)" class="select-bt" size="mini">{{item.name}}</el-button>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
    <div v-if="this.lists.length==0" class="content-box-content">
          <img class="none-img" src="../../assets/noneBox.png" alt />
          <p class="none-content">没有找到相关内容</p>
        </div>
        <div v-if="this.lists.length!=0" class="list-content-part">
          <ul class="list-ul">
            <li
              v-for="item in lists"
              :key="item.id"
              style="padding-top:20px"
             
            ><a  @click="detail(item.lid)">
              <img class="cover" :src="item.cover" alt />
              <p style="font-size:15px;color:grey">{{item.lname}}</p>
              </a>
            </li>
          </ul>
          <el-pagination
            @current-change="handleCurrentChange_list"
            :current-page="currentPage3"
            :page-size="18"
            layout="prev, pager, next"
            :total="lists.length"
            fixed="right"
          ></el-pagination>
        </div>
  </div>
</template>
<script>
import qs from "qs";
import loginDialog from "@/components/loginRegister";

export default {
  components: {
    loginDialog
  },
  data() {
    return {
      page: {},
      currentPage1: 1,
      tag:"",
      languages: [
        { value: "2000", name: "华语" },
        { value: "2001", name: "欧美" },
        { value: "2002", name: "粤语" },
        { value: "2003", name: "日语" },
        { value: "2004", name: "韩语" },
        { value: "2005", name: "其他" }
      ],
      styles: [
        { value: "2200", name: "流行" },
        { value: "2201", name: "摇滚" },
        { value: "2202", name: "民谣" },
        { value: "2203", name: "电子" },
        { value: "2204", name: "影视原声" },
        { value: "2205", name: "ACG" },
        { value: "2206", name: "乡村" },
        { value: "2207", name: "古风" },
        { value: "2208", name: "说唱" },
        { value: "2209", name: "古典" },
        { value: "2210", name: "金属" },
        { value: "2211", name: "其他" }
      ],
      emotions: [
        { value: "2400", name: "快乐" },
        { value: "2401", name: "美好" },
        { value: "2402", name: "安静" },
        { value: "2403", name: "寂寞" },
        { value: "2404", name: "思念" },
        { value: "2405", name: "悲伤" },
        { value: "2406", name: "孤独" },
        { value: "2407", name: "怀旧" },
        { value: "2408", name: "感动" },
        { value: "2409", name: "治愈" },
        { value: "2410", name: "放松" },
        { value: "2411", name: "浪漫" },
        { value: "2412", name: "励志" },
        { value: "2413", name: "清新" },
        { value: "2414", name: "其他" }
      ],
      lists: [
      ]
    };
  },
  mounted() {
    this.getSongLists(1);
  },
  methods: {
    handleCurrentChange(val) {
      this.getSongLists(val, this.tag);
    },
    changeTag(val){
      this.tag=val
      this.getSongLists(1)
    },
    getSongLists(pageNum) {
      this.$axios
        .get(
          "http://localhost:8080/song/getListsPerPage?pageNum=" +
            pageNum +
            "&tag=" +
            this.tag
        )
        .then(res => {
          this.lists = res.data;
        })
        .catch(err => {
          console.log(err);
        });
      this.$axios
        .get(
          "http://localhost:8080/song/getListPage?tag=" +
            this.tag 
        )
        .then(res => {
          this.page = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    detail(val) {
      this.$router.push({
        name: "songListDetail",
        params: { lid: val}
      });
    }
  },
  
};
</script>
<style scoped>
.content-box-content {
  height: 400px;
  position: relative;
}
.el-pagination {
  text-align: center;
}
.none-img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.none-content {
  position: absolute;
  left: 50%;
  top: 70%;
  transform: translate(-50%);
}
.list-content-part {
  width: 1300px;
  margin: 0 auto;
}
.cover {
  width: 240px;
  height: 240px;
  margin-right: 20px;
}
.search-select {
  width: 100px;
}
.img_list {
  display: inline-block;
}
.select-bt {
  margin-right: 5px;
  margin-top: 5px;
  border: 0px;
  border-radius: 20px;
  background-color: rgb(241, 241, 241);
}
ul {
  display: flex;
  flex-wrap: wrap;
}
.list-select-part {
  width: 1300px;
  margin: 0 auto;
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
</style>
