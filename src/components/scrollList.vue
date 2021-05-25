 <template>
  <div class="cardBanner">
    <transition-group name="slide_list" tag="ul">
      <li v-for="item in list" :key="item.id" class="img_list">
        <a @click="detail(item.lid)" >
          <img :src="item.cover" alt />
          <p>{{item.lname}}</p>
        </a>
      </li>
    </transition-group>
    <div class="arrow-left" @click="toggleFun(-1)">&lt;</div>
    <div class="arrow-right" @click="toggleFun(1)">&gt;</div>
  </div>
</template>

<script>
export default {
  name: "scrollList",
  props:{
    list: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
    };
  },
  methods: {
    //通过函数改变数据从而达到视图的改变
    toggleFun(p) {
      this.list = this.list.map((item, index, array) => {
        if (index === array.length - 1 && p === 1) {
          item = array[0];
        } else if (index === 0 && p === -1) {
          item = array[array.length - 1];
        } else {
          item = array[index + p];
        }
        return item;
      });
    },
    detail(val) {
      this.$router.push({
        name: "songListDetail",
        params: { lid: val}
      });
    }
  }
};
</script>

<style scoped>
.img_list {
  display: inline-block;
}
.slide_list-move {
  transition: transform 1s;
}
.cardBanner {
  padding: 50px 30px;
  background-color: #fff;
  position: relative;
  width: 1360px;
  margin: auto;
}
.cardBanner ul {
  display: flex;
  overflow: scroll; /*设置滚动条*/
}
.cardBanner ul::-webkit-scrollbar {
  /*隐藏滚动条*/
  display: none;
}
.cardBanner ul > li {
  width: 25%;
  flex-shrink: 0;
  text-align: center;
}
.cardBanner ul > li:first-child {
  padding-left: 0;
}
.cardBanner ul > li a {
  display: block;
  width: 100%;
  height: 100%;
}
.cardBanner ul > li img {
  width: 250px;
  height: 250px;
  border-radius: 5px;
}
.cardBanner ul > li p {
  margin: 0;
}
[class^="arrow"] {
  font-size: 30px;
  transform: scaleX(0.7);
  color: #ddd;
}
.arrow-left {
  position: absolute;
  left: 5px;
  top: 50%;
  margin-top: -17px;
}
.arrow-right {
  position: absolute;
  right: 5px;
  top: 50%;
  margin-top: -17px;
}
</style>
