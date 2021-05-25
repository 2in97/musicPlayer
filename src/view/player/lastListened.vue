<template>
  <div class="whole">
    <div>
      <el-container>
        <el-main class="table-center">
          <br />
          <div class="title">
            <el-row>
              <el-col :span="1"></el-col>
              <el-col :span="12">
                <span>歌曲</span>
              </el-col>
              <el-col :span="5">
                <span>歌手</span>
              </el-col>
              <el-col :span="6">
                <span>专辑</span>
              </el-col>
            </el-row>
          </div>
          <div class="infinite-list-wrapper" style="overflow:auto;height: 439px">
            <ul
              class="list"
              v-infinite-scroll="load"
              infinite-scroll-disabled="disabled"
              :infinite-scroll-distance="1"
            >
              <li
                v-for="(song,index) in songs"
                class="list-item"
                :key="index"
                :class="{'clickBg':index==clickIndex,'hoverBg':index==hoverIndex}"
                @dblclick="insertPlayingList(song.id,index)"
                @click="clickIndex = index"
                @mouseover="hoverIndex = index"
                @mouseout="hoverIndex = -1"
              >
                <el-row>
                  <el-col :span="1">{{index+1}}</el-col>
                  <el-col :span="12">
                    <span>{{song.name}}</span>
                  </el-col>
                  <el-col :span="5">
                    <span>{{song.artist}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span>{{song.albumName}}</span>
                  </el-col>
                </el-row>
              </li>
            </ul>
            <p v-if="loading">加载中...</p>
            <p v-if="noMore">没有更多了</p>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      search: "",
      searchType: "1",
      songs: [],
      loading: false,
      page: "",
      totalPage: "",
      currentPage: "",
      hoverIndex: -1, //表示当前hover的是第几个li 初始为 -1 或 null 不能为0 0表示第一个li
      clickIndex: -1 //表示当前点击的是第几个li 初始为 -1 或 null 不能为0 0表示第一个li
    };
  },
  computed: {
    noMore() {
      return this.currentPage >= this.totalPage;
    },
    disabled() {
      return this.loading || this.noMore;
    }
  },
  methods: {
    insertPlayingList(sid) {
      this.$emit("insertList", sid);
    },
    turnPage(pageNum) {
      this.$axios
        .get(
          "http://localhost:8080/song/getSongsLastListened?pageNum=" +
            pageNum +
            "&searchType=" +
            this.searchType +
            "&search=" +
            this.search
        )
        .then(res => {
          this.songs = this.songs.concat(res.data);
        })
        .catch(err => {
          console.log(err);
        });
      this.$axios
        .get(
          "http://localhost:8080/song/getPage?searchType=" +
            this.searchType +
            "&search=" +
            this.search
        )
        .then(res => {
          this.page = res.data;
          this.totalPage = this.page.pageTotal;
          this.currentPage = this.page.pageNum;
        })
        .catch(err => {
          console.log(err);
        });
    },
    load() {
      this.loading = true;
      this.turnPage(this.currentPage + 1);
      this.loading = false;
    }
  },
  mounted() {
    this.turnPage(1, "", "");
    this.songs;
  }
};
</script>
<style scoped>
.hoverBg {
  background: rgba(226, 226, 226, 0.1);
  color: #fff;
}
.clickBg {
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
}
::-webkit-scrollbar {
  background-color: rgba(0, 0, 0, 0.3);
  width: 5px;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: #a1a3a9;
  border-radius: 3px;
}

.el-col {
  min-height: 60px;
  border-bottom: 1px solid;
  border-color: rgb(233, 233, 233, 0.4);
}
.title {
  height: 60px;
  color: white;
  font-size: 15px;
  line-height: 59px;
}
.infinite-list-wrapper {
  width: 100%;
  height: 100%;
  color: rgb(216, 216, 216);
  font-size: 15px;
  overflow-x: hidden;
  overflow-y: auto;
}
.list {
  width: 100%;
}
.list-item {
  line-height: 58px; /*border算进去2px*/
}
.list li {
  height: 60px;

  list-style: decimal;
}
.infinite-list-wrapper p {
  text-align: center;
  color: rgb(187, 187, 187);
  font-size: 15px;
  line-height: 60px;
}

.whole {
  left: 0;
  background-size: cover;
  width: 100%;
  height: 100%;
  overflow: auto;
}
.el-container {
  width: 100%;
  margin: auto;
  position: relative;
}
.table-center {
  padding-left: 50px;
}
ul {
  padding-left: 0px;
}
ul li {
  list-style: none !important;
}
</style>
