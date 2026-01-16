<script>
export default {
  onLaunch: function () {
    console.log('扫雷游戏启动')
  },
  onShow: function () {
    console.log('扫雷游戏显示')
  },
  onHide: function () {
    console.log('扫雷游戏隐藏')
  },
}
</script>

<style>
/* 全局样式 */
page {
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background: #667eea;
  overflow-x: hidden;
}

/* 统一的触摸反馈效果 */
.touchable {
  transition: opacity 0.2s ease;
}

.touchable:active {
  opacity: 0.8;
}

/* 通用的卡片样式 */
.card {
  background: #ffffff;
  border-radius: 16rpx;
}

/* 通用的按钮样式 */
.btn {
  padding: 24rpx 48rpx;
  border-radius: 24rpx;
  font-weight: bold;
  text-align: center;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:active {
  opacity: 0.8;
}

.btn-secondary {
  background: #ffffff;
  color: #667eea;
  border: 2rpx solid #667eea;
}

.btn-secondary:active {
  background: #f0f0f0;
}

/* 通用的文本样式 */
.text-primary {
  color: #667eea;
}

.text-secondary {
  color: #666;
}

.text-white {
  color: white;
}

.text-center {
  text-align: center;
}

.text-bold {
  font-weight: bold;
}

/* 通用的布局样式 */
.flex {
  display: flex;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-column {
  flex-direction: column;
}

.flex-between {
  justify-content: space-between;
}

.flex-around {
  justify-content: space-around;
}

/* 通用的间距样式 */
.m-10 { margin: 10rpx; }
.m-20 { margin: 20rpx; }
.m-30 { margin: 30rpx; }

.mt-10 { margin-top: 10rpx; }
.mt-20 { margin-top: 20rpx; }
.mt-30 { margin-top: 30rpx; }

.mb-10 { margin-bottom: 10rpx; }
.mb-20 { margin-bottom: 20rpx; }
.mb-30 { margin-bottom: 30rpx; }

.p-10 { padding: 10rpx; }
.p-20 { padding: 20rpx; }
.p-30 { padding: 30rpx; }

/* 简化的动画效果 */
.fade-in {
  opacity: 1;
}

.bounce-in {
  opacity: 1;
}

.shake {
  opacity: 1;
}
</style>
