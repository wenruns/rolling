let seemlessRolling = function ({
    element = null,
    images = null,
    type = 0,
    urls = [],
    seconds = 3000,
    duration = 1000,
    width = '80vw',
    height = '40vw',
    align = 'center',
	direction = 'left',
}) {
    this._init = function () {
        this.initData();
        this.myfns.start_init();
    }

    this.initData = function () {
        this._element = (typeof element) == 'object' ? element : document.querySelector(element);
        if(typeof images == 'object' || typeof images == 'array'){
            this._images = images;
        }else{
            if(typeof images == 'string'){
                this._images = images.split(',');
            }else{
                throw new Error('The images argument is not right! It expect the array or string given! If it is string, it would try use obj.split(",", images) make it to be an array!');
            }
        }
        if(this._images.length == 2){
            this._images.push(this._images[0]);
            this._images.push(this._images[1]);
        }else if(this._images.length == 1){
            this._images.push(this._images[0]);
            this._images.push(this._images[0]);
        }


        this._type = type;
        this._urls = urls;
		this._duration = duration;
        this._seconds = seconds > 0 ? duration + seconds : duration + 0.1;
		/**
		 * 内部自定义变量
		 */
		this._handle = null; // 定时器句柄
        this.dispearing = false;  // 碎片化之判断是否为隐藏阶段
        this.divs = [];  // 碎片化之碎片元素集
        this.pic_num = 0;  // 碎片化之当前图片索引
        this._isOver = false;
		this._isMove = false;
        this._windowIsOnFocus = true; // 判断当前页面是否激活状态
    }

    this.myfns = {
        /**
         *初始化启动
         */
        start_init: () => {
            var hiddenProperty = 'hidden' in document ? 'hidden' :
                'webkitHidden' in document ? 'webkitHidden' :
                    'mozHidden' in document ? 'mozHidden' :
                        null;
            // 不同浏览器的事件名
            var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
            document.addEventListener(visibilityChangeEvent, () => {
                if (!document[hiddenProperty]) {
                    this._windowIsOnFocus = true;
                    // document.title = '页面激活';
                }else{
                    this._windowIsOnFocus = false;
                    // document.title='页面非激活';
                }
            });
            this.myfns.init_element();
            switch (this._type) {
                case 1:
                    this.myfns.fragmentationHtml();
                    break;
                default:
                    this.myfns.seemlessRollingHtml();
            }
        },

		/**
		 * 初始化父元素样式
		 */
        init_element: () => {
            this._element.classList.add('seamless_rolling');
            switch (align) {
                case 'left':
                    this._element.style = 'width:'+width+'; height:'+height+';margin-left:0px;';
                    break;
                case 'right':
                    this._element.style = 'width:'+width+'; height:'+height+'; margin-right: 0px;';
                    break;
                default:
                    this._element.style = 'width:'+width+'; height:'+height+';margin:auto;';
            }
        },

		getAbDirection: () => {
			let ab_direction = 'right';
			switch (direction){
				case 'right':
					ab_direction = 'left';
					break;
				case 'up':
					ab_direction = 'down';
					break;
				case 'down':
					ab_direction = 'up';
					break;
				default:
					break;
			}
			return ab_direction;
		},


        /**
         * 无缝滚动html
         */
        seemlessRollingHtml: () => {
			if(this._images.length <= 0){
				return false;
			}
            let sty_cont = ' transition-duration: '+this._duration+'ms;\n' +
                '    -o-transition-duration: '+this._duration+'ms;\n' +
                '    -moz-transition-duration: '+this._duration+'ms;\n' +
                '    -webkit-transition-duration: '+this._duration+'ms;';
            this.myfns.myInsertStyle('.trasition-duration', sty_cont);


            let html_str = '<div class="seamless_rolling_img_boxs">';
            html_str += '<div class="seamless_rolling_img seamless_rolling_img_0 init-show" data-id="0"></div>' +
                '<div class="seamless_rolling_img seamless_rolling_img_1 init-right" data-id="1"></div>' +
                '<div class="seamless_rolling_img seamless_rolling_img_2 init-left" data-id="2"></div>';
            html_str += '</div>';

            let nav_str = '<div class="seamless_rolling_img_navs">';
            for (var i=0, j=0; i<this._images.length; i++, j++){
                    nav_str += '<span class="seamless_rolling_nav"></span>';
                    if(j<3){
                        let style_content = 'background-image: url("'+this._images[j]+'");\n' +
                            '    -moz-background-image: url("'+this._images[j]+'");\n' +
                            '    -o-background-image: url("'+this._images[j]+'");\n' +
                            '    -webkit-background-image: url("'+this._images[j]+'");';
                        this.myfns.myInsertStyle('.seamless_rolling_img_'+j+':after', style_content);
                    }
            }
            nav_str += '</idv>';

            this.pic_index = 2;
            this._element.appendChild(this.myfns.htmlStringToNode(html_str));

            this._element.appendChild(this.myfns.htmlStringToNode(nav_str));

			/* 事件处理 */
            this.myfns.seemlessRollingEvents();
			/* 启动滚动 */
            this.myfns.seemlessRollingStart();
        },
		/* 启动滚动 */
        seemlessRollingStart: () => {
            this.images_element = this._element.querySelectorAll('.seamless_rolling_img');
            this._img_end = this.images_element.length - 1;
            let ab_direction = this.myfns.getAbDirection();
            this.pic_num = 0;
            this._handle = setInterval(() => {
                if(this._windowIsOnFocus){
                    this.images_element[this.pic_num].classList.add('init-'+direction);
                    this.images_element[this.pic_num].classList.add('trasition-duration');
                    this.images_element[this.pic_num].classList.remove('init-show');
                    this.pic_num++;
                    if(this.pic_num > this._img_end){
                        this.pic_num = 0;
                    }
                    this.images_element[this.pic_num].classList.add('init-show');
                    this.images_element[this.pic_num].classList.add('trasition-duration');
                    this.images_element[this.pic_num].classList.remove('init-'+ab_direction);
                }
            }, this._seconds)

        },
		/* 添加事件 */
        seemlessRollingEvents: () => {
            let obj = document.querySelectorAll('.seamless_rolling_img');
            let n = 0;
			let move_startX = 0,
				move_endX = 0,
				move_startY = 0,
				move_endY = 0;
            obj.forEach((item, index) => {
                item.addEventListener('transitionstart', () => {
					this._isOver = true;
                });
                item.addEventListener('transitionend', () => {
                    n++;
                    item.classList.remove('trasition-duration');
                    if(n < 2){
                        return false;
                    }else{
                        n = 0;
                    }
					this._isOver = false;
					if(this._isMove){
						this._isMove = false;
						move_startX = 0;
                        move_endX = 0;
                        move_startY = 0;
                        move_endY = 0;
					}
					let ab_direction = this.myfns.getAbDirection();
					var j = 0, i = 0;
                    this.images_element[this.pic_num].classList.remove('init-'+direction);
                    this.images_element[this.pic_num].classList.remove('init-'+ab_direction);

					switch (Number(this.pic_num)){
                        case 0:
                            i = 2;
                            j = 1;
                            break;
                        case 1:
                            i = 0;
                            j = 2;
                            break
                        case 2:
                            i = 1
                            j = 0;
                            break
                        default:
                    }
                    this.images_element[i].classList.remove('init-'+ab_direction);
					this.images_element[i].classList.remove('init-show');
                    if(this.pic_index >= this._images.length){
                        this.pic_index = 0;
                    }
                    this.images_element[j].classList.remove('init-'+direction);
                    this.images_element[j].classList.add('init-'+ab_direction);
                    this.images_element[j].setAttribute('data-id', this.pic_index);

                    let style_content = 'background-image: url("'+this._images[this.pic_index]+'");\n' +
                        '    -moz-background-image: url("'+this._images[this.pic_index]+'");\n' +
                        '    -o-background-image: url("'+this._images[this.pic_index]+'");\n' +
                        '    -webkit-background-image: url("'+this._images[this.pic_index]+'");';

                    this.myfns.myDeleteStyle('.seamless_rolling_img_'+j+'::after');
                    this.myfns.myInsertStyle('.seamless_rolling_img_'+j+':after', style_content);
                    this.pic_index++;
                });

                item.addEventListener('click', (e) => {
                    if(urls[e.target.dataset.id]){
                        window.location.href = urls[e.target.dataset.id];
                    }
                })

                // item.addEventListener('touchstart', (e) => {
				// 	this._isMove = true;
				// 	if(this._isOver){
				// 		return false;
				// 	}
				// 	move_startX = e.targetTouches[0].pageX;
				// 	move_startY = e.targetTouches[0].pageY;
				// });
				// item.addEventListener('touchmove', (e) => {
				// 	if(this._isOver){
				// 		return false;
				// 	}
				// 	move_endX = e.targetTouches[0].pageX;
				// 	move_endY = e.targetTouches[0].pageY;
				// 	if(direction == 'left' || direction == 'right'){
				// 		this.myfns.seemlessRollingMove(item, index, move_endX-move_startX);
				// 	}
				// });
				// item.addEventListener('touchend', (e) => {
				// 	if(this._isOver){
				// 		return false;
				// 	}
				// 	// this._isOver = false;
				// 	let did = 'left',
				// 		dex1 = index + 1 <= this.images_element.length-1 ? index +1 : 0,
				// 		dex = index - 1 >= 0 ? index - 1 : this.images_element.length - 1;
				// 	this.images_element[dex1].classList.remove('seamless_rolling_left');
				// 	this.images_element[dex].classList.remove('seamless_rolling_right');
				//
				// 	if((move_endX - move_startX) > 0){
				// 		did = 'right';
				// 		this.pic_num++;
				// 		if(this.pic_num > this.images_element.length -1){
				// 			this.pic_num = 0;
				// 		}
				// 		this.images_element[dex1].classList.add('seamless_rolling_left_show');
				// 		this.images_element[dex1].classList.add('show');
				// 		this.images_element[dex1 + 1 <= this.images_element.length - 1 ? dex1 + 1 : 0].classList.add('seamless_rolling_left');
				// 	}else{
				// 		this.pic_num--;
				// 		if(this.pic_num < 0){
				// 			this.pic_num = this.images_element - 1;
				// 		}
				// 		this.images_element[dex].classList.add('seamless_rolling_right_show');
				// 		this.images_element[dex].classList.add('show');
				// 		this.images_element[dex - 1 >= 0 ? dex -1 : this.images_element.length -1].classList.add('seamless_rolling_right');
				// 	}
				// 	item.classList.add('seamless_rolling_'+did+'_hide');
				// 	this.images_element[dex1].style = '';
				// 	this.images_element[dex].style = '';
				// 	item.style = '';
				// });
            })
        },

        /**
         * 碎片化html
         */
        fragmentationHtml: () => {
            let divw = this._element.clientWidth / 10;
            let divh = this._element.clientHeight / 10;
            let html_str = '<a class="fragmentation" href="'+(this._urls[0] ? this._urls[0] : 'javascript:void(0)')+'">';
                for(var i = 0; i < 100; i++){
                    let x = i % 10;
                    let y = parseInt(i/10);
                    html_str += '<div class="images" style="background-position: -'+(x*divw)+' -'+(y*divh)+';left: '+(x*divw)+'px; top: '+(y*divh)+'px;background-image: url('+this._images[0]+');'+'"></div>';
                }
                html_str += '</a>'
            this._a = this.myfns.htmlStringToNode(html_str);
                this.divs = this._a.querySelectorAll('.images');
            this._element.appendChild(this._a);
            this.myfns.fragmentationEvents();
            this.myfns.fragmentationStart();
        },

		/**
		 * 启动碎片化
		 */
        fragmentationStart: () => {
            this._handle = setInterval(() => {
                if(!this._isOver){
                    this.myfns.fragmentationDisappear();
                }
            }, this._seconds * 1000)
        },

        /**
         * 碎片化事件
         */
        fragmentationEvents: () => {
            let n = 0;
            for(var i = 0; i < this.divs.length; i++){
                this.divs[i].addEventListener('transitionstart', () => {
                    if(n == 0){
                        console.log('transitionstart...')
                    }
                })
                this.divs[i].addEventListener('transitionend',  () => {
                    if(this.dispearing){
                        if(n > 100){
                            console.log('end');
                            this.dispearing = false;
                            this.myfns.fragmentationAppear();
                            n=0;
                        }else{
                            n++;
                        }
                    }

                })
            }
            this._a.addEventListener('mouseover', () => {
                console.log('over...');
                this._isOver = true;
            })
            this._a.addEventListener('mouseleave', () => {
                console.log('leave...');
                this._isOver = false;
            })
            this._a.addEventListener('touchstart', () => {
                console.log('touchstart...');
                this._isOver = true;
            })
            this._a.addEventListener('touchend', () => {
                console.log('touchend...');
                this._isOver = false;
            })
        },

        /**
         * 碎片化隐藏
         */
        fragmentationDisappear: () => {
            this.dispearing = true;
            for(var i=0; i<this.divs.length; i++){
                this.divs[i].style.transform="skew("+(60*Math.random())+"deg) translateZ("+(Math.random()*1000)+"px)";
                this.divs[i].style.opacity = '0';
            }
        },

        /**
         * 碎片化展示
         */
        fragmentationAppear: () => {
            console.log('appear...');
            this.pic_num += 1;
            if(this.pic_num == this._images.length){
                this.pic_num = 0;
            }
            for (var i = 0; i < this.divs.length; i++){
                // this.divs[i].className = '';
                this.divs[i].style.transform = '';
                this.divs[i].style.opacity = '';
                this.divs[i].style.backgroundImage = "url('"+this._images[this.pic_num]+"')"
            }
            if(this._urls.length){
                this._a.setAttribute('href', this._urls[this.pic_num] ? this._urls[this.pic_num] : 'javascript:void(0)');
            }
        },

        /**
         * 向css样式追加
         * @param style_name
         * @param style_content
         * @param style_position
         */
        myInsertStyle: (style_name, style_content, style_position = 0) => {
			if(!this._styleSheet){
				for(var i = 0; i < document.styleSheets.length; i++){
					var hre = document.styleSheets[i].href;
					if(hre && hre.indexOf('/seamless_rolling.css') >= 0){
						this._styleSheet = document.styleSheets[i];
						break;
					}
				}
			}

            if(this._styleSheet.insertRule){
                this._styleSheet.insertRule(style_name+'{'+style_content+'}', style_position);
            }else {
                this._styleSheet.addRule(style_name, style_content, style_position);
            }
        },

        /**
         *
         */
        myDeleteStyle: (rules_name) => {
            if(!this._styleSheet){
                for(var i = 0; i < document.styleSheets.length; i++){
                    var hre = document.styleSheets[i].href;
                    if(hre && hre.indexOf('/seamless_rolling.css') >= 0){
                        this._styleSheet = document.styleSheets[i];
                        break;
                    }
                }
            }
            var rules = this._styleSheet.rules || this._styleSheet.cssRules;
            for(var i = 0; i < rules.length; i++){
                if(rules[i].selectorText == rules_name){
                    if(this._styleSheet.deleteRule){
                        this._styleSheet.deleteRule(i);
                    }else if(this._styleSheet.removeRule){
                        this._styleSheet.removeCookie(i);
                    }
                    break;
                }
            }

        },


        /**
         * 将html字符串转换为节点元素
         * @param html_str
         * @returns {ChildNode}
         */
        htmlStringToNode: function (html_str) {
            return new DOMParser().parseFromString(html_str, 'text/html').body.childNodes[0];
        },

    };

    this._init();

}
