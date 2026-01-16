<template>
  <view class="test-container">
    <text class="test-title">扫雷游戏测试页面</text>
    <view class="test-info">
      <text class="test-text">当前时间: {{ currentTime }}</text>
    </view>
    <view class="test-board">
      <view class="test-cell" v-for="n in 9" :key="n">
        <text>{{ n }}</text>
      </view>
    </view>
    <button class="test-btn" @click="testClick">点击测试</button>
    <button class="test-btn" @click="goToGame">进入游戏</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      message: '测试',
      currentTime: ''
    }
  },
  onLoad() {
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 1000);
  },
  methods: {
    testClick() {
      console.log('测试点击');
      uni.showToast({
        title: '测试成功',
        icon: 'success'
      });
    },
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString();
    },
    goToGame() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    }
  }
}
</script>

<style scoped>
.test-container {
  padding: 40rpx;
  background: #667eea;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.test-title {
  color: white;
  font-size: 36rpx;
  text-align: center;
  display: block;
  margin-bottom: 40rpx;
}

.test-info {
  margin-bottom: 40rpx;
}

.test-text {
  color: white;
  font-size: 28rpx;
}

.test-board {
  display: flex;
  flex-wrap: wrap;
  width: 300rpx;
  height: 300rpx;
  background: #c0c0c0;
  margin: 0 auto 40rpx;
  border-radius: 15rpx;
  overflow: hidden;
}

.test-cell {
  width: 100rpx;
  height: 100rpx;
  border: 1rpx solid #999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #c0c0c0;
  box-sizing: border-box;
}

.test-btn {
  background: white;
  color: #667eea;
  border-radius: 20rpx;
  margin: 20rpx auto;
  display: block;
  padding: 20rpx 40rpx;
}
</style>
