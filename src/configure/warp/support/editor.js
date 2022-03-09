/**
 * Created by litao on 2018/11/22.
 */
export default {
    data (){
        return {
            editorInstance: undefined
        }
    },

    methods: {
        /**
         * 初始化编辑器
         * @param target
         * @param content
         */
        initEditor ({ target, content }){
            let hook = {
                cbValue: undefined,

                callback: (html) => {
                    hook.cbValue && typeof hook.cbValue === 'function' && hook.cbValue(html);
                },

                change (callback){
                    hook.cbValue = callback;
                },
                setVal (val){

                }
            };

            let wangEditor = require('wangeditor');

            !this.editorInstance && (this.editorInstance = new wangEditor(target));

            this.editorInstance.customConfig.onchange = hook.callback;
            this.editorInstance.customConfig.zIndex = 100;
            this.editorInstance.customConfig.showLinkImg = false;
            this.editorInstance.customConfig.uploadImgServer = '/sys/attachment/upload';
            this.editorInstance.customConfig.uploadFileName = 'file';
            let uploadImgHeaders = {};
            uploadImgHeaders[this.$token.getTokenKey()] = this.$token.getToken();
            this.editorInstance.customConfig.uploadImgHeaders = uploadImgHeaders;
            this.editorInstance.customConfig.uploadImgHooks = {
                customInsert: function (insertImg, result, editor) {
                    insertImg(result.data.attachment);
                }
            };

            !this.editorInstance.$textContainerElem && this.editorInstance.create();

            this.initFullScreen(target);

            this.initImgZoomHandler(target);

            this.editorInstance.txt.html(content);

            hook.setVal = val => this.editorInstance.txt.html(val);

            return hook;
        },

        /**
         * 初始化全屏
         * @param target
         */
        initFullScreen (target){
            let menuContainer = target.querySelector('.w-e-toolbar');

            if(!menuContainer) return;

            target.classList.add('editor-full_screen');

            let fullScreenButton =  new this.$JBootContainer.$vue({
                data (){
                    return {
                        fullScreenClass: 'is-full_screen',
                        isFullScreen: false
                    }
                },

                render (h){
                    return h('div', {
                        class: 'w-e-menu'
                    }, [
                        h('i', {
                            class: `iconfont ${this.isFullScreen ? 'icon-cancel-full-screen' : 'icon-quanping'} editor-full_screen-button`,
                            style: {
                                fontWeight: 600
                            },
                            on: {
                                click: () => {
                                    if(this.isFullScreen){
                                        target.classList.remove(this.fullScreenClass);
                                    }else{
                                        target.classList.add(this.fullScreenClass);
                                    }
                                    this.isFullScreen = !this.isFullScreen;
                                }
                            }
                        })
                    ])
                }
            }).$mount().$el;

            menuContainer.appendChild(fullScreenButton);
        },

        /**
         * 初始化图片缩放
         * @param target
         */
        initImgZoomHandler (target){
            if(!target || !(target instanceof HTMLElement)) return;

            target.addEventListener('click', (event) => {
                if(event.target.tagName === 'IMG'){
                    this.toggleImageDragSign(event.target)
                }
            });
        },

        /**
         * 切换图片缩放标记
         * @param target
         */
        toggleImageDragSign (target){
            let { parentElement } = target;

            if(parentElement.classList.contains('image-drag-parent')){
                parentElement.classList.remove('image-drag-parent');
                target.classList.remove('image-drag-target');

                let dragDom = parentElement.querySelector('.image-drag-class');
                dragDom && parentElement.removeChild(dragDom);

                window.removeEventListener('click', this.removeImageDragHandler, true);
            }else{
                parentElement.classList.add('image-drag-parent');
                target.classList.add('image-drag-target');

                let dragDom = document.createElement('div');
                dragDom.classList.add('image-drag-class');
                dragDom.style.left = target.offsetLeft + target.offsetWidth + 'px';
                dragDom.style.top = target.offsetTop + target.offsetHeight + 'px';
                dragDom.style.marginLeft = '-6px';
                dragDom.style.marginTop = '-6px';
                parentElement.appendChild(dragDom);

                this.bindDragEvent(dragDom, target, this.editorInstance.$textContainerElem[0]);

                window.addEventListener('click', this.removeImageDragHandler, true);
            }
        },

        /**
         * 删除图片缩放标记
         */
        removeImageDragHandler ({ target }){
            if(!target.classList.contains('image-drag-class'))
                Object.values(document.getElementsByClassName('image-drag-target')).forEach(dom => this.toggleImageDragSign(dom));
        },

        /**
         * 绑定事件
         * @param drag
         * @param target
         * @param container
         */
        bindDragEvent (drag, target, container){
            drag.addEventListener('mousedown', moveHandler.bind(this, target));

            function moveHandler(img, event) {
                //计算拖拽
                let diffX, diffY;

                //鼠标位置
                let mouseX = event.pageX, mouseY = event.pageY;

                //拖拽点位置
                let dragLeft = parseFloat(drag.style.left, 10), dragTop = parseFloat(drag.style.top, 10);

                //图片大小
                let imgWidth = img.offsetWidth, imgHeight = img.offsetHeight;

                container.addEventListener('mousemove', mousemove);
                container.addEventListener('mouseup', mouseup);

                function mousemove (e) {
                    // 计算差额
                    diffX = e.pageX - mouseX;
                    diffY = e.pageY - mouseY;

                    // --------- 计算拖拽点的位置 ---------
                    let currentDragMarginLeft = dragLeft + diffX;
                    let currentDragMarginTop = dragTop + diffY;
                    drag.style.left = currentDragMarginLeft + 'px';
                    drag.style.top = currentDragMarginTop + 'px';

                    // --------- 计算图片的大小 ---------
                    let currentImgWidth = imgWidth + diffX;
                    let currentImggHeight = imgHeight + diffY;
                    img.width = currentImgWidth;
                    img.height = currentImggHeight;
                }

                function mouseup() {
                    container.removeEventListener('mousemove', mousemove);
                    container.removeEventListener('mouseup', mouseup);

                    //拖拽点位置
                    let dragLeft = parseFloat(drag.style.left, 10), dragTop = parseFloat(drag.style.top, 10);

                    drag.style.left = dragLeft + 'px';
                    drag.style.top = dragTop + 'px';
                }
            }
        }
    }
}
