<template>
  <el-container>
    <div class="content-box">
      <div class="content-box-nav">
          <h1 class="box-title">我的歌单</h1>
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
              @click="detail(item.id)"
            >
              <img class="cover" :src="item.cover" alt />
              <p style="font-size:15px;color:grey">{{item.lname}}</p>
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
  </el-container>
</template>
<script>
import qs from "qs";
export default {
  components: {},
  data() {
    return {
      activeIndex: '1',
      currentPage3: 1,
      lists: [],
    };
  },
mounted() {
    this.getMySongLists();
  },
  methods: {/*没有分页查询*/
    handleCurrentChange_list(val) {
      this.getMySongLists();
    },
    getMySongLists() {
      this.$axios
        .get(
          "http://localhost:8080/song/getMySongLists?id=" +
            sessionStorage.getItem("tel")
        )
        .then(res => {
          this.lists = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
  }
};
</script>
<style scoped>
.list-ul {
  display: flex;
  flex-wrap: wrap;
}
.cover {
  width: 240px;
  height: 240px;
  margin-right: 20px;
}
.el-pagination {
  text-align: center;
}



.content-box {
  width: 1300px;
  margin: auto;
  padding-top: 60px;
}
.box-title {
  height: 61px;
  border-bottom: solid 1px #e6e6e6;
  padding-top: 10px;
}
.content-box-nav {
  background-color: white;
}
.content-box-content {
  height: 400px;
  position: relative;
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
</style>
