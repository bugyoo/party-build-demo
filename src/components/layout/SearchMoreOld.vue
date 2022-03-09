<template>
    <div class="search-more" :class="visible ? 'dropdown' : 'retract'">
        <div style="margin: 10px 10px 0 10px;">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default JBoot({
        registryName: 'SearchMoreOld',

        props: {
            visible: Boolean
        },

        mounted (){
            document.addEventListener('click', this.closeSearchMore);
        },

        destroy (){
            document.removeEventListener('click', this.closeSearchMore);
        },

        methods: {
            closeSearchMore(event) {
                if(this.visible && !(event.path || []).some(item => item.classList && (item.classList.contains('search-more') || item.classList.contains('search-more-button')))){
                    this.$emit('closed');
                }
            }
        }
    }).build();
</script>

<style lang="scss">
    .search-more{
        position: absolute;
        width: 100%;
        top: 50px;
        left: 0;
        z-index: 4;
        background-color: #f5f5f5;
        /*border: 1px solid #e4e4e4;*/
        box-shadow: 2px 3px 5px #b5b5b5;
        /*overflow: hidden;*/
        overflow-y: auto;
        /*max-height: 300px;*/
        &.dropdown{
            animation: dropdown .1s ease 0s 1 normal both running;
            /*padding: 10px 10px 0 10px;*/
        }
        &.retract{
            /*animation: retract .3s ease 0s 1 normal both running;*/
            height: 0;
            border-top: none;
            padding: 0;
        }
    }

    @keyframes dropdown {
        0% {
            height: 0;
        }
        100% {
            height: auto;
        }
    }

    @keyframes retract {
        0% {
            min-height: 40px;
        }
        100% {
            min-height: 0;
            border-top: none;
            padding: 0;
        }
    }
</style>
