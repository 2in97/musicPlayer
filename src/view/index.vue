<template>
  <el-container>
    <el-header>
      <span class="title1">MusicPlayer</span>
      <el-menu
        :default-active="activeIndex"
        class="nav-header"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">首页</el-menu-item>
        <el-menu-item index="2">歌单</el-menu-item>
        <el-menu-item index="3">歌手</el-menu-item>
        <el-menu-item index="4">没想好</el-menu-item>
      </el-menu>
      <a class="login-a1" @click="login-form">登录 / 注册</a>
      <el-input placeholder="请输入内容" v-model="search" class="search-input">
        <el-select
          class="search-select"
          v-model="searchType"
          slot="prepend"
          placeholder="请选择"
          popper-class="selectinfo"
        >
          <el-option label="歌曲名" value="1"></el-option>
          <el-option label="歌手" value="2"></el-option>
          <el-option label="专辑" value="3"></el-option>
        </el-select>
        <el-button class="search-bt" slot="append" icon="el-icon-search" @click="toSearch(1)"></el-button>
      </el-input>
    </el-header>
    <el-main></el-main>
    <el-footer></el-footer>
  </el-container>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      activeIndex: "1"
    };
  },

  methods: {}
};
</script>
<style scoped>
.title1 {
  padding: 10px 0px 0px 50px;
  width: 300px;
  font: 30px bold;
  float: left;
  background-image: -webkit-linear-gradient(
    bottom,
    rgb(0, 132, 255),
    rgb(0, 175, 23)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-style: italic;
}
.nav-header {
  width: 500px;
  float: left;
}
.login-a1 {
  float: right;
  padding: 20px 0 0 10px;
}
.search-input {
  width: 30%;
  float: right;
  padding-top: 10px;
}
.el-header {
  height: 100px;
  margin: 0 auto;
  width: 1300px;
}
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>
