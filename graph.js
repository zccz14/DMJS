//图对象
function graph() {
	this.data = {
		//VertexSet: [], //点集
		//EdgeSet: [], //边集
		ready: false, //数据准备标记
		Mat: [], //邻接矩阵
		List: [], //邻接链表
		WMat:undefined,//权值矩阵
		Deg: {
			In: [], //入度
			CountIn: undefined, //Deg.CountIn[i]代表入度为i的结点数
			CountOut: undefined //Deg.CountOut[i]代表出度为i的结点数
		}, //结点的度
		Edge: undefined, //边数
		ReachableMatrix: undefined //可达矩阵
	}; //数据缓冲类
	this.set = {
		ByList: undefined,//由邻接链表生成图
		ByMat: undefined,//由邻接矩阵生成图
		AddEdge:undefined,//加边
		AddVertex:undefined,//加点
		DeleteEdge:undefined,//删边
		DeleteVertex:undefined//删点
	}; //设置类
	this.attr = {}; //性质类
	this.print = {}; //打印类
	this.is = {
		MultiGraph: undefined, //是否多重图
		SimpleGraph: undefined, //是否简单图
		Isomorphism: undefined, //是否同构于..
		IsomorphicFunction: undefined //是否为同构函数
	}; //谓词类
	this.calc = {
		Deg: {
			In: undefined, //入度
			Out: undefined, //出度
			CountIn: undefined, //入度统计
			CountOut: undefined //出度统计
		}, //度数
		ReachableMatrix: undefined, //计算可达矩阵
		ComplementGraph: undefined, //补图
		Edge: undefined //计算边
	}; //计算类
	//实现
	this.is.IsomorphicFunction = function(Ga,h){//h是G到Ga的同构映射吗
		if(data.ready && Ga.data.ready){
			//Todo:判定G,Ga的
			if(data.Mat.length != Ga.data.Mat.length) return {
				status:false,
				response:"两图顶点数不同"
			};
			if(h.length == undefined || h.length !=data.Mat.length) return{
				status:false,
				response:"映射不合法"
			};
			//验证双射性，排序后hc[i]==i
			var hc=h;
			hc.sort();
			for(var i=0,len=hc.length;i<len;i++)
				if(hc[i]!=i) return{
					status:false,
					response:"映射非双射"
				};
			//暴力检验，O(V^2)
			for(var i=0,len=data.Mat.length;i<len;i++)
				for(var j=0;j<len;j++)
					if(data.Mat[h[i]][h[j]]!=Ga.data.Mat[i][j])
						return {
							//此映射不能使邻接矩阵完全一致
							status:true,
							response:false
						};
			//那就是正确的同构函数
			return{
				status:true,
				response:true
			};
		} else return {
			status:false,
			response:"数据未准备完毕"
		};
	};
	this.calc.Deg.CountIn = function() { //入度统计
		if (data.ready) {
			//try to read cache
			if (data.Deg.CountIn != undefined) return {
				status: true,
				response: data.Deg.CountIn
			};
			for (var i = 0, len = data.Mat.length; i < len; i++) {
				var d = calc.Deg.In(i); //计算v[i]的入度
				if (data.Deg.CountIn[d] == undefined) //如果没有定义过则是1
					data.Deg.CountIn[d] = 1;
				else data.Deg.CountIn[d] ++; //否则++
			}
			//未定义的也要定义为零
			for (var i = 0, len = data.Deg.CountIn.length; i < len; i++)
				if (data.Deg.CountIn[i] == undefined)
					data.Deg.CountIn[i] = 0;
			return {
				status: true,
				response: data.Deg.CountIn
			};
		} else return {
			status: false,
			response: "数据未准备完毕"
		};
	};
	this.calc.Deg.CountOut = function() { //出度统计
		if (data.ready) {
			//try to read cache
			if (data.Deg.CountOut != undefined) return {
				status: true,
				response: data.Deg.CountOut
			};
			for (var i = 0, len = data.Mat.length; i < len; i++) {
				var d = calc.Deg.Out(i); //计算v[i]的出度
				if (data.Deg.CountOut[d] == undefined) //如果没有定义过则是1
					data.Deg.CountOut[d] = 1;
				else data.Deg.CountOut[d] ++; //否则++
			}
			//未定义的也要定义为零
			for (var i = 0, len = data.Deg.CountOut.length; i < len; i++)
				if (data.Deg.CountOut[i] == undefined)
					data.Deg.CountOut[i] = 0;
			return {
				status: true,
				response: data.Deg.CountOut
			};
		} else return {
			status: false,
			response: "数据未准备完毕"
		};
	};
	this.calc.Edge = function() { //计算总边数
		if (data.ready) {
			//尝试加载缓存
			if (data.Edge != undefined)
				return {
					status: true,
					response: data.Edge
				};
			var sum = 0;
			for (var i = 0, len = data.List.length; i < len; i++)
				sum += data.List[i].length; //由邻接链表的长度累加而成
			data.Edge = sum; //设置缓存
			return {
				status: true,
				response: sum
			};
		} else return {
			status: false,
			response: "数据未准备完毕"
		};
	};
	this.is.Isomorphism = function(Ga) { //是否与另一个图重构
		if (data.ready && Ga.data.ready) {
			if (data.Mat.length != Ga.data.Mat.length || calc.Edge() != Ga.calc.Edge()) return {
				//不满足必要条件则必不同构
				status: true,
				response: false
			};
			//统计
			calc.Deg.CountIn();
			calc.Deg.CountOut();
			Ga.calc.Deg.CountIn();
			Ga.calc.Deg.CountOut();
			if (data.Deg.CountIn.length != Ga.data.Deg.CountIn.length || data.Deg.CountOut.length != Ga.Deg.CountOut.length) return {
				//长度不同
				status: true,
				response: false
			};
			//Assert:the same length of CountIn & CountOut
			for (var i = 0, len = data.Deg.CountIn.length; i < len; i++)
				if (data.Deg.CountIn[i] != Ga.data.Deg.CountIn[i])
					return {
						status: true,
						response: false
					};
			for (var i = 0, len = data.Deg.CountOut.length; i < len; i++)
				if (data.Deg.CountOut[i] != Ga.data.Deg.CountOut[i])
					return {
						status: true,
						response: false
					};
			//Todo:
		} else return {
			status: false,
			response: "数据没有准备完毕"
		};
	};
	this.is.SimpleGraph = function() { //是否简单图
		if (data.ready) {
			//尝试加载缓存
			if (attr.SimpleGraph != undefined) return {
				status: true,
				response: attr.SimpleGraph
			}
			if (attr.MultiGraph == true || (attr.MultiGraph == undefined && is.MultiGraph().response == true)) return {
				//是多重图的情况一定不是简单图
				status: true,
				response: false
			};
			//判断有无自环
			for (var i = 0, size = data.Mat.length; i < size; i++)
				if (data.Mat[i][i] != 0) {
					attr.SimpleGraph = false;
					return {
						//有自环
						status: true,
						response: false
					};
				}
				//无自环，是简单图
			attr.SimpleGraph = true;
			return {
				status: true,
				response: true
			};
		} else return {
			status: false,
			response: "数据未准备完毕"
		};
	};
	this.is.MultiGraph = function() { //是否多重图
		if (data.ready) {
			//尝试加载缓存
			if (attr.MultiGraph != undefined) return {
				status: true,
				response: attr.MultiGraph
			};
			for (var i = 0, size = data.Mat.length; i < size; i++)
				for (var j = 0; j < size; j++)
					if (data.Mat[i][j] > 1) {
						attr.MultiGraph = true; //设置缓存
						return {
							status: true,
							response: true
						};
					}
			attr.MultiGraph = false; //设置缓存
			return {
				status: true,
				response: false
			};
		} else return {
			status: true,
			response: "数据未准备完毕"
		};
	};
	this.calc.ComplementGraph = function() { //求补图
		if (data.ready) {
			//如果不是简单图要退出
			if (!is.SimpleGraph().response) return {
				status: false,
				response: "非简单图没有补图"
			};
			var mat = data.Mat;
			var Gc = new graph();
			for (var i = 0, size = mat.length; i < size; i++)
				for (var j = 0; j < size; j++)
					if (i != j) //除了对角线上的元素
						mat[i][j] ^= 1; //toggle:自异或
			console.log(mat);
			Gc.set.ByMat(mat);
			return {
				status: true,
				response: Gc
			};
		} else return {
			status: false,
			response: "数据未准备完毕"
		};

	};
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
	};
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
	};
	this.print.Mat = function(Mat) { //打印矩阵
		if (!data.ready) return {
			status: false,
			response: "数据未准备好"
		};
		//var Mat = data.Mat;
		for (var i = 0, leni = Mat.length; i < leni; i++)
			console.log(Mat[i]);
		return {
			status: true,
			response: "打印矩阵成功"
		};
	};
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
	};
	this.is.InRange = function(vertex) { //Vertex下标是否在范围内
		if (data.ready) {
			if (vertex < 0 || vertex >= data.Mat.length)
				return {
					status: true,
					response: false
				};
			else return {
				status: true,
				response: true
			};
		} else return {
			status: false,
			response: "数据未准备完毕"
		};
	};
	this.calc.Deg.Out = function(vertex) { //计算出度
		if (data.ready) {
			if (!is.InRange(vertex)) return {
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
	};
	this.calc.Deg.In = function(vertex) { //计算入度
		if (data.ready) {
			if (!is.InRange(vertex)) return {
				status: false,
				response: "结点下标越界"
			};
			//试图读缓存
			if (data.Deg.In[vertex] != undefined) return {
				status: true,
				response: data.Deg.In[vertex]
			};
			if (attr.Undirected == true) return {
				//如果有无向图的性质，优化到O(1)
				status: true,
				response: calc.Deg.Out(vertex).response
			}
			var sum = 0;
			//累计各点到vertex的边数和,O(V)
			for (var i = 0, len = data.Mat.length; i < len; i++)
				sum += data.Mat[i][vertex];
			data.Deg.In[vertex] = sum; //设置缓存
			return {
				status: true,
				response: sum
			};
		} else return {
			status: false,
			response: "数据未准备完毕"
		};
	};
	this.calc.ReachableMatrix = function() { //求可达矩阵
		if (data.ready) {
			if (data.ReachableMatrix != undefined) return {
				status: true,
				response: "从缓存取得可达矩阵"
			};
			//Wallshall算法,O(V^3)
			var R = data.Mat;
			var len = R.length;
			//Boolean化
			for (var i = 0; i < len; i++)
				for (var j = 0; j < len; j++)
					R[i][j] = !!R[i][j];
			for (var k = 0; k < len; k++)
				for (var i = 0; i < len; i++)
					for (var j = 0; j < len; j++)
						R[i][j] |= (R[i][k] && R[k][j]);
			data.ReachableMatrix = R;
			return {
				status: true,
				response: "Wallshall算法求可达矩阵成功"
			};
		} else return {
			status: false,
			reponse: "数据未准备好"
		};
	};
	this.is.Reachable = function(start, end) { //从start到end是否可达？
		if (data.ready) {
			if (!is.InRange(start).response || !is.InRange(end).response) return {
				status: false,
				response: "结点越界"
			};
			if (data.ReachableMatrix != undefined) { //如果已经计算可达矩阵,O(1)
				return {
					status: true,
					response: !!data.ReachableMatrix[start][end]
				};
			}
			//邻接矩阵的BFS寻路,O(V^2)
			var queue = [start];
			var size = data.Mat.length;
			var visited = [];
			for (var i = 0; i < size; i++)
				visited.push(false);
			while (queue.length > 0) {
				var x = queue.shift(); //取队首并出队
				if (x == end) return {
					status: true,
					response: true
				};
				visited[x] = true; //访问标记
				for (var i = 0; i < size; i++) { //i是下一个结点
					if (!visited[i] && data.Mat[x][i] > 0) //如果没访问过且有边
						queue.push(i); //加入队列
				}
			}
			//如果之前没有return说明没有通路
			return {
				status: true,
				response: false
			};
		} else return {
			status: false,
			response: "数据未准备完毕"
		};
	};
	//End
	return this;
};
//Example Call
var G = graph();
var mat = [
	[0, 1, 0],
	[1, 0, 0],
	[0, 1, 0]
];
var list = [
	[1, 1],
	[1, 1]
];
var log = [];
log.push(G.set.ByMat(mat));
//log.push(G.data.Mat);
var Gc = G.calc.ComplementGraph().response; //求补图
//log.push(Gc.print.Mat(Gc.data.Mat));
log.push(Gc.print.Mat(Gc.data.Mat));
//log.push(G.data.List);
//log.push(G.calc.Deg.Out(0)); //计算结点0的出度
//log.push(G.data.List);
//log.push(G.is.Undirected());
//log.push(G.calc.ReachableMatrix()); //求可达矩阵
//log.push(G.print.Mat(G.data.ReachableMatrix)); //打印可达矩阵
//log.push(G.is.Reachable(0, 1));
console.log(log);