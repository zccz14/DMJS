//图对象
function graph() {
	this.data = {
		ready: false,
		Mat: [],
		List: []
	}; //数据类
	this.set = {}; //设置类
	this.attr = {}; //性质类
	this.print = {}; //打印类
	this.is = {}; //谓词类
	this.has = {}; //存在类
	this.calc = {
		Deg: {} //度数
	}; //计算类
	this.set.ByList = function(list) { //由邻接链表创建
		if (list.length == undefined)
			return {
				status: false,
				response: "list非邻接链表，创建失败"
			};
		if (list.length == 0)
			return {
				status: false,
				response: "空链表list，创建失败"
			};
		for (var i = 0, leni = list.length; i < leni; i++) {
			for (var j = 0, lenj = list[i].length; j < lenj; j++)
				if (list[i][j] >= list.length) {
					return {
						status: false,
						response: "list元素下标越界，创建失败"
					};
				}
		}
		//合法的数据，可以抛弃原有数据
		data = {};
		data.List = list;
		//同步到邻接矩阵
		data.Mat = [];
		for (var i = 0, leni = list.length; i < leni; i++) {
			data.Mat.push([]);
			for (var j = 0; j < leni; j++)
				data.Mat[i][j] = 0;
			for (var j = 0, lenj = list[i].length; j < lenj; j++)
				data.Mat[i][list[i][j]] ++;
		}
		attr = {}; //清空特性
		data.ready = true; //准备完毕
		return {
			status: true,
			response: "邻接链表创建成功"
		};
	}
	this.set.ByMat = function(mat) { //由矩阵创建
			if (mat.length == undefined)
				return {
					status: false,
					response: "mat非矩阵，创建失败"
				};
			if (mat.length == 0)
				return {
					status: false,
					response: "mat为空，创建失败"
				};
			var size = mat[0].length;
			if (size != mat.length)
				return {
					status: false,
					response: "mat长宽不等，创建失败"
				};
			for (var i = 0; i < size; i++)
				if (size != mat[i].length)
					return {
						status: false,
						response: "mat每行不等长，创建失败"
					};
				//合法的数据
			data = {};
			data.Mat = mat;
			//同步到邻接链表
			data.List = [];
			for (var i = 0; i < size; i++) {
				data.List.push([]);
				for (var j = 0; j < size; j++)
					for (var k = 0, lenk = mat[i][j]; k < lenk; k++)
						data.List[i].push(j);
			}
			attr = {}; //清空性质
			data.ready = true; //数据准备完毕
			return {
				status: true,
				response: "创建成功"
			};
		}
		//打印输出类

	this.print.Mat = function() { //打印邻接矩阵
		if (!data.ready) return {
			status: false,
			response: "数据未准备好"
		};
		var Mat = data.Mat;
		for (var i = 0, leni = Mat.length; i < leni; i++)
		//for(var j=0,lenj=Mat[i].length;j<lenj;j++)
			console.log(Mat[i]);
		return {
			status: true,
			response: "打印邻接矩阵成功"
		};
	}

	this.is.Undirected = function() { //是无向图吗？
		if (!data.ready)
			return {
				status: false,
				response: "数据未准备好"
			};
		//如果之前已经算过，则直接返回
		if (attr.Undirected != undefined)
			return attr.Undirected;
		//由邻接矩阵的暴力检索O(V^2)
		for (var i = 0, leni = data.Mat.length; i < leni; i++)
			for (var j = i + 1, lenj = data.Mat[i].length; j < lenj; j++)
				if (data.Mat[i][j] != data.Mat[j][i]) { //边数不同即为有向
					attr.Undirected = false; //记录性质
					return {
						status: false,
						response: "反例：从顶点" + i + "到顶点" + j + "的边是单向的"
					};
				}
		attr.Undirected = true; //记录性质
		return {
			status: true,
			response: "是无向图"
		};
	}
	this.calc.Deg.Out = function(vertex) { //计算出度
		if (data.ready) {
			if (vertex < 0 || vertex >= data.Mat.length) return {
				status: false,
				response: "结点下标越界"
			};
			return {
				status: true,
				//直接由邻接链表得到结果，O(1)
				response: data.List[vertex].length
			};
		} else return {
			status: false,
			response: "数据未准备完毕"
		};
	}
	this.calc.Deg.In = function(vertex) { //计算入度
			if (data.ready) {
				if (vertex < 0 || vertex >= data.Mat.length) return {
					status: false,
					response: "结点下标越界"
				}
				if (attr.Undirected == true) return { 
					//如果有无向图的性质，优化到O(1)
					status: true,
					response: calc.Deg.Out(vertex).response
				}
				var sum = 0;
				//累计各点到vertex的边数和,O(V)
				for (var i = 0, len = data.Mat.length; i < len; i++)
					sum += data.Mat[i][vertex];
				return {
					status: true,
					response: sum
				};
			} else return {
				status: false,
				response: "数据未准备完毕"
			};
		}
		//End
	return this;
};
//Example Call
var G = graph();
var mat = [
	[1, 2, 3],
	[2, 3, 4],
	[3, 4, 2]
];
var list = [
	[1, 1],
	[1, 1]
];
var log = [];
log.push(G.set.ByMat(mat));
log.push(G.print.Mat());
log.push(G.data.List);
//log.push(G.set.ByList(list));
log.push(G.print.Mat());
log.push(G.calc.Deg.Out(0)); //计算结点0的出度
log.push(G.data.Mat);
log.push(G.data.List);
log.push(G.is.Undirected());
log.push(G.calc.Deg.In(1)); //计算结点1的入度
console.log(log);