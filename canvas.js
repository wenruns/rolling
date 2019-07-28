let CanvasContainer = function ({
    element = '',
    width = null,
    height = null,
    background = '#ccc'
}){
    let parentElement = null;
    let canvas = {
        _attributes: {
            element: null,
            canvasObj: null,
            width: 200,
            height: 200,
            bgColor: "#ccc",
        },
        createCanvas: function(width, height, background){
            this._init({
                width: width,
                height: height,
                background: background,
            });
            this._attributes.element = document.createElement('canvas');
            this._attributes.canvasObj = this._attributes.element.getContext('2d');
            this._attributes.element.width = this._attributes.width;
            this._attributes.element.height = this._attributes.height;
            this._attributes.element.style.background = this._attributes.bgColor;
        },
        _init: function({
            width = null,
            height = null,
            background = null
        }) {
            width ? this._attributes.width = width : '';
            height ? this._attributes.height = height : '';
            background ? this._attributes.bgColor = background : '';
        },
        moveTo: function (x, y) {
            this._attributes.canvasObj.moveTo(x, y);
        },
        lineTo: function (x, y) {
            this._attributes.canvasObj.lineTo(x, y);
        },
        stroke: function () {
          this._attributes.canvasObj.stroke();
        },
        beginPath: function () {
            this._attributes.canvasObj.beginPath();
        },
        closePath: function (){
            this._attributes.canvasObj.closePath();
        },
        lineWidth: function (w = 1) {
            this._attributes.canvasObj.lineWidth = w;
        },
        fillRect: function (x, y, width, height) {
            this._attributes.canvasObj.fillRect(x, y, width, height);
        },
        rect: function(x, y, width, height){
            this._attributes.canvasObj.rect(x, y, width, height);
        },
        globalCompositeOperation: function (option = 'source-out') {
            this._attributes.canvasObj.globalCompositeOperation = option;
        },
        strokeStyle: function (color) {
            this._attributes.canvasObj.strokeStyle = color;
        },
        fillStyle: function (color) {
            this._attributes.canvasObj.fillStyle = color;
        },
        shadowColor: function (color) {
            this._attributes.canvasObj.shadowColor = color;
        },
        shadowBlur: function (number) {
            this._attributes.canvasObj.shadowBlur = number;
        },

        fill: function () {
            this._attributes.canvasObj.fill();
        },
        clearRect: function (x, y, width, height) {
            this._attributes.canvasObj.clearRect(x, y, width, height);
        },
        save: function () {
            return this._attributes.canvasObj.save();
        }
    };

    function checkWidth(width){
        width = width.replace('px', '');

        if(width.indexOf('%') >= 0){
            width = parentElement.clientWidth * Number(width.replace('%', '') / 100);
        }
        return width;
    }
    function checkHeight(height){
        height = height.replace('px', '');
        if(height.indexOf('%') >= 0){
            height = parentElement.clientHeight * (Number(height.replace('%', ''))/ 100);
        }
        return height;
    }



    this.init = () => {
        typeof element != 'object' ? parentElement = document.querySelector(element) : parentElement = element;
        canvas.createCanvas(checkWidth(width), checkHeight(height), background);
        parentElement.appendChild(canvas._attributes.element);
    }


    this.drawingBoard = ({
        color = 'blue',
        lineWith = '1',
     }) => {
        let _this = this;
        this._rubber = false;
        this._drawing = false;
        this._startX = 0;
        this._startY = 0;
        let button = document.createElement('div');

        canvas.lineWidth(lineWith);
        canvas.strokeStyle(color);

        button.innerHTML = "<button class='rubber'>橡皮檫</button>";
        parentElement.appendChild(button);
        button.querySelector('.rubber').addEventListener('click', function (e) {
            if(_this._rubber){
                _this._rubber = false;
                this.style = 'background: gray; color: black;';
            }else{
                _this._rubber = true;
                this.style = 'background: blue; color: white;';
            }
        })
        this.getCanvasElement().addEventListener('mousedown', function (e) {
            _this._drawing = true;
            if(_this._rubber){
                _this._startX = e.offsetX;
                _this._startY = e.offsetY;
            }else{
                canvas.beginPath();
                canvas.moveTo(e.offsetX, e.offsetY);
            }
        });

        this.getCanvasElement().addEventListener('mouseup', function (e) {
            _this._drawing = false;
            _this._startX = 0;
            _this._startY = 0;
            if(_this._rubber){

            }else{
                canvas.closePath();
            }
        })

        this.getCanvasElement().addEventListener('mousemove', function (e) {
            if(_this._drawing){
                if(_this._rubber){
                    canvas.clearRect(_this._startX, _this._startY, e.offsetX - _this._startX, e.offsetY - _this._startY);
                }else{
                    canvas.lineTo(e.offsetX, e.offsetY);
                    canvas.stroke();
                }

            }
        })
    }


    this.getCanvasElement = () => {
        return canvas._attributes.element;
    }



    this.getConvasContext2d = () => {
        return canvas._attributes.canvasObj;
    }

    this.init();

}




