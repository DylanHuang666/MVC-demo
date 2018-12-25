fakeData()

//modul模块
let model={
    data:{               //初始data
        name:'',
        number:0,
        id:''
    },
    fetch(id){                                        //获取数据
        return axios.get(`/books/${id}`).then((response)=>{
            this.data=response.data
            return response
        })     
    },
    update(id,data){         //更新数据
        return axios.put(`/books/${id}`,data).then((response)=>{
            this.data=response.data
            return response
        })
    }

}

//view模块
let view={          //操作可见部分
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
    `,
    render(data){
        let html=this.template.replace('__name__',data.name).replace('__number__',data.number) //对页面内容进行替换
        $(this.el).html(html)
    }
}

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
    let book = {
        name:'西游记',
        number:2,
        id:1
    }
    axios.interceptors.response.use(function(response){
        let {config:{method,url,data}}=response
        if(url==='/books/1' && method==='get'){
            response.data=book
        }else if(url==='/books/1' && method==='put'){
            data=JSON.parse(data)
            Object.assign(book,data)
            response.data=book
        }
        return response
    })
}