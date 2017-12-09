<template>
  <scroll :data="result" class="suggest" :pullup="pullup" 
  @scrollToEnd="searchMore" 
  ref="suggerstScroll" 
  :beforeScroll="beforeScroll"
  @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconcls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getdisplayname(item)"></p>
        </div>
      </li>
      <loading v-show="hasmoer" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasmoer && !result.length">
      <no-result title="没有找到θ.θ"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import { mapMutations, mapActions } from 'vuex'
import NoResult from 'base/no-result/no-result'

const PERPAGE = 20
const TYPE_SONGER = 'singer'
export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showsinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasmoer: true,
      beforeScroll: true
    }
  },
  methods: {
    _search() {
      this.hasmoer = true
      this.page = 1
      this.$refs.suggerstScroll.scrollTo(0, 0)
      search(this.query, this.page, this.showsinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          console.log(this._getResult(res.data))
          this.result = this._getResult(res.data)
          this._makemoer(res.data)
        }
      })
    },
    _makemoer(item) {
      const song = item.song
      if (!song.list.length || (song.curnum + (song.curpage * PERPAGE)) >= song.totalnum) {
        this.hasmoer = false
      }
    },
    _normalizesong(list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    _getResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SONGER } })
      }
      if (data.song) {
        ret = ret.concat(this._normalizesong(data.song.list))
      }
      return ret
    },
    getIconcls(item) {
      if (item.type === TYPE_SONGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getdisplayname(item) {
      if (item.type === TYPE_SONGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    searchMore() {
      if (!this.hasmoer) {
        return
      }
      this.page++
      search(this.query, this.page, this.showsinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._getResult(res.data))
          this._makemoer(res.data)
        }
      })
    },
    selectItem(item) {
      if (item.type === TYPE_SONGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setsinger(singer)
      } else {
        this.insetrsong(item)
      }
      this.$emit('select')
    },
    listScroll() {
      this.$emit('listScroll')
    },
    ...mapMutations({
      setsinger: 'SET_SINGER'
    }),
    refresh() {
      this.$refs.suggerstScroll.refresh()
    },
    ...mapActions({
      insetrsong: 'insertsong'
    })
  },
  watch: {
    query(newQuery) {
      console.log(`aaaa`)
      this._search(newQuery)
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>