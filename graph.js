//图对象
function graph() {
	this.data={
		ready:false,
		Mat:[],
		List:[]
	};//数据类
	this.set={};//设置类
	this.attr={};//性质类
	this.print= {};//打印类
	this.is={};//谓词类
	
	this.set.ByList = function(list){//由邻接链表创建
		if(list.length==undefined)
			return {
				status:false,
				response:"list非邻接链表，创建失败"
			};
		if(list.length==0)
			return {
				status:false,
				response:"空链表list，创建失败"
			};
		for(var i=0,leni=list.length;i<leni;i++){
			if(list[i].length);
		}
	}
	this.set.ByMat = function(mat){//由矩阵创建
		if(mat.length==undefined)
			return {
				status:false,
				response:"mat非矩阵，创建失败"
			};
		if(mat.length==0)
			return {
				status:false,
				response:"mat为空，创建失败"
			};
		var size = mat[0].length;
		if(size!=mat.length)
			return {
				status:false,
				response:"mat长宽不等，创建失败"
			};
		for(var i=1;i<size;i++)
			if(size!=mat[i].length)
				return {
					status:false,
					response:"mat每行不等长，创建失败"
				};
		data.Mat=mat;
		attr={};//清空性质
		data.ready=true;//数据准备完毕
		return {
			status:true,
			response:"创建成功"
		};
	}
	//打印输出类
	
	this.print.Mat=function () {//打印邻接矩阵
		if(!data.ready) return {
			status:false,
			response:"数据未准备好"
		};
		var Mat = data.Mat;
		for(var i=0,leni=Mat.length;i<leni;i++)
			//for(var j=0,lenj=Mat[i].length;j<lenj;j++)
				console.log(Mat[i]);
		return {
			status:true,
			response:"打印邻接矩阵成功"
		};
	}

	this.is.Undirected=function(){//是无向图吗？
		if(!data.ready)
			return {
				status:false,
				response:"数据未准备好"
			};
		//如果之前已经算过，则直接返回
		if(attr.Undirected!=undefined)
			return attr.Undirected;
		//由邻接矩阵的暴力检索O(V^2)
		for(var i=0,leni=data.Mat.length;i<leni;i++)
			for(var j=i+1,lenj=data.Mat[i].length;j<lenj;j++)
				if(!!data.Mat[i][j] != !!data.Mat[j][i]){//取逻辑值，非0为true，否则为false
					attr.Undirected = false;//记录性质
					return {
						status:false,
						response:"反例：从顶点"+i+"到顶点"+j+"的边是单向的"
					};
				}
		attr.Undirected = true;//记录性质
		return {
			status:true,
			response:"是无向图"
		};
	}
	//End
	return this;
};
//Example Call
var G = graph();
var mat=[[1,2,3],[2,3,4],[2,3,2]];
var log=[];
log.push(G.set.ByMat(mat));
log.push(G.print.Mat());
log.push(G.is.Undirected());
console.log(log);

