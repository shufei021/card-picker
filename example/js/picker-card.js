/*!
 * PickerCard.js v1.0.0
 * (c) 2020 ShuFei
 * Released under the MIT License.
 */
function PickerCard(opt) {
    this.defaultConfig = {
      title: '',
      isShowControl: false,
      level:null,
      caseName: { text: 'text', children: 'children' }
    }
    this.options = Object.assign(this.defaultConfig, opt)
    if (!this.options.hasOwnProperty('trigger')) {
      throw Error('The parameter item trigger is required.')
    }
    if(this.IsDom(this.options.trigger)){
      this.trigger = this.options.trigger
    }else{
      this.trigger = this.GetElement(this.options.trigger)
      if (!this.trigger) {
        throw Error(this.trigger + ' is not a valid selector.')
      }
      if (!this.options.trigger.length) {
        throw Error('The provided trigger selector is empty value.')
      }
    }
    this.list = this.options.list
    this.selectedList = []
    this.Init()
  }
  PickerCard.prototype.IsDom = function(o){
    return typeof o === 'object' && o instanceof HTMLElement&& typeof o.nodeName == 'string' && o.nodeType === 1
  }
  PickerCard.prototype.Init = function () {
    this.trigger.addEventListener('click',() => {
      this.CreateContainer()
      this.CreateTitleItem()
      this.Open()
      this.StartListen()
    },false)
  }
  PickerCard.prototype.StartListen = function () {
    this.picker.addEventListener('click', e => {
      if (e.target.classList.contains('picker-card')) return this.Close()
      let className = e.target.className
      let classValue = e.target.innerHTML
      if (className.includes('picker-item')) {
        if (this.GetElement('.picker-preview-item-last').innerHTML === '请选择') {
            this.GetElement('.picker-preview-item-last').innerHTML = classValue
        } else {
          this.selectedList.splice(this.selectedList.length - 1, 1)
          this.selectedList.push(classValue)
          let renderList = this.GetRenderList()
          if (!renderList.length) {
            this.GetElement('.picker-preview-item-last').innerHTML = classValue
            return
          } else {
            this.Render()
            this.CreateTitleItem()
            return
          }
        }
        let RenderObj = this.GetRenderList().find(item => item[this.options.caseName.text] === classValue)
        if (!RenderObj.hasOwnProperty(this.options.caseName.children) || (RenderObj[this.options.caseName.children] && !RenderObj[this.options.caseName.children].length)) {
          this.selectedList.push(classValue)
          if (!this.options.isShowControl) {
            this.options.success && this.options.success(this.selectedList,RenderObj)
            this.Close()
          }
          return
        }
        this.selectedList.push(classValue)
        if(!isNaN(parseFloat(this.options.level))&&isFinite(this.options.level) && this.options.level == className.substr(12)*1+1){
          this.options.success && this.options.success(this.selectedList,RenderObj)
          return this.Close()
        }
        this.Render()
        this.CreateTitleItem()
      }
      if (className.includes('picker-preview-item')) {
        let ClickTitleIndex = className.substr(20, 1) * 1
        if(isNaN(ClickTitleIndex))return;
        console.log(ClickTitleIndex)
        this.selectedList = this.selectedList.slice(0, ClickTitleIndex)
        this.Render()
        this.CreateTitleItem()
      }
      if (className.includes('picker-card-cancel')) {
        this.Close()
      }
      if (className.includes('picker-card-confirm')) {
        if (!this.selectedList.length) return
        let RenderObj = this.GetRenderList(this.selectedList.slice(0,-1)).find(i=>i[this.options.caseName.text]===this.selectedList[this.selectedList.length-1])
        this.options.success && this.options.success(this.selectedList,RenderObj)
        this.Close()
      }
    })
  }
  PickerCard.prototype.CreateContainer = function () {
    document.body.insertAdjacentHTML('beforeend',`<div class="picker-card picker-card-hide"><div class="picker-card-container picker-card-hide"><div class="picker-card-content">${this.options.title && this.options.title.length? `<div class="picker-card-title">${this.options.title}</div>`: ''}${this.options.isShowControl? '<div class="picker-card-control"> <span class="picker-card-cancel">取消</span> <span class="picker-card-confirm">确定</span></div>': ''}<div class="picker-card-preview"><div class="picker-preview-item picker-preview-item-0"><span class="picker-preview-item-last picker-preview-active">请选择</span></div></div><div class="picker-card-view"></div></div></div></div>`)
    this.picker = this.GetElement('.picker-card')
    this.pickerTopbar = this.GetElement('.picker-card-preview')
    this.pickerContainer = this.GetElement('.picker-card-container')
    this.pickerList = this.GetElement('.picker-card-view')
    this.pickerTitle = this.GetElement('.picker-card-title')
    this.Render(this.list)
  }
  PickerCard.prototype.GetElement = function (el) {
    return document.querySelector(el)
  }
  PickerCard.prototype.Render = function () {
    this.pickerList.innerHTML = ''
    let html = ''
    let list = this.GetRenderList()
    for (let i = 0; i < list.length; i++) {
        html += `<li class="picker-item-${this.selectedList.length}">${list[i][this.options.caseName.text]}</li>`
    }
    setTimeout(() => {this.pickerList.innerHTML = `<ul>${html}</ul>`}, 100)
  }
  PickerCard.prototype.GetRenderList = function (s) {
    if ((!this.selectedList.length&&!s) || (s&&!s.length)) return this.list
    let CloneList = this.list.slice()
    let CloneSelectedList = s?s: this.selectedList.slice()
    let ListRender = []
    let fn = list => {
      for (let i = 0; i < CloneSelectedList.length; i++) {
        let ObjectList = list.find(item => item[this.options.caseName.text] == CloneSelectedList[0])
        ListRender = ObjectList[this.options.caseName.children] ? ObjectList[this.options.caseName.children] : []
        if (CloneSelectedList.length > 1) {
          CloneSelectedList.splice(0, 1)
          fn(ListRender)
        }
      }
    }
    fn(CloneList)
    return ListRender
  }
  PickerCard.prototype.Open = function () {
    this.picker.classList.remove('picker-card-hide')
    this.picker.classList.add('picker-card-show')
    this.pickerContainer.classList.remove('picker-card-hide')
    this.pickerContainer.classList.add('picker-card-show')
  }
  PickerCard.prototype.Close = function () {
    this.selectedList = []
    document.body.removeChild(this.picker)
  }
  PickerCard.prototype.CreateTitleItem = function () {
    let html = ''
    for (let i = 0; i < this.selectedList.length; i++) {
        html += `<div class="picker-preview-item"><span class="picker-preview-item-${i}">${this.selectedList[i]}</span></div>`
    }
    html += `<div class="picker-preview-item picker-preview-item-${this.selectedList.length - 1}"><span class="picker-preview-item-last picker-preview-active">请选择</span></div>`
    this.pickerTopbar.innerHTML = html
  }
  