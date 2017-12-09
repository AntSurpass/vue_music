<template>
  <transition name="list-fade">
    <div class="playlist" @click="hide" v-show="showFlag">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changemode"></i>
            <span class="text">{{iconText}}</span>
            <span class="clear" @click="clearAll">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll ref="listContent" class="list-content" :data="sequenceList" :refreshDelay="refreshDelay">
          <transition-group name="list" tag="ul">
            <li :key="item.id" class="item" v-for="(item, index) in sequenceList" @click="selectItem(item, index)" ref="ContentLi">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toggleicon(item)">
                <i :class="getfavericon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addsong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <confirm text='是否清空所有' confirmBtnText='清空' @confirm="clearsongs" ref="confirm"></confirm>
      <add-song ref="addsong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Scroll from 'base/scroll/scroll'
import { shuffle } from 'common/js/util'
import { playMode } from 'common/js/config'
import confirm from 'base/confirm/confirm'
import addSong from 'components/add-song/add-song'
export default {
  data() {
    return {
      showFlag: false,
      refreshDelay: 100
    }
  },
  methods: {
    show() {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.tocurrenindex(this.currentSong)
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    getCurrentIcon(item) {
      if (item.id === this.currentSong.id) {
        return 'icon-play'
      }
      return ''
    },
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        index = this.palyList.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setcurrentindex(index)
      this.setPlayingState(true)
    },
    tocurrenindex(currentsong) {
      let index = this.palyList.findIndex((song) => {
        return song.id === currentsong.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.ContentLi[index], 300)
    },
    deleteOne(item) {
      this.deletetsong(item)
      if (!this.palyList.length) {
        this.hide()
        this.setPlayingState(false)
      }
    },
    clearsongs() {
      this.clearsongs()
      this.hide()
    },
    clearAll() {
      this.$refs.confirm.show()
    },
    changemode() {
      const mode = (this.mode + 1) % 3
      this.setplaymode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.restcurrentIndex(list)
      this.setplaylist(list)
    },
    restcurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setcurrentindex(index)
    },
    addsong() {
      this.$refs.addsong.show()
    },
    toggleicon(song) {
      if (this.isFaver(song)) {
        this.deleteFaverIcon(song)
      } else {
        this.saveFaverIcon(song)
      }
    },
    getfavericon(song) {
      if (this.isFaver(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    isFaver(song) {
      const index = this.favericon.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setcurrentindex: 'SET_CURRENT_INDEX',
      setplaymode: 'SET_PLAY_MODE',
      setplaylist: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'deletetsong',
      'clearsongs',
      'saveFaverIcon',
      'deleteFaverIcon'
    ]
    )
  },
  computed: {
    iconText() {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '单曲循环' : '随机播放'
    },
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'palyList',
      'mode',
      'favericon'
    ])
  },
  watch: {
    currentSong(newsong, oldsong) {
      if (!this.showFlag || newsong.id === oldsong.id) {
        return
      }
      this.tocurrenindex(newsong)
    }
  },
  components: {
    Scroll,
    confirm,
    addSong
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>