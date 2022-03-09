let datalist = [
    {
        id:1,
        username:'董亮',
        age:22,
        sex:'男',
        status:true,
        file:'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
    },
    {
        id:2,
        username:'彭于晏',
        age:23,
        sex:'男',
        status: false,
        file:'http://119.188.115.252:9000/cloud-sys/testDir/agreement(1).pdf',
    },
]

export default {
    datalist,
    totalelements:datalist.length,
    pagesize:15,
    pagenum:0
}