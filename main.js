fakeData()

//----------------构造函数封装Model类
function Model(options){
    this.data=options.data
    this.resouce=options.resouce
}
Model.prototype.fetch=function(id){           //Model类共有方法
    return axios.get(`/${this.resouce}s/${id}`).then((response)=>{
        this.data=response.data       //更改this.data的值
        return response
    })
}
Model.prototype.update=function(id,data){        //Model类共有方法
    return axios.put(`/${this.resouce}s/${id}`,data).then((response)=>{
        this.data=response.data   //更改this.data的值
        return response
    })
}

//----------------构造函数封装View类
function View({el,template}){
    this.el=el
    this.template=template
}
View.prototype.render=function(data){          //View类共有方法
    let html=this.template
    for(let key in data){
        html=html.replace(`__${key}__`,data[key])     
    }
    $(this.el).html(html)
}


//-------------------声明model,view对象
let model=new Model({
    data:{               //初始的data
        name:'',
        number:0,
        id:''
    },
    resouce:'book'
})

let view=new View({
    el:'#app',
    template:`
    <div>
        书名：《__name__》
        数量：<span id="number">__number__</span>
    </div>
    <div>
        <button id="addOne">加一</button>
        <button id="minusOne">减一</button>
        <button id="reset">归零</button>
    </div>
`})


//controller模块
var controller={           //其他逻辑执行代码
    init(options){
        let{view,model}=options
        this.view=view
        this.model=model
        this.bindEvents()
        this.model.fetch(1)
            .then(()=>{
                this.view.render(this.model.data)  
            })
        this.view.render(this.model.data)
        
    },
    addOne(){
        var oldNumber=$('#number').text()
        var newNumber=oldNumber-0+1
        this.model.update(1,{
            number:newNumber
        }).then(()=>{
            this.view.render(this.model.data)
        })
    },
    minusOne(){
        var oldNumber=$('#number').text()
        var newNumber=oldNumber-0-1
        this.model.update(1,{
            number:newNumber
        }).then(()=>{
            this.view.render(this.model.data)
        })
    },
    reset(){
        this.model.update(1,{
            number:0
        }).then(()=>{
            this.view.render(this.model.data)
        })
    },
    bindEvents(){
        $(this.view.el).on('click','#addOne',this.addOne.bind(this))        //bind(this)绑定this
        $(this.view.el).on('click','#minusOne',this.minusOne.bind(this))
        $(this.view.el).on('click','#reset',this.reset.bind(this))
    }
}


controller.init({view:view,model:model})   //执行




//造一个假的数据后台
function fakeData(){
    let book = {            //给个初始data
        name:'西游记',
        number:2,
        id:1
    }
    axios.interceptors.response.use(function(response){
        let {config:{method,url,data}}=response
        if(url==='/books/1' && method==='get'){
            response.data=book                    //response.data值更新
        }else if(url==='/books/1' && method==='put'){
            data=JSON.parse(data)
            Object.assign(book,data)
            response.data=book               //response.data值更新
        }
        return response
    })
}