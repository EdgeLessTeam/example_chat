<template>
  <div class="chatRoom">
    <div class="title">聊天室</div>
    <div class="chartContent" ref="chartContent">
      <div class="item"
           :class="item.type"
           v-for="(item, index) in chatList" :key="index">
        <div class="avatar">{{ item.type === 'other' ? '客服' : '我'}}</div>
        <div class="msg">{{ item.msg }}</div>
      </div>
    </div>
    <div class="footer">
      <textarea v-model="text" class="input" @keydown="handleKeyCode($event)" ref="input" />
      <button class="sendBtn" @click="sendData">发送</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      responseData: '',
      text: '',
      chatList: [
        {
          type: 'other',
          msg: '您好，请问有什么能帮您的吗？',
          time: new Date().getTime()
        }
      ],
    }
  },
  methods: {
    sendData() {
      if (!this.text.trim()) {
        return;
      }
      console.log(this.text);
      const queryArgs =  {
        msg: this.text,
      }
      this.chatList.push({
        time: new Date().getTime(),
        msg: this.text,
        type: 'self',
      });
      this.text = '';
      this.scrollToBottom();
      axios.get('/functions/chat', {
        params: queryArgs
      }).then((response)=> {
        const resData = response.data.data;
        this.chatList.push({
          time: resData.time,
          msg: resData.chatMsg,
          type: 'other',
        });
        console.log('请求成功', response);
        this.scrollToBottom();
      }).catch(function (error) {
        console.log('请求失败', error);
      });
    },
    scrollToBottom() {
      this.$nextTick(()=> {
        this.$refs.chartContent.scrollTop =  this.$refs.chartContent.scrollHeight;
      })
    },
    /** 键盘回车事件: 回车发送，ctrl+enter实现换行 */
    handleKeyCode(event) {
      if (event.keyCode === 13) { // 仅回车， 发送消息
        if (!event.ctrlKey) {
          event.preventDefault();
          this.sendData();
        } else { // 换行
          console.log('换行');
          this.text = this.text + '\n';
          this.$nextTick(()=> {
            this.$refs.input.scrollTop =  this.$refs.input.scrollHeight;
          })
        }
      }
    },
  }
}
</script>

<style>
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  ::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 7px;
    background: #dddddd;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #d4d4d4;
  }
  ::-webkit-scrollbar-track {
    background: #f8f8f8;
  }
  ::-webkit-scrollbar-track:hover {
    background: #f5f5f5;
  }
  .chatRoom{
    width: 800px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
    margin: 10% auto 0;
  }
  .chatRoom .title{
    padding: 15px;
    border-bottom: 1px solid #d7d7d7;
  }
  .chatRoom .chartContent{
    padding: 10px;
    background: #f8f8f8;
    height: 60vh;
    overflow: auto;
  }
  .chartContent .item{
    display: flex;
    padding: 10px;
    font-size: 14px;
    flex: 1;
  }
  .chartContent .item .avatar{
    width: 40px;
    height: 40px;
    border: 1px solid #d7d7d7;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    background: #f5f8fa;
    flex-shrink: 0;
  }
  .chartContent .item .msg{
    padding: 10px;
    border-radius: 4px;
    filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.1));
    word-break: break-all;
    position: relative;
    white-space: pre-wrap;
  }
  .chartContent .item.other .msg{
    margin-left: 15px;
    background: #ffffff;
  }
  .chartContent .item.other .msg:before {
    content: "";
    position: absolute;
    top: 50%;
    left: -15px;
    margin-top: -15px;
    border: 8px solid transparent;
    border-right: 8px solid #ffffff;
  }
  .chartContent .item.self{
   flex-direction: row-reverse;
  }
  .chartContent .item.self .msg{
    margin-right: 10px;
    background: #4ed24e;
  }
  .chartContent .item.self .msg:before {
    content: "";
    position: absolute;
    top: 50%;
    right: -15px;
    margin-top: -15px;
    border: 8px solid transparent;
    border-left: 8px solid #4ed24e;
  }
  .footer{
    display: flex;
    font-size: 0;
    align-items: center;
  }
  .footer, .footer .input{
    height: 40px;
  }
  .footer .input{
    width: 90%;
    font-size: 14px;
    padding: 10px;
    border: none;
    outline: none;
    white-space: pre-wrap;
    resize: none;
  }
  .sendBtn{
    background: rgba(1, 82, 218, 0.83);
    border: none;
    width: 9%;
    height: 80%;
    color: #ffffff;
    cursor: pointer;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  .sendBtn:hover{
    background: rgba(1, 82, 218, 0.5);
  }
  .footer .input::-webkit-scrollbar {
    display: none;
  }
</style>
