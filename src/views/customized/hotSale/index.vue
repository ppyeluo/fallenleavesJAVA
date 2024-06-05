<template>
    <div class="hotSale_container" style="width: 90%;">
        <div class="title" style="margin-bottom: .7em;font-size: 1.3em;font-weight: 600;color:  #4a00e0;">
            <span>热销榜</span>
            <button @click="printForm" class="print">打印热销榜单</button>
        </div>
        <el-table :data="tableData" stripe border
            :header-cell-style="{ backgroundColor: '#ffaa94', color: '#ffffff' }"
            :cell-style="{ backgroundColor: ' #FF8C00', color: '#fff' }"
            >
            <el-table-column type="index" label="排名" align="center" />
            <el-table-column prop="name" label="商品名称" align="center" />
            <el-table-column prop="dealTotal" label="交易额（万元）" align="center" />
            <el-table-column prop="sold" label="订单量" align="center" />
        </el-table>
    </div>
</template>

<script setup lang='ts'>
defineOptions({ name: 'HotSold' })
import { reqHotSaleCommodity } from '@/api/customized';
import { HotSaleCommodity, Result } from '@/api/customized/type';
import { onMounted, ref } from 'vue';
import * as XLSX from 'xlsx';

let tableData = ref<HotSaleCommodity[]>([])
const getData = async () => {
    let result: Result<HotSaleCommodity[]> = await reqHotSaleCommodity()
    if(result.code === 200){
        tableData.value = result.data
        console.log(tableData.value)
    }
}
onMounted(getData)
const printForm = () => {
    if(tableData.value.length){
      // 创建一个工作簿
      const workbook = XLSX.utils.book_new();

      // 将数据转换成工作表
      const worksheet = XLSX.utils.json_to_sheet(tableData.value.map(i => {
        return {
            '商品名称': i.name,
            '销售总额(万元)': i.dealTotal,
            '售卖量': i.sold
        }
      }))
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // 生成 Excel 文件并下载
      XLSX.writeFile(workbook, `热销榜单-${getCurrentDateTimeString()}.xlsx`);
    }
}
function getCurrentDateTimeString() {
  // 获取当前时间
  const currentDate = new Date()

  // 格式化年月日时分秒
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')
  const hour = String(currentDate.getHours()).padStart(2, '0')
  const minute = String(currentDate.getMinutes()).padStart(2, '0')
  const second = String(currentDate.getSeconds()).padStart(2, '0')

  // 拼接成字符串
  const formattedDateTime = `${year}年${month}月${day}日 ${hour}:${minute}:${second}`

  return formattedDateTime;
}

</script>

<style scoped lang='scss'>
.print{
    margin-left: 2em;
    display: inline-block;
    padding: .7em 1em;
    font-size: .8em;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
.print:hover {
  background-color: #0056b3;
}

.print:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
}
</style>