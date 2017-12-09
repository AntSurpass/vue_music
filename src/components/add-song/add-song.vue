<template>
  <transition name="slide">
    <div class="add-song" @click.stop v-show="showFlag">
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchbox" placeholder="搜索歌曲" @query="search" :showSinger="showSinger"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switchseItem" :currentIndex="currentindex" @switch="swithches"></switches>
        <div class="list-wrapper">
          <scroll v-if="currentindex === 0" :data="playHistroy" class="list-scroll" ref="listscroll">
            <div class="list-inner">
              <song-list :songs="playHistroy" @select="selectsong"></song-list>
            </div>
          </scroll>
          <scroll v-if="currentindex === 1" :data="seacrhHistroy" class="list-scroll" ref="searchscroll" :refreshDelay="refreshDelay">
            <div class="list-inner">
              <search-list :searches="seacrhHistroy" @selectHis="seletHot" @delectOne="delectOne"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" @listScroll="listscroll" @select="saveSearch" ref="suggerstScroll" :showSinger="showSinger"></suggest>
      </div>
      <top-tip ref="toptip">
        <div class="tip-title">
          <i class="tip-ok"></i>
          <span class="text">一首歌曲已经被添加</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import SearchList from 'base/search-list/search-list'
import Scroll from 'base/scroll/scroll'
import { mapActions, mapGetters } from 'vuex'
import SongList from 'base/song-list/song-list'
import Switches from 'base/switches/switches'
import TopTip from 'base/top-tip/top-tip'
import Song from 'common/js/song'
export default {
  data() {
    return {
      showFlag: false,
      showSinger: false,
      query: '',
      currentindex: 0,
      switchseItem: [
        { name: '最近播放' },
        { name: '搜索历史' }
      ],
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'seacrhHistroy',
      'playHistroy'
    ])
  },
  methods: {
    show() {
      this.showFlag = true
      setTimeout(() => {
        if (this.currentindex === 0) {
          this.$refs.listscroll.refresh()
        }
        if (this.currentindex === 1) {
          this.$refs.searchscroll.refresh()
        }
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    delectOne(item) {
      this.deletSearchHistory(item)
    },
    onquerychange(query) {
      this.query = query
    },
    seletHot(item) {
      this.$refs.searchbox.selectHot(item)
    },
    listscroll() {
      this.$refs.searchbox.blur()
    },
    search(query) {
      this.query = query
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
      this.showtip()
    },
    selectsong(song, index) {
      if (index !== 0) {
        this.insertsong(new Song(song))
        this.showtip()
      }
    },
    swithches(index) {
      this.currentindex = index
    },
    showtip() {
      this.$refs.toptip.show()
    },
    ...mapActions([
      'saveSearchHistory',
      'deletSearchHistory',
      'clearHistory',
      'insertsong'
    ])
  },
  components: {
    SearchBox,
    Suggest,
    Scroll,
    SearchList,
    Switches,
    SongList,
    TopTip
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>