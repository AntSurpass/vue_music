<template>
  <div class="progress-bar" ref="progressBar" @click="progressclick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
            @touchstart.prevent="progressTouchStart"
            @touchmove.prevent="progressTouchMove"
            @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixstyle} from 'common/js/dom'
  const transform = prefixstyle('transform')
  const PROGERSSBTN = 16

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      progressTouchStart(e) {
        this.touch.initiaed = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove(e) {
        if (!this.touch.initiaed) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetwidth = Math.min(this.$refs.progressBar.clientWidth - PROGERSSBTN, Math.max(0, deltaX + this.touch.left))
        this._offset(offsetwidth)
      },
      progressTouchEnd() {
        // this.touch = {}
        this.touch.initiaed = false
        this._triggerPercent()
      },
      progressclick(e) {
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetwidth = e.pageX - rect.left
        this._offset(offsetwidth)
        this._triggerPercent()
      },
      _triggerPercent() {
        const barwidth = this.$refs.progressBar.clientWidth - PROGERSSBTN
        const percrnt = this.$refs.progress.clientWidth / barwidth
        this.$emit('restpercrnt', percrnt)
      },
      _offset(offsetwidth) {
        this.$refs.progress.style.width = `${offsetwidth}px`
        this.$refs.progressBtn.style[transform] = `translate3D(${offsetwidth}px, 0, 0)`
      }
    },
    watch: {
      percent(news) {
        if (news >= 0 && !this.touch.initiaed) {
          const barwidth = this.$refs.progressBar.clientWidth - PROGERSSBTN
          const offsetwidth = news * barwidth
          this._offset(offsetwidth)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>