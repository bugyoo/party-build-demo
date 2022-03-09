/**
 * 列表展示页缓存进入详情页之前的状态
 *  Created by yuyx.
 */

export default {
    methods: {
        // 获取分页查询参数
        getQueryPageParam(pageNum, pageSize) {
            if (this.searchConditionChange) {
                if(document.cacheFlag == 'myAuditAfterInfo' || document.cacheFlag == 'resourceAuditIndexInfo' || document.cacheFlag == 'thisLevelLibraryInfo' || document.cacheFlag == 'uploadTranscodingInfo'){
                    // console.log('详情页回来')
                    pageNum = Number(sessionStorage.getItem(`pageNum-${this.$route.name}`)) || 1;
                    document.cacheFlag = ''
                } else {
                    // console.log('本页面')
                    pageNum = 1;
                    sessionStorage.setItem(`pageNum-${this.$route.name}`, pageNum)
                    this.currentPage = 1
                }
                // console.log('走getQueryPageParam函数')
                pageSize = this.page.pageSize || 20;

                this.$set(this.page, 'pageNum', pageNum);
                this.$set(this.page, 'pageSize', pageSize);

                this.searchConditionChange = false;
            } else {
                pageNum = pageNum || this.page.pageNum;
                pageSize = pageSize || this.page.pageSize;
            }

            return { pageNum: pageNum - 1, pageSize };
        },


        // 执行获取缓存的分页当前页（在created周期函数执行）
        getPageNum(){
            if(document.cacheFlag == 'resourceAuditIndexInfo' && this.$route.name == 'resourceAuditIndexList'){
                this.currentPage = Number(sessionStorage.getItem(`pageNum-${this.$route.name}`))
            } else if(document.cacheFlag == 'thisLevelLibraryInfo' && this.$route.name == 'thisLevelLibraryList'){
                this.currentPage = Number(sessionStorage.getItem(`pageNum-${this.$route.name}`))
            } else if(document.cacheFlag == 'myAuditAfterInfo' && this.$route.name == 'myAuditAfterList'){
                this.currentPage = Number(sessionStorage.getItem(`pageNum-${this.$route.name}`))
            } else if(document.cacheFlag == 'uploadTranscodingInfo' && this.$route.name == 'uploadTranscodingList'){
                this.currentPage = Number(sessionStorage.getItem(`pageNum-${this.$route.name}`))
            } 
            else{
                sessionStorage.removeItem(`pageNum-${this.$route.name}`)
            }
        },

        // 根据路由判断何时获取查询条件缓存(该函数在mounted中执行)
        getCacheItem(){
            if(document.cacheFlag == 'resourceAuditIndexInfo' && this.$route.name == 'resourceAuditIndexList'){
                // this.queryFormData.name = sessionStorage.getItem(`queryFormData-name-${this.$route.name}`) || undefined
                // this.queryFormData.status = sessionStorage.getItem(`queryFormData-status-${this.$route.name}`) || undefined
                // this.queryFormData.time = JSON.parse(sessionStorage.getItem(`queryFormData-time-${this.$route.name}`)) || undefined
                // this.queryFormData.createOrgId = sessionStorage.getItem(`queryFormData-createOrgId-${this.$route.name}`) || undefined
                // document.cacheFlagResourceAuditIndexInfo = false
                this.queryFormData = JSON.parse(sessionStorage.getItem(`queryFormData-${this.$route.name}`))
                this.$refs.rolling.changeLabel()
            } else if( document.cacheFlag == 'thisLevelLibraryInfo' && this.$route.name == 'thisLevelLibraryList' ){
                // this.queryFormData.name = sessionStorage.getItem(`queryFormData-name-${this.$route.name}`) || undefined
                // this.queryFormData.used = sessionStorage.getItem(`queryFormData-used-${this.$route.name}`) || undefined
                // this.queryFormData.status = sessionStorage.getItem(`queryFormData-status-${this.$route.name}`) || undefined
                // this.queryFormData.auditStatus = sessionStorage.getItem(`queryFormData-auditStatus-${this.$route.name}`) || undefined
                // this.queryFormData.createTime = JSON.parse(sessionStorage.getItem(`queryFormData-createTime-${this.$route.name}`)) || undefined
                this.queryFormData = JSON.parse(sessionStorage.getItem(`queryFormData-${this.$route.name}`))
                this.$refs.rolling.changeLabel()
                // document.cacheFlag = ''
            } else if( document.cacheFlag == 'myAuditAfterInfo' && this.$route.name == 'myAuditAfterList'){
                // this.queryFormData.name = sessionStorage.getItem(`queryFormData-name-${this.$route.name}`) || undefined
                // this.queryFormData.status = sessionStorage.getItem(`queryFormData-status-${this.$route.name}`) || undefined
                // this.queryFormData.auditStatus = sessionStorage.getItem(`queryFormData-auditStatus-${this.$route.name}`) || undefined
                // this.queryFormData.time = JSON.parse(sessionStorage.getItem(`queryFormData-time-${this.$route.name}`)) || undefined
                // this.queryFormData.createOrgId = sessionStorage.getItem(`queryFormData-createOrgId-${this.$route.name}`) || undefined
                this.queryFormData = JSON.parse(sessionStorage.getItem(`queryFormData-${this.$route.name}`))
                this.$refs.rolling.changeLabel()
            } else if( document.cacheFlag == 'uploadTranscodingInfo' && this.$route.name == 'uploadTranscodingList' ){
                // this.queryFormData.name = sessionStorage.getItem(`queryFormData-name-${this.$route.name}`) || undefined
                // this.queryFormData.status = sessionStorage.getItem(`queryFormData-status-${this.$route.name}`) || undefined
                this.queryFormData = JSON.parse(sessionStorage.getItem(`queryFormData-${this.$route.name}`)) || undefined
            } 
            else{
                sessionStorage.removeItem(`queryFormData-${this.$route.name}`)
            }

        }
    }
}