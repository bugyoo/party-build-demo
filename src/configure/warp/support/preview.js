export default {
    props: {},

    data() {
        return {
            _imgDom: undefined
        }
    },

    computed: {},

    methods: {
        _previewImage (url){
            if(!url){
                return !this.$warn('请传入有效的图片链接!');
            }

            if(!this._imgDom){
                this._imgDom = document.createElement('img');
            }

            this._imgDom.src = url;

            this._showPreviewMask().appendChild(this._imgDom);
        },

        _showPreviewMask (){
            let mask = document.querySelector('[role="preview-mask"]');

            if(mask) {
                mask.style.display = 'block';
            }else{
                mask = document.createElement('div');

                let close = document.createElement('div');
                close.setAttribute('role', 'close-mask');
                close.classList.add('image-preview-close');
                close.innerHTML = 'X';

                mask.appendChild(close);

                document.body.appendChild(mask);
            }

            mask.setAttribute('role', 'preview-mask');
            mask.classList.add('image-preview-mask');
            mask.addEventListener('click', function ({ target, currentTarget }) {
                if(!currentTarget || !['preview-mask', 'close-mask'].includes(target.getAttribute('role'))){
                    return;
                }

                currentTarget.style.display = 'none';
                currentTarget.children && Array.from(currentTarget.children).filter(child => child.getAttribute('role') !== 'close-mask').forEach(child => currentTarget.removeChild(child));
            }.bind(this));

            return mask;
        }
    },

    watch: {}
}
