
<template>
  <div class="main">
    <div class="stage">
      <div class="top">
        <div class="top_left">
          <div class="zitian">
            <el-icon><Grid /></el-icon>计算器
          </div>
        </div>
        <div class="top_right">
          <el-icon><Close /></el-icon>
        </div>
      </div>
      <div class="top2">
        <div class="top2_right">
          <span class="fr"
            ><el-icon><Clock /></el-icon
          ></span>
        </div>
      </div>
      <div class="center">
        <div class="center_top">
          {{ previous }}
        </div>
        <div class="center_bottom" ref="font"  :style="{fontSize:fontSize(next)}">
          {{ next }}
        </div>
      </div>
      <div class="bottom">
        <div class="bottom_box">
          <div
            v-if="!isEquals_sign"
            class="bottom_button"
            v-for="item in button"
            @click="rule(item)"
            :class="isClass(item)"
          >
            <span>
              {{ item.content == "backspace" ? "" : item.content }}
              <el-icon v-if="item.content == 'backspace'"><Back /></el-icon>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { compute } from "./utils/constant.js";
import { reactive, ref } from "vue";
import {get_Numbers} from './utils/get_Numbers'
let button = reactive([
  { content: "%", isNumber: false, value: compute.percent },
  { content: "CE", isNumber: false, value: compute.clearEntry },
  { content: "C", isNumber: false, value: compute.clear },
  { content: "backspace", isNumber: false, value: compute.backspace },
  { content: "1/x", isNumber: false, value: compute.fraction },
  { content: "x^2", isNumber: false, value: compute.sqrt },
  { content: "√x", isNumber: false, value: compute.rooting },
  { content: "÷", isNumber: false, value: compute.division },
  { content: "7", isNumber: true, value: 7 },
  { content: "8", isNumber: true, value: 8 },
  { content: "9", isNumber: true, value: 9 },
  { content: "×", isNumber: false, value: compute.multiplication },
  { content: "4", isNumber: true, value: 4 },
  { content: "5", isNumber: true, value: 5 },
  { content: "6", isNumber: true, value: 6 },
  { content: "-", isNumber: false, value: compute.subtraction },
  { content: "3", isNumber: true, value: 3 },
  { content: "2", isNumber: true, value: 2 },
  { content: "1", isNumber: true, value: 1 },
  { content: "+", isNumber: false, value: compute.addition },
  { content: "+/-", isNumber: false, value: compute.negation },
  { content: "0", isNumber: true, value: 0 },
  { content: ".", isNumber: false, value: compute.decimal_point },
  { content: "=", isNumber: false, value: compute.equals_sign },
]);
let previous = ref("");
let next = ref("0");
let font = ref(null)

//计算队列
let computelist = []

function isClass(item) {
  if (!item.isNumber && item.value == compute.equals_sign) {
    return "backlan";
  }
  return item.isNumber ? "" : "backan";
}
//是否是某算法
function isCompute( constant,compute, value) {
  return constant[`${compute}`] == value;
}

function fontSize(value){
  if(value.length>=8&&value.length<9){
    return '35px'
  }else if(value.length>=9&&value.length<11){
    return '30px'
  }else if(value.length>=11&&value.length<14){
    return '25px'
  }else if(value.length>=14){
    next.value = next.value.slice(0,15)
    return '20px'
  }
}
//主规则
function rule(item) {
  if(item.isNumber){
    number(item)
    return '';
  }
   //判定是否为加减乘除算法
    if(isCompute(compute,'addition',item.value)||
  isCompute(compute,'subtraction',item.value)||
  isCompute(compute,'multiplication',item.value)||
  isCompute(compute,'division',item.value)){
    addfun(item)
    return ''
  }

 //判定等于
 if(isCompute(compute,'equals_sign',item.value)){
  equals_sign(item)
  return ''
 }

 //判定全清、清输入、退格、小数
 if(isCompute(compute,'clearEntry',item.value)){
  clearEntry()
  return ''
 }
 if(isCompute(compute,'clear',item.value)){
  clear()
  return ''
}
if(isCompute(compute,'backspace',item.value)){
  backspace()
  return ''
}
if(isCompute(compute,'decimal_point',item.value)){
  decimal_point()
  return ''
}
//判断输出数字的操作
if(isCompute(compute,'percent',item.value)||
isCompute(compute,'fraction',item.value)||
isCompute(compute,'rooting',item.value)||
isCompute(compute,'sqrt',item.value)){
cslNumber(item)
}

//转next 为字符串
next.value+=''

}

//数字
function number(item) {
  if(next.value[0]=== "0"&&next.value.length==1){
      next.value  = item.content
  }else{
    next.value = next.value+item.content
  }

}
//加减乘除
function  addfun(item){
  
  if(parseFloat(next.value)!=0){
    previous.value = previous.value+next.value
  }
  let a =parseFloat(previous.value[previous.value.length-1])<10
  if(previous.value==''){
    previous.value = next.value+`${item.content}`
    computelist.push(item.value)
  }else{
    if(a){
      console.log(a)
    previous.value = previous.value+`${item.content}`
  computelist.push(item.value)
    }else{
      previous.value = next.value+`${item.content}`
      computelist[computelist.length-1] = item.value
    }
  }
  next.value='0'
  console.log(computelist)
  
}
//等于时函数
function equals_sign(item) {
  //末尾不为算法时 清空之前的输入
  let panduan =parseFloat(previous.value[previous.value.length-1])<10
  if(previous.value ==''||panduan){
    previous.value = next.value
  }else{
//获取字符串中的数，组成数组  数1 算法1 数2 算法2 数3 算法3 next.value
let list =get_Numbers(previous.value)
let result=list[0]
let str=`${result}`
console.log(str)
for(let i  =0;i<computelist.length;i++){
  let a = list[i+1]
  if(i==computelist.length-1){
      a = parseFloat(next.value)
  }

 if(computelist[i]==1){
  str +="+" +a
  result+=a
 }else if(computelist[i]==2){
  str += "-"+a
  result -=a
 }else if(computelist[i]==3){
  str += "×"+a
  result *=a
 }else if(computelist[i]==4){
  str += "÷"+a
  result /=a
}
}
previous.value = str
next.value = result
next.value+=""
  }
}
//输出数字
function cslNumber(item){
  if(item.value ==compute.percent){
    next.value=parseFloat(next.value)*0.01
  }else if(item.value == compute.fraction){
    next.value = 1/parseFloat(next.value)
  }else if(item.value == compute.rooting){
    next.value = Math.sqrt( parseFloat(next.value))
  }else if(item.value == compute.sqrt){
    next.value =   Math.pow(parseFloat(next.value),2)
  }
}

//清输入
function clearEntry(){
  next.value="0"
}
//全清
function clear(){
  next.value='0'
  previous.value=''
  computelist=[]
}
//退格
function backspace(){
  next.value=next.value.slice(0,-1)
}
//小数点
function decimal_point(){
  let r = true
  for(let i=0 ;i<next.value.length;i++){
    if( next.value[i]=='.'){
      r = false
      break;
    }
  }
  if(r){
  next.value =  next.value+"."
}
}
</script>

<style scoped lang="less">
.stage {
  width: 215px;
  height: 355px;
  border: 1px solid rgb(118, 118, 118);
  background-color: #f7f2ec;
  border-radius: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.top {
  height: 20px;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}
.top2 {
  height: 20px;
  padding: 0 10px;
  margin-top: 5px;
  font-size: 12px;
}
.fr {
  float: right;
}
.center {
  height: 140px;
  margin-bottom: 10px;
  .center_top {
    font-size: 10px;
    color: rgba(0, 0, 0, 0.5);
    text-align: right;
    padding-right: 20px;
    word-wrap: break-word;
    overflow: hidden;
  }
  .center_bottom {
    font-size: 40px;
    text-align: right;
    color: black;
    padding-right: 20px;
    word-wrap: break-word;
  }
}
.zitian {
  font-size: 10px;
  line-height: 20px;
  height: 20px;
}
.bottom {
  height: 100%;
  .bottom_box {
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    padding: 2px;
    justify-content: space-between;
    .bottom_button {
      width: 23.5%;
      height: 15%;
      background-color: rgba(255, 255, 255, 0.808);
      border: 1px solid rgba(171, 171, 171, 0.292);
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      font-size: 10px;
    }
    .bottom_button:hover {
      background-color: rgb(231, 229, 229);
    }
    .bottom_button:active {
      background-color: white;
    }
    .backan {
      background-color: rgba(246, 245, 245, 0.683);
    }
    .backlan {
      background-color: rgba(135, 186, 233, 0.354);
    }
  }
}
</style>
