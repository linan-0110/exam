<template>
    <div id="app">
        <article class="left">
			<el-button style="margin-bottom: 10px" type="warning" plain @click="addBatch">批量添加</el-button>
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
				row-key="id"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" :reserve-selection="true" width="55"> </el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名"
                    width="220"
                ></el-table-column>
                <el-table-column
                    prop="synthesisExponent"
                    label="综合指数"
                ></el-table-column>
                <el-table-column
                    prop="innovateExponent"
                    label="创新指数"
                ></el-table-column>
                <el-table-column
                    prop="income"
                    label="营业收入(万元)"
                ></el-table-column>
                <el-table-column
                    prop="revenue"
                    label="税收(万元)"
                ></el-table-column>
                <el-table-column
                    prop="investment"
                    label="固投(万元)"
					sortable
                ></el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template v-slot="scope">
						<span v-if="scope.row.investment <= 0" style="color: #C8C1BC">已添加</span>
                        <span
							v-else
							style="color: #803525;font-weight: 600"
                            @click="add(scope.row)"
                        >
                            添加
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
				<el-pagination style="margin: 15px" background layout="prev, pager, next" @current-change="pageChange" :page-size="pageSize" :page-count="pageCount"></el-pagination>
			</div>
        </article>

        <article class="right">
			<div class="title">待提交({{ totalTable2 }})</div>
			<el-button style="margin-bottom: 10px" type="warning" plain @click="delBatch">批量删除</el-button>
			<el-button style="margin-bottom: 10px" type="warning" plain @click="delAll">清空</el-button>
			<el-table
                ref="multipleTable"
                :data="tableData2 "
                tooltip-effect="dark"
				row-key="id"
                style="width: 100%"
                @selection-change="handleSelectionChange2"
            >
                <el-table-column type="selection" :reserve-selection="true" width="55"> </el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名"
                    width="220"
                ></el-table-column>
            </el-table>
            <div class="pagination">
				<el-pagination style="margin: 15px" background layout="prev, pager, next" @current-change="pageChange2" :page-size="pageSize2" :page-count="pageCount2"></el-pagination>
			</div>
		</article>
    </div>
</template>

<script>
const pageSize = 5
const pageSize2 = 5
export default {
    name: "App",
    data() {
        return {
			data: data,
			pageCount: Math.ceil(data.length/pageSize),
			pageSize,
			page: 1,
			tableData: [],
			multipleSelection: [],
			lastMultipleSelection: [],

			data2: data2,
			pageCount2: Math.ceil(data2.length/pageSize2),
			pageSize2,
			page2: 1,
			totalTable2: data2.length,
			tableData2: [],
            multipleSelection2: [],
        };
	},
	computed: {
		
	},
	watch: {
		
	},
	created() {
		this.tableData.push(...this.data.slice((this.page - 1)*pageSize, this.page*pageSize))
		this.tableData2.push(...this.data2.slice((this.page2 - 1)*pageSize2, this.page2*pageSize2))
	},
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val
		},
		pageChange(p) {
			this.page = p;
			this.tableData = []
			this.tableData.push(...this.data.slice((p - 1)*pageSize, p*pageSize))
		},
		addBatch() {
			if(this.multipleSelection.length == 0) {
				this.$message.warning('请选择要添加的项！');
				return
			}
			this.$confirm("确认添加所选项？").then(() => {
				console.log('确认')
				// 从新计算 tableData2
				let differenceSet = subSet(this.multipleSelection, this.lastMultipleSelection)
				this.tableData2 = this.data
				this.data2.push(...differenceSet)
				console.log(this.tableData2.length)
				console.log(pageSize2)
				if(this.tableData2.length < pageSize2) {
					console.log(this.data2.slice((this.page2 - 1)*pageSize2, this.page2*pageSize2))
					this.tableData2.push(...this.data2.slice((this.page2 - 1)*pageSize2, this.page2*pageSize2))
				}
				this.pageCount2 = Math.ceil(this.data2.length/pageSize2)
				// 保留之前提交过的数据
				this.lastMultipleSelection.push(...differenceSet)
				// 移动之后 删除原来数组
				differenceSet.forEach(item => {
					item.investment = 0
					// console.log()
					// let findIndex = this.data.findIndex(({id}) => item.id == id)
					// this.data.splice(findIndex,1)
				})
				// 从新计算 tableData
				// 从新计算 页数
				this.pageCount = Math.ceil(this.data.length/pageSize)
				
			}).catch(() => {console.log('取消')})
		},
		add(val) {
			this.$confirm("确认添加？").then(() => {
				this.data2.push(val)
				this.tableData2.push(...this.data2.slice((this.page2 - 1)*pageSize2, this.page2*pageSize2))
				this.pageCount2 = Math.ceil(this.data2.length/pageSize2)
			}).catch(() => {console.log('取消')})
		},

		handleSelectionChange2(val) {
            this.multipleSelection2 = val
		},
		pageChange2(p) {
			this.page2 = p;
			this.tableData2 = []
			this.tableData2.push(...this.data2.slice((p - 1)*pageSize2, p*pageSize2))
		},
		delBatch() {
			if(this.multipleSelection2.length == 0) {
				this.$message.warning('请选择要移除的项！');
				return
			}
			this.$confirm("确认删除所选项？").then(() => {
				console.log('确认')
			}).catch(() => {console.log('取消')})
		},
		delAll() {
			if(this.data2.length == 0) {
				this.$message.warning('列表已经为空！');
				return
			}
			this.$confirm("确认清空有列表？").then(() => {
				this.data2 = []
				this.tableData2 = []
				this.pageCount2 = 1
			}).catch(() => {console.log('取消')})
		},
    },
};
// 求数组差集
function subSet (arr1, arr2) {
        var set2 = new Set(arr2);
        var subset = [];
        arr1.forEach(function(val, index) {
            if (!set2.has(val)) {
                subset.push(val);
            }
        });
        return subset;
};
let data2 = []
// let data2 = [{
// 					id: 1000,
//                     name: "**市****限公司",
//                     synthesisExponent: 32.88,
//                     innovateExponent: 16.36,
//                     income: 8054.4,
// 					revenue: 238.21,
// 					investment: 0
//                 },
//                 {
// 					id: 1001,
//                     name: "**市****司",
//                     synthesisExponent: 32.88,
//                     innovateExponent: 16.36,
//                     income: 8054.4,
// 					revenue: 238.21,
// 					investment: 0
//                 },
//                 {
// 					id: 1002,
//                     name: "**市****备有限公司",
//                     synthesisExponent: 32.88,
//                     innovateExponent: 16.36,
//                     income: 8054.4,
// 					revenue: 238.21,
// 					investment: 0
// 				},
// 				{
// 					id: 1003,
//                     name: "**市****安装有限公司",
//                     synthesisExponent: 32.88,
//                     innovateExponent: 16.36,
//                     income: 8054.4,
// 					revenue: 238.21,
// 					investment: 0
//                 },
//                 {
// 					id: 1004,
//                     name: "**市****司",
//                     synthesisExponent: 32.88,
//                     innovateExponent: 16.36,
//                     income: 8054.4,
// 					revenue: 238.21,
// 					investment: 0
//                 },
//                 {
// 					id: 1005,
//                     name: "**市****业有限公司",
//                     synthesisExponent: 32.88,
//                     innovateExponent: 16.36,
//                     income: 8054.4,
// 					revenue: 238.21,
// 					investment: 0
//                 },
//                 {
// 					id: 1006,
//                     name: "**市****科技有限公司",
//                     synthesisExponent: 32.88,
//                     innovateExponent: 16.36,
//                     income: 8054.4,
// 					revenue: 238.21,
// 					investment: 0
//                 },
//                 {
// 					id: 1007,
//                     name: "**市****科技有限公司",
//                     synthesisExponent: 32.88,
//                     innovateExponent: 16.36,
//                     income: 8054.4,
// 					revenue: 238.21,
// 					investment: 0
//                 },
//                 {
// 					id: 1008,
//                     name: "**市****科技有限公司",
//                     synthesisExponent: 32.88,
//                     innovateExponent: 16.36,
//                     income: 8054.4,
// 					revenue: 238.21,
// 					investment: 0
//                 },
//                 {
// 					id: 1009,
//                     name: "**市****科技有限公司",
//                     synthesisExponent: 32.88,
//                     innovateExponent: 16.36,
//                     income: 8054.4,
// 					revenue: 238.21,
// 					investment: 0
//                 },
//                 {
// 					id: 1010,
//                     name: "**市****科技有限公司",
//                     synthesisExponent: 32.88,
//                     innovateExponent: 16.36,
//                     income: 8054.4,
// 					revenue: 238.21,
// 					investment: 0
//                 },
//                 {
// 					id: 1011,
//                     name: "**市****科技有限公司",
//                     synthesisExponent: 32.88,
//                     innovateExponent: 16.36,
//                     income: 8054.4,
// 					revenue: 238.21,
// 					investment: 0
//                 },
//                 {
// 					id: 1012,
//                     name: "**市****科技有限公司",
//                     synthesisExponent: 32.88,
//                     innovateExponent: 16.36,
//                     income: 8054.4,
// 					revenue: 238.21,
// 					investment: 0
//                 },
//                 {
// 					id: 1013,
//                     name: "**市****科技有限公司",
//                     synthesisExponent: 32.88,
//                     innovateExponent: 16.36,
//                     income: 8054.4,
// 					revenue: 238.21,
// 					investment: 0
//                 },
// ]
let data =  [{
					id: 0,
                    name: "**市****有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 2123,
                },
                {
					id: 1,
                    name: "**市****限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 3123,
                },
                {
					id: 2,
                    name: "**市****司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 2123,
                },
                {
					id: 3,
                    name: "**市****备有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 2123,
                },
                {
					id: 4,
                    name: "**市****安装有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 8795.0,
                },
                {
					id: 5,
                    name: "**市****司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 6541.2,
                },
                {
					id: 6,
                    name: "**市****业有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 2123,
                },
                {
					id: 7,
                    name: "**市****科技有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 6457.5,
                },
                {
					id: 8,
                    name: "**市****科技有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 6457.5,
                },
                {
					id: 9,
                    name: "**市****科技有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 6457.5,
                },
                {
					id: 10,
                    name: "**市****科技有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 2131,
                },
                {
					id: 11,
                    name: "**市****科技有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 458.5,
                },
                {
					id: 12,
                    name: "**市****科技有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 372.5,
                },
                {
					id: 13,
                    name: "**市****科技有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 378.5,
                },
                {
					id: 14,
                    name: "**市****科技有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 3564.5,
                },
                {
					id: 15,
                    name: "**市****科技有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 684.5,
                },
                {
					id: 16,
                    name: "**市****科技有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 648.5,
                },
                {
					id: 17,
                    name: "**市****技有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 6457.5,
                },
                {
					id: 18,
                    name: "**市****技有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 4856.5,
                },
                {
					id: 19,
                    name: "**市****科技有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 3123,
                },
                {
					id: 20,
                    name: "**市****科技有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 3123,
                },
                {
					id: 21,
                    name: "**市****科技有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 3168,
                },
            ]
</script>

<style lang="scss" scope>
#app {
    display: flex;
    padding: 30px 15px;
    .left {
        border: 1px solid #f6f3ec;
        border-radius: 5px;
        background-color: #f7fcf8;
        padding: 10px;
        flex-grow: 1;
		margin-right: 10px;
		.pagination{
			display: flex;
			justify-content: flex-end;
		}
    }
    .right {
        border: 1px solid #f6f3ec;
        border-radius: 5px;
        padding: 10px;
        background-color: #fcfaf7;
		width: 350px;
		.title{
			color: #803424;
			margin: 10px 0;
		}
    }
}
</style>
