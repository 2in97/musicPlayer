<template>
<div>
      <div class="list-select-part" style="font-size:15px;">
        <br />
        <ul>
          <li v-for="item in initials" :key="item.value" class="img_list">
            <el-button ref="ibt" class="select-bt" size="mini" @click="selectInitial(item.value)">{{item.name}}</el-button>
          </li>
        </ul>

        <br />
        <ul>
          <li v-for="item in areas" :key="item.value">
            <el-button ref="abt" class="select-bt" size="mini" @click="selectArea(item.value)">{{item.name}}</el-button>
          </li>
        </ul>

        <br />
        <p>当前选择:{{initialName}} / {{areaName}}</p>
        <br>
      </div>
      <div class="list-content-part">
        <ul>
          <li v-for="item in artistlistWithAvater" :key="item.id" class="li-artist-avater">
            <a @click="artistDetail(item.id)">
              <el-avatar class="cover" :size="180" :src="item.avatar"></el-avatar>
              <p class="li-artist-avater-content">{{item.name}}</p>
            </a>
          </li>
        </ul>
        <ul>
          <li v-for="item in artistlist" :key="item.id" class="li-artist">
            <a @click="artistDetail(item.id)">
              <p class="li-artist-avater-content">{{item.name}}</p>
            </a>
          </li>
        </ul>
      </div>
      <div class="pagination-part">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage1"
          :page-size="10"
          layout="prev, pager, next"
          :total="page.recordsNum"
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
      dialogVisible: false,
      page: "",
      currentPage1: 1,
      initials: [
        { value: "", name: "全部" },
        { value: "A", name: "A" },
        { value: "B", name: "B" },
        { value: "C", name: "C" },
        { value: "D", name: "D" },
        { value: "E", name: "E" },
        { value: "F", name: "F" },
        { value: "G", name: "G" },
        { value: "H", name: "H" },
        { value: "I", name: "I" },
        { value: "J", name: "J" },
        { value: "K", name: "K" },
        { value: "L", name: "L" },
        { value: "M", name: "M" },
        { value: "N", name: "N" },
        { value: "O", name: "O" },
        { value: "P", name: "P" },
        { value: "Q", name: "Q" },
        { value: "R", name: "R" },
        { value: "S", name: "S" },
        { value: "T", name: "T" },
        { value: "U", name: "U" },
        { value: "V", name: "V" },
        { value: "W", name: "W" },
        { value: "X", name: "X" },
        { value: "Y", name: "Y" },
        { value: "Z", name: "Z" },
      ],
      areas: [
        { value: "", name: "全部" },
        { value: "2600", name: "华语" },
        { value: "2601", name: "欧美" },
        { value: "2602", name: "粤语" },
        { value: "2603", name: "日语" },
        { value: "2604", name: "韩语" },
        { value: "2605", name: "其他" }
      ],
      initial:"",
      area:"",
      areaName:"全部",
      initialName:"全部",
      select:"",
      serach:"",
      isLogin:false,
      searchType:"",
      artists: [],
      artistlistWithAvater: [],
      artistlist: [],
    };
  },
  mounted() {
    this.getArtists(1);
  },
  methods: {
    artistDetail(id){
      this.$router.push({name: 'artistDetail', params: {aid: id}})
    },
    selectArea(val){
      this.area=val
      this.getArtists(1);
      for(var i in this.areas){
        if(this.areas[i].value==this.area){
        this.areaName=this.areas[i].name
        }
      }
    },
    selectInitial(val){
      this.initial=val
      this.getArtists(1);
      for(var i in this.initials){
        console.log(this.initial)
        if(this.initials[i].value==this.initial){
        this.initialName=this.initials[i].name
        console.log(this.initialName)
        }
      }
    },
    setDialogVisible(val) {
      this.dialogVisible = false;
      this.isLogin=val
    },
    handleCurrentChange(val) {
      this.turnPage(val, this.searchType, this.serach);
    },
    getArtists(pageNum) {
      this.$axios
        .get(
          "http://localhost:8080/artist/getArtistsPerPage30?pageNum=" + pageNum+"&initial=" +
            this.initial+"&area=" +
            this.area
        )
        .then(res => {
          this.artists = res.data;
          this.artistlistWithAvater=[]
          this.artistlist=[]
          for (var i in this.artists) {
            if (i < 18) this.artistlistWithAvater.push(this.artists[i]);
            else this.artistlist.push(this.artists[i]);
          }
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
        logout() {
      this.$axios
        .get("api/user/logout")
        .then(res => {
                console.log(res)
          sessionStorage.clear()
          this.isLogin = false;
        })
        .catch(err => {
          this.$message.error("系统错误");
        });
    },
    toPersonal(){
      this.$router.push("/personalCenter")
    }
  }
};
</script>
<style scoped>
.pagination-part {
  display: flex;
  align-items: center;
  justify-content: center;
}
.list-content-part {
  width: 1300px;
  margin: 0 auto;
}
.li-artist-avater-content {
  font-size: 15px;
  color: grey;
  display: flex;
  align-items: center;
  justify-content: center;
}
.li-artist-avater {
  padding-top: 20px;
  width: 216px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.li-artist {
  padding-top: 20px;
  width: 216px;
  display: flex;
}
.img_list {
  display: inline-block;
}

.select-bt {
  margin-right: 5px;
  margin-top: 5px;
  border: 0px;
  border-radius: 20px;
}
ul {
  display: flex;
  flex-wrap: wrap;
}
.list-select-part {
  width: 1300px;
  margin: 0 auto;
}
.vx {
  height: 65px;
  width: 65px;
}
.logo {
  height: 50px;
  width: 125px;
  float: left;
  margin-right: 20px;
  margin-top: 7px;
}
.vx_part {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
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
.search-select {
  width: 100px;
}
.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

</style>
