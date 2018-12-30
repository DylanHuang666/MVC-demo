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


//-------------------声明model,view对象
let model=new Model({
    data:{               //初始的data
        name:'',
        number:0,
        id:''
    },
    resouce:'book'
})

let view=new Vue({         //new Vue()
    el:'#app',       //template只能有一个根元素，所有再用一个div包住
    data:{
        book:{
            name:'未命名',
            number:0,
            id:''
        },
        n:1
    },           
    template:`
    <div>                       
        <div>
            书名：《{{book.name}}》
            数量：<span id="number">{{book.number}}</span>
        </div>
        <div>
            <input v-model="n"/>
            n的值为{{n}} 
        </div>
        <div>
            <button v-on:click="addOne">加n</button>
            <button v-on:click="minusOne">减n</button>
            <button v-on:click="reset">归零</button>
        </div>
    </div>
    `,
    created(){
        model.fetch(1).then(()=>{       //初始化完后就执行这个函数created
            this.book=model.data
        })
    },
    methods:{
        addOne(){
            model.update(1,{
                number:this.book.number+(this.n-0)
            }).then(()=>{
                this.book=model.data
            })
        },
        minusOne(){
            model.update(1,{
                number:this.book.number-(this.n-0)
            }).then(()=>{
                this.book=model.data
            })
        },
        reset(){
            model.update(1,{
                number:0
            }).then(()=>{
                this.book=model.data
            })
        }
    }
})


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