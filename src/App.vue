<template>
    <div id="app">
        <article class="left">
			<el-button style="margin-bottom: 10px" type="primary" plain @click="addBatch">批量添加</el-button>
            <el-table
                :header-cell-style="{backgroundColor: '#E8DED8'}"
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
				row-key="id"
                @select="select"
                @select-all="selectAll"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" :reserve-selection="true" width="55"> </el-table-column>
                <el-table-column
                    prop="name"
                    label="企业名称"
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
						<span v-if="scope.row.investment <= 0" style="color: #C8C1BC; cursor: pointer;">已添加</span>
                        <span
							v-else
							style="color: #803525;font-weight: 600;cursor: pointer;"
                            @click="add(scope.row)"
                        >
                            添加
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" background layout="prev, pager, next" @current-change="pageChange" :page-size="pageSize" :page-count="pageCount"></el-pagination>
        </article>

        <article class="right">
			<div class="title">待提交列表({{ data2.length }})</div>
			<div class="buttonGroup">
                <span>
                    <el-button style="margin-bottom: 10px" type="primary" plain @click="delBatch">批量删除</el-button>
			        <el-button style="margin-bottom: 10px" type="primary" plain @click="delAll">清空</el-button>
                </span>
			    <el-button style="margin-bottom: 10px" type="primary" @click="submit">提交</el-button>
                
            </div>
			<el-table
                :header-cell-style="{backgroundColor: '#E8DED8'}"
                ref="multipleTable2"
                :data="tableData2 "
                tooltip-effect="dark"
				row-key="id"
                style="width: 100%"
                @selection-change="handleSelectionChange2"
            >
                <el-table-column type="selection" :reserve-selection="true" width="100%"> </el-table-column>
                <el-table-column
                    prop="name"
                    label="企业名称"
                    width="220"
                >
                    <template v-slot="scope">
                        <div style="display:flex; justify-content: space-between;align-items: center;width: 100%">
                            <span>{{scope.row.name}}</span>
                            <i class="el-icon-close" @click="close(scope.row)"></i>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" background layout="prev, pager, next" @current-change="pageChange2" :page-size="pageSize2" :page-count="pageCount2" ref="pagination"></el-pagination>
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
        toggleSelection(rows) {
            if (rows) {
            rows.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row);
            });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        select(selection, row) {
            if(row.investment <= 0) {
                this.toggleSelection([row])
                this.$message.warning("已添加")
            }
        },
        selectAll(selection) {
            // 添加过的
            let tempArrAdded = selection.filter((item) => {
                return item.investment <= 0
            } )
            // 没添加过的
            let tempArrNoAdd = selection.filter((item) => {
                return item.investment > 0
            } )
            this.toggleSelection(tempArrAdded)
			if(tempArrNoAdd.length == 0) {
				this.$message.warning('当前页没有选中可添加的项！');
				return
			}
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
		},
		pageChange(p) {
			this.page = p;
			this.tableData = []
			this.tableData.push(...this.data.slice((p - 1)*pageSize, p*pageSize))
		},
		addBatch() {
            let addArr = this.multipleSelection.filter((item) => {
                if(item.investment <= 0) {
                    this.toggleSelection([item])
                }
                return item.investment > 0
            } )
			if(addArr.length == 0) {
				this.$message.warning('请选择要添加的项！');
				return
			}
			this.$confirm("确认添加所选项？").then(() => {
                // 从新计算 tableData2
                this.data2.push(...addArr)
				if(this.tableData2.length < pageSize2) {
                    this.tableData2 = []
					this.tableData2.push(...this.data2.slice((this.page2 - 1)*pageSize2, this.page2*pageSize2))
				}
				this.pageCount2 = Math.ceil(this.data2.length/pageSize2)
				// 移动之后 
				addArr.forEach(item => {
					item.investment = 0
                })
                this.toggleSelection()
				// 从新计算 页数
                this.pageCount = Math.ceil(this.data.length/pageSize)
                this.$message.success("添加成功！")
				
			}).catch(() => {console.log('取消')})
		},
		add(val) {
			this.$confirm("确认添加？").then(() => {
				this.data2.push(val)
				if(this.tableData2.length < pageSize2) {
                    this.tableData2 = []
					this.tableData2.push(...this.data2.slice((this.page2 - 1)*pageSize2, this.page2*pageSize2))
				}
                this.pageCount2 = Math.ceil(this.data2.length/pageSize2)
                val.investment = 0
                this.$message.success("添加成功！")
			}).catch(() => {console.log('取消')})
		},

        toggleSelection2(rows) {
            if (rows) {
            rows.forEach(row => {
                this.$refs.multipleTable2.toggleRowSelection(row);
            });
            } else {
            this.$refs.multipleTable2.clearSelection();
            }
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
                // 计算差集
                let temp = this.multipleSelection2.map(item => item.id)
                for(var i = this.data2.length - 1; i>=0; i--) {
                    if(temp.includes(this.data2[i].id)) {
                        this.data2.splice(i, 1)
                    }
                }
                this.pageCount2 = Math.ceil(this.data2.length/pageSize2)
                // 从新计算 tableData2
                this.tableData2 = []
                this.tableData2.push(...this.data2.slice((this.page2 - 1)*pageSize2, this.page2*pageSize2))
                this.multipleSelection2 = []
                if(this.tableData2.length <= 0) {
                    this.page2 -= 1
                    this.pageCount2 -= 1
                    this.$refs.pagination.internalCurrentPage = this.page2
                    console.log('555')
                    // 从新计算 tableData2
                    this.tableData2 = []
                    this.tableData2.push(...this.data2.slice((this.page2 - 1)*pageSize2, this.page2*pageSize2))
                }
                this.toggleSelection2()
                this.$message.success("批量移除成功！")
            }).catch((e) => {
                console.log(e)
                this.multipleSelection2 = []
                this.toggleSelection2()
            })
            // 清楚选项
            
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
                this.$message.success("移除成功！")
			}).catch(() => {console.log('取消')})
        },
        close(row) {
            console.log()
            let index = this.data2.findIndex(item => item.id == row.id)
            this.data2.splice(index, 1)
            // 从新计算 tableData2
            this.tableData2 = []
            this.tableData2.push(...this.data2.slice((this.page2 - 1)*pageSize2, this.page2*pageSize2))
            this.pageCount2 = Math.ceil(this.data2.length/pageSize2)
            if(this.tableData2.length <= 0) {
                this.page2 -= 1
                this.pageCount2 -= 1
                this.$refs.pagination.internalCurrentPage = this.page2
                // 从新计算 tableData2
                this.tableData2 = []
                this.tableData2.push(...this.data2.slice((this.page2 - 1)*pageSize2, this.page2*pageSize2))
            }
        },
        submit() {
            console.log('提交')
            console.log(this.data2)
            this.$confirm(JSON.stringify(this.data2)).then(
                this.$message.success('提交成功！')
            ).catch()
        }
    },
};
// 数组交集
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
                    name: "**市****技有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 6457.5,
                },
                {
					id: 9,
                    name: "**市****股份有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 6457.5,
                },
                {
					id: 10,
                    name: "**市****份有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 2131,
                },
                {
					id: 11,
                    name: "**市****技有限公司",
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
                    name: "**省****科**限公司",
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
                    name: "**省市****科技有限公司",
                    synthesisExponent: 32.88,
                    innovateExponent: 16.36,
                    income: 8054.4,
                    revenue: 238.21,
                    investment: 684.5,
                },
                {
					id: 16,
                    name: "**省****科技有限公司",
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
                    name: "**市****公司",
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
                    name: "**市****限公司",
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
    height: 60%;
    width: 100%;
    min-height: 600px;
    box-sizing: border-box;
    .left {
        flex-grow: 1;
        height: 100%;
        position: relative;
        border: 1px solid #ccc9c9;
        border-radius: 5px;
        background-color: #f7fcf8;
        padding: 10px;
		margin-right: 10px;
		.pagination{
			position: absolute;
            right: 15px;
            bottom: 10px;
		}
    }
    .right {
        height: 100%;
        // width: 350px;
        flex-basis: 350px;
        position: relative;
        border: 1px solid #ccc9c9;
        border-radius: 5px;
        padding: 10px;
        background-color: #fcfaf7;
        .buttonGroup{
            display: flex;
            justify-content: space-between;
        }
		.title{
			color: #803424;
			margin: 10px 0;
        }
        .pagination{
			position: absolute;
            right: 15px;
            bottom: 10px;
		}
    }
}

.el-icon-close:hover{
    background-color: rgb(202, 198, 198);
    border-radius: 50%;
}
</style>

