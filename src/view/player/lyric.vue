<template>
  <div id="app">
    <div v-if="originLyric!=''" class="lyric">
      <LyricScroll
        :lyric="lyric"
        :lyric-active-class="'lyric-active'"
        :lyric-center-class="'lyric-center'"
        triangle-width="14px"
        triangle-color="#fff"
        center-line-color="#fff"
        center-time-color="#fff"
        :current-time="currentTime"
      />
    </div>
    <div class="nolyric" v-if="originLyric==''">
      <p class="tip">暂无歌词</p>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    originLyric:{
      type:String,
    },
    time:"",
    
  },
  data: () => ({
    currentTime:0,
    // 歌曲地址
  }),
  watch:{
    time(val,oldval){
      this.currentTime=this.timeStrToNum(val)
    }
  },
  computed: {
    // 原词，格式为{xx: 歌词, ...}，xx为该词开始时间
    lyric() {
      if(this.originLyric!="")
        return this.lyricToObj(this.originLyric)
      else
       return ""
    },
  },
  methods: {
    // 将00:00.00转换为秒数
    timeStrToNum(str) {
      const minute = Number(str.slice(0, 2))
      const second = Number(str.slice(3, 5))
      const minSec = Number(str.slice(6, 8))
      return minute * 60 + second + minSec / 100
    },
    // 将歌词字符串转换为对象，格式为{开始时间: 歌词, ...}
    lyricToObj(lyricStr) {
      const obj = {}
      let perLyric
      let time
      lyricStr.split('\n').forEach((item, idx) => {
        perLyric = item.slice(item.indexOf(']') + 1)
        if (perLyric) {
          time = this.timeStrToNum(item.slice(1, 9))
          obj[time] = perLyric
        }
      })
      return obj
    },
  },

}
</script>

<style>

#app {
  width: 100%;
  height: 640px;
  font-size: 16px;
  margin: 0 auto;
}

.lyric {
  width: 100%;
  color: #adaaa8;
  text-align: center;
  height: 640px;
}
.nolyric {
  width: 100%;
  text-align: center;
  height: 640px;
}
.tip{
  position: relative;
  top:50%;
  color: #adaaa8;
}
.lyric-active {

  color: #fff !important;
}
.lyric-center {
  color: #fff;
}

.lyric-wrapper{
  height: 600px;
  margin-top: 40px;
}
</style>