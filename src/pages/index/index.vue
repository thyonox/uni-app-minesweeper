<template>
  <view class="minesweeper-container">
    <!-- 游戏标题和状态栏 -->
    <view class="header">
      <text class="game-title">💣 扫雷游戏</text>
      <view class="game-help">
        <text class="help-text">💡 点击揭开方格，长按标记地雷</text>
      </view>
      <view class="status-bar">
        <view class="status-item">
          <text class="status-icon">💣</text>
          <text class="status-text">{{ remainingMines }}</text>
        </view>
        <view class="game-face" @click="resetGame">
          <text class="face-emoji">{{ gameStatus === 'playing' ? '😊' : gameStatus === 'won' ? '😎' : '😵' }}</text>
        </view>
        <view class="status-item">
          <text class="status-icon">⏰</text>
          <text class="status-text">{{ formatTime(gameTime) }}</text>
        </view>
      </view>
    </view>

    <!-- 难度选择 -->
    <view class="difficulty-selector">
      <view class="difficulty-btn" 
            :class="{ active: difficulty === 'easy', inactive: difficulty !== 'easy' }" 
            @click="setDifficulty('easy')">
        <text>简单</text>
      </view>
      <view class="difficulty-btn" 
            :class="{ active: difficulty === 'medium', inactive: difficulty !== 'medium' }" 
            @click="setDifficulty('medium')">
        <text>中等</text>
      </view>
      <view class="difficulty-btn" 
            :class="{ active: difficulty === 'hard', inactive: difficulty !== 'hard' }" 
            @click="setDifficulty('hard')">
        <text>困难</text>
      </view>
    </view>

    <!-- 游戏区域 -->
    <view class="game-board" :class="`board-${difficulty}`">
      <view 
        v-for="(cell, index) in board" 
        :key="index"
        class="cell" 
        :class="[getCellClass(cell, index), `cell-${difficulty}`]"
        @click="leftClick(index)"
        @longpress="rightClick(index)"
      >
        <text class="cell-content">{{ getCellDisplay(cell) }}</text>
      </view>
    </view>
    
    <!-- 调试信息 -->
    <view class="debug-info" v-if="false">
      <text>难度: {{ difficulty }}</text>
      <text>行数: {{ rows }}</text>
      <text>列数: {{ cols }}</text>
      <text>格子总数: {{ board.length }}</text>
    </view>

    <!-- 游戏结束弹窗 -->
    <view v-if="showGameOverModal" class="modal-overlay" @click="closeModal">
      <view class="modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">{{ gameStatus === 'won' ? '🎉 恭喜获胜！' : '💥 游戏结束' }}</text>
        </view>
        <view class="modal-content">
          <text class="modal-text">
            {{ gameStatus === 'won' ? 
              `用时 ${formatTime(gameTime)}，太棒了！` : 
              '不要灰心，再试一次吧！' }}
          </text>
        </view>
        <view class="modal-actions">
          <view class="modal-btn modal-btn-primary primary" @click="resetGame">
            <text>再来一局</text>
          </view>
          <view class="modal-btn" @click="closeModal">
            <text>关闭</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 游戏配置
      difficulty: 'easy',
      difficulties: {
        easy: { rows: 9, cols: 9, mines: 10 },
        medium: { rows: 12, cols: 12, mines: 20 },
        hard: { rows: 16, cols: 16, mines: 40 }
      },
      
      // 游戏状态
      board: [],
      gameStatus: 'playing', // playing, won, lost
      gameTime: 0,
      timer: null,
      firstClick: true,
      showGameOverModal: false,
      
      // 计算属性缓存
      rows: 9,
      cols: 9,
      totalMines: 10
    }
  },
  computed: {
    remainingMines() {
      const flaggedCount = this.board.filter(cell => cell.flagged).length;
      return Math.max(0, this.totalMines - flaggedCount);
    }
  },
  onLoad() {
    this.initGame();
  },
  onUnload() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    // 初始化游戏
    initGame() {
      const config = this.difficulties[this.difficulty];
      this.rows = config.rows;
      this.cols = config.cols;
      this.totalMines = config.mines;
      
      this.board = [];
      for (let i = 0; i < this.rows * this.cols; i++) {
        this.board.push({
          isMine: false,
          isRevealed: false,
          flagged: false,
          neighborMines: 0
        });
      }
      
      this.gameStatus = 'playing';
      this.gameTime = 0;
      this.firstClick = true;
      this.showGameOverModal = false;
      
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    
    // 设置难度
    setDifficulty(level) {
      this.difficulty = level;
      this.initGame();
    },
    
    // 重置游戏
    resetGame() {
      this.initGame();
      this.closeModal();
    },
    
    // 放置地雷
    placeMines(excludeIndex) {
      const positions = [];
      for (let i = 0; i < this.rows * this.cols; i++) {
        if (i !== excludeIndex) positions.push(i);
      }
      
      // 随机选择地雷位置
      for (let i = 0; i < this.totalMines; i++) {
        const randomIndex = Math.floor(Math.random() * positions.length);
        const minePosition = positions.splice(randomIndex, 1)[0];
        this.board[minePosition].isMine = true;
      }
      
      // 计算每个格子周围的地雷数量
      this.calculateNeighborMines();
    },
    
    // 计算邻居地雷数量
    calculateNeighborMines() {
      for (let i = 0; i < this.board.length; i++) {
        if (!this.board[i].isMine) {
          this.board[i].neighborMines = this.countNeighborMines(i);
        }
      }
    },
    
    // 计算指定位置周围的地雷数量
    countNeighborMines(index) {
      const neighbors = this.getNeighbors(index);
      return neighbors.filter(neighborIndex => 
        this.board[neighborIndex] && this.board[neighborIndex].isMine
      ).length;
    },
    
    // 获取邻居索引
    getNeighbors(index) {
      const row = Math.floor(index / this.cols);
      const col = index % this.cols;
      const neighbors = [];
      
      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          if (r === 0 && c === 0) continue;
          
          const newRow = row + r;
          const newCol = col + c;
          
          if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
            neighbors.push(newRow * this.cols + newCol);
          }
        }
      }
      
      return neighbors;
    },
    
    // 左键点击
    leftClick(index) {
      if (this.gameStatus !== 'playing' || this.board[index].flagged || this.board[index].isRevealed) {
        return;
      }
      
      // 第一次点击
      if (this.firstClick) {
        this.placeMines(index);
        this.startTimer();
        this.firstClick = false;
      }
      
      this.revealCell(index);
      this.checkGameEnd();
    },
    
    // 右键点击（长按）
    rightClick(index) {
      if (this.gameStatus !== 'playing' || this.board[index].isRevealed) {
        return;
      }
      
      this.board[index].flagged = !this.board[index].flagged;
      
      // 添加振动反馈
      try {
        uni.vibrateShort({
          type: 'light'
        });
      } catch (e) {
        console.log('振动功能不支持');
      }
    },
    
    // 揭露格子
    revealCell(index) {
      if (this.board[index].isRevealed || this.board[index].flagged) return;
      
      this.board[index].isRevealed = true;
      
      // 如果是地雷，游戏结束
      if (this.board[index].isMine) {
        this.gameStatus = 'lost';
        this.revealAllMines();
        return;
      }
      
      // 如果周围没有地雷，自动揭露邻居
      if (this.board[index].neighborMines === 0) {
        const neighbors = this.getNeighbors(index);
        neighbors.forEach(neighborIndex => {
          if (!this.board[neighborIndex].isRevealed) {
            this.revealCell(neighborIndex);
          }
        });
      }
    },
    
    // 揭露所有地雷
    revealAllMines() {
      this.board.forEach(cell => {
        if (cell.isMine) {
          cell.isRevealed = true;
        }
      });
    },
    
    // 检查游戏结束
    checkGameEnd() {
      if (this.gameStatus !== 'playing') return;
      
      const unrevealedCells = this.board.filter(cell => !cell.isRevealed);
      const allMinesUnrevealed = unrevealedCells.every(cell => cell.isMine);
      
      if (allMinesUnrevealed) {
        this.gameStatus = 'won';
        this.stopTimer();
        this.showGameOverModal = true;
        
        // 胜利振动反馈
        try {
          uni.vibrateLong();
        } catch (e) {
          console.log('振动功能不支持');
        }
      } else if (this.gameStatus === 'lost') {
        this.stopTimer();
        this.showGameOverModal = true;
        
        // 失败振动反馈
        try {
          uni.vibrateShort({
            type: 'heavy'
          });
        } catch (e) {
          console.log('振动功能不支持');
        }
      }
    },
    
    // 开始计时
    startTimer() {
      this.timer = setInterval(() => {
        this.gameTime++;
      }, 1000);
    },
    
    // 停止计时
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    
    // 格式化时间
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    
    // 获取格子显示内容
    getCellDisplay(cell) {
      if (cell.flagged) return '🚩';
      if (!cell.isRevealed) return '';
      if (cell.isMine) return '💣';
      if (cell.neighborMines === 0) return '';
      return cell.neighborMines.toString();
    },
    
    // 获取格子样式类
    getCellClass(cell, index) {
      const classes = [];
      
      if (cell.isRevealed) {
        classes.push('revealed');
        if (cell.isMine) {
          classes.push('mine');
          if (this.gameStatus === 'lost') {
            classes.push('mine-exploded');
          }
        } else if (cell.neighborMines > 0) {
          classes.push(`number-${cell.neighborMines}`);
        }
      }
      
      if (cell.flagged) {
        classes.push('flagged');
      }
      
      return classes;
    },
    

    
    // 关闭弹窗
    closeModal() {
      this.showGameOverModal = false;
    }
  }
}
</script>

<style scoped>
/* 跨平台兼容性修复 */
page {
  background: #667eea;
}

/* 确保flex布局在微信小程序中正常工作 */
.minesweeper-container {
  min-height: 100vh;
  background: #667eea;
  padding: 40rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

/* 头部样式 */
.header {
  width: 100%;
  margin-bottom: 40rpx;
  max-width: 800rpx;
  box-sizing: border-box;
}

.game-title {
  display: block;
  text-align: center;
  font-size: 48rpx;
  font-weight: bold;
  color: white;
  margin-bottom: 20rpx;
}

.game-help {
  text-align: center;
  margin-bottom: 20rpx;
}

.help-text {
  font-size: 24rpx;
  color: white;
  background: #5a6fd8;
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
  display: inline-block;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 20rpx;
  padding: 20rpx 30rpx;
  box-sizing: border-box;
}

.status-item {
  display: flex;
  align-items: center;
}

.status-icon {
  font-size: 32rpx;
  margin-right: 10rpx;
}

.status-text {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  min-width: 60rpx;
  text-align: center;
  background: #f5f5f5;
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
}

.game-face {
  background: #fff;
  border-radius: 50%;
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.game-face:active {
  opacity: 0.8;
}

.face-emoji {
  font-size: 40rpx;
}

/* 难度选择器 */
.difficulty-selector {
  display: flex;
  margin-bottom: 40rpx;
  background: #5a6fd8;
  border-radius: 25rpx;
  padding: 8rpx;
  box-sizing: border-box;
}

.difficulty-btn {
  padding: 16rpx 32rpx;
  border-radius: 20rpx;
  background: transparent;
  color: white;
  font-size: 28rpx;
  font-weight: bold;
  box-sizing: border-box;
  margin: 0 10rpx;
}

.difficulty-btn.active {
  background: white;
  color: #667eea;
}

.difficulty-btn.inactive:active {
  background: #7b8ce0;
}

/* 游戏板 */
.game-board {
  display: flex;
  flex-wrap: wrap;
  background: #c0c0c0;
  padding: 0;
  border-radius: 15rpx;
  margin-bottom: 40rpx;
  overflow: hidden;
  border: 2rpx solid #999;
  max-width: 90vw;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  align-content: flex-start;
}

/* 不同难度的游戏板尺寸 - 精确计算 */
.board-easy {
  width: 360rpx;
  height: 360rpx;
}

.board-medium {
  width: 480rpx;
  height: 480rpx;
}

.board-hard {
  width: 640rpx;
  height: 640rpx;
}

.cell {
  background: #c0c0c0;
  border: 1rpx solid #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  position: relative;
  box-sizing: border-box;
}

/* 不同难度的格子尺寸 - 使用百分比确保完美匹配 */
.cell-easy {
  width: 11.111%;
  height: 40rpx;
  font-size: 22rpx;
}

.cell-medium {
  width: 8.333%;
  height: 40rpx;
  font-size: 18rpx;
}

.cell-hard {
  width: 6.25%;
  height: 40rpx;
  font-size: 16rpx;
}

.cell:active {
  opacity: 0.8;
}

.cell.revealed {
  background: #e0e0e0;
  border: 1rpx solid #999;
}

.cell.mine.revealed {
  background: #ff4444;
  color: white;
}

.cell.mine-exploded {
  background: #ff6666;
}

.cell.flagged {
  background: #ffeb3b;
}

/* 数字颜色 */
.cell.number-1 { color: #0000ff; }
.cell.number-2 { color: #008000; }
.cell.number-3 { color: #ff0000; }
.cell.number-4 { color: #000080; }
.cell.number-5 { color: #800000; }
.cell.number-6 { color: #008080; }
.cell.number-7 { color: #000000; }
.cell.number-8 { color: #808080; }

.cell-content {
  font-size: inherit;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

/* 调试信息样式 */
.debug-info {
  background: rgba(255, 255, 255, 0.9);
  padding: 20rpx;
  border-radius: 10rpx;
  margin: 20rpx 0;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.debug-info text {
  font-size: 24rpx;
  color: #333;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  box-sizing: border-box;
}

.modal {
  background: white;
  border-radius: 20rpx;
  width: 600rpx;
  overflow: hidden;
  box-sizing: border-box;
}

.modal-header {
  background: #667eea;
  padding: 40rpx;
  text-align: center;
  box-sizing: border-box;
}

.modal-title {
  color: white;
  font-size: 36rpx;
  font-weight: bold;
}

.modal-content {
  padding: 40rpx;
  text-align: center;
  box-sizing: border-box;
}

.modal-text {
  font-size: 32rpx;
  color: #666;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  border-top: 1rpx solid #eee;
  box-sizing: border-box;
}

.modal-btn {
  flex: 1;
  padding: 32rpx;
  text-align: center;
  font-size: 32rpx;
  color: #666;
  box-sizing: border-box;
}

.modal-btn-primary {
  border-right: 1rpx solid #eee;
}

.modal-btn.primary {
  color: #667eea;
  font-weight: bold;
}

.modal-btn:active {
  background-color: #f5f5f5;
}
</style>
