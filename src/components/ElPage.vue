<script>
    import { Pagination } from 'element-ui';

    let pageConfig = {
        name: 'ElPagination',

        componentName: 'ElPagination',

        registryName: 'el-pagination',

        mixins: [ Pagination ],

        props: {
            pageSizes: {
                type: Array,
                default (){
                    return [2, 5, 10, 15, 30, 50, 70, 100, 200, 300]
                }
            }
        },

        methods: {
            emitChange() {
                setTimeout(() => {
                    if (this.internalCurrentPage !== this.lastEmittedPage || this.userChangePageSize) {
                        this.$emit('current-change', this.internalCurrentPage);
                        this.lastEmittedPage = this.internalCurrentPage;
                        this.userChangePageSize = false;
                    }
                }, 100);
            }
        }
    };

    export default pageConfig;
</script>
