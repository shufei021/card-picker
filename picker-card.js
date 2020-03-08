class PickerCard{
    constructor(opt){
        this.options = opt
        this.trigger = this._g(this.options.trigger)
        this.list = this.options.list
        this.province = null
        this.city = null
        this.district = null
        this._init()  
    }
    _render(className,list){
        this.pickerList.innerHTML = ''
        let html = ''
        for(let i=0;i<list.length;i++) {
            html+=`<li class="${className}">${list[i].text}</li>`
        }
        setTimeout(()=>{
            this.pickerList.innerHTML = `<ul>${html}</ul>` 
        },100)
    }
    _open(){
        this.picker.classList.remove('hide')
        this.picker.classList.add('show')
        this.pickerContainer.classList.remove('hide')
        this.pickerContainer.classList.add('show')
    }
    _close(){
        document.body.removeChild(this.picker)  
    }
    _createContainer(){
        let container = document.createElement('div');
        container.className = "picker hide"
        container.innerHTML = `
        <div class="picker-container hide">
            <div class="picker-content">
                ${this.options.title?'<div class="picker-title">'+this.options.title+'</div>':''}
                <div class="picker-topbar"></div>
                <div class="picker-list" style="height:calc(100% - ${this.options.title?'70px':'40px'})"></div>
            </div> 
        </div>`
        document.body.appendChild(container)
        this.picker = this._g('.picker')
        this.pickerContainer = this._g('.picker-container')
        this.pickerList = this._g('.picker-list')
        this.pickerTopbar = this._g('.picker-topbar')
        this.pickerTitle = this._g('.picker-title')
        this._render("province-item",this.list)
    }
    _init(){
        this.trigger.addEventListener('click',e=>{
            this._createContainer()
            this._render("province-item",this.list)
            this.pickerTopbar.innerHTML = `<div class="picker-title-item"><span class="active">请选择</span></div>`
            this._open()
            this.picker.addEventListener('click',e=>{
                if(e.target.classList.contains("picker") ){
                this._close()
                }else if(e.target.className === "province-item"){ //监听省市区点击 Province City District
                    this.province = e.target.innerHTML
                    if(this.options.type ==1){
                        this.options.success && this.options.success([this.province])
                        this._close()
                        return;
                    }
                    let _list = this.list.find(item=>item.text == e.target.innerHTML).children
                    this._render("city-item",_list)
                    this.pickerTopbar.innerHTML = `
                    <div class="picker-title-item"><span>${this.province}</span></div>
                    <div class="picker-title-item"><span class="active">请选择</span></div>`
                    
                }else if(e.target.className === "city-item"){
                    this.city = e.target.innerHTML
                    if(this.options.type ==2){
                        this.options.success && this.options.success([this.province,this.city])
                        this._close()
                        return;
                    }
                    let _list = this.list.find(item=>item.text == this.province).children.find(item=>item.text ==this.city).children
                    this._render("district-item",_list)
                    this.pickerTopbar.innerHTML = `
                    <div class="picker-title-item"><span>${this.province}</span></div>
                    <div class="picker-title-item"><span>${this.city}</span></div>
                    <div class="picker-title-item"><span class="active">请选择</span></div>`
                }else if(e.target.className === "district-item"){
                    if(this.options.type ==3){
                        this.district = e.target.innerHTML
                        this.options.success && this.options.success([this.province,this.city,this.district])
                        this._close()
                    }
                }
            })
        },false)

        
    }
    //获取元素
    _g(s){s
        return document.querySelector(s)
    } 
}