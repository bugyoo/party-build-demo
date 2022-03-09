<script>
    import { Form } from 'element-ui';

    let tfItemConfig = {
        name: 'ElForm',

        componentName: 'ElForm',

        registryName: 'el-form',

        extends: Form,

        created() {
            this.$on('el.form.addField', (field) => {
                if (field) {
                    this.fields.push(field);
                    if( field.prop && String(field.prop).length>0){
                        if(~field.prop.indexOf('.')){
                            field.prop.split('.').filter(item => !!item).reduce((result, currentKey, currentIndex, all) => {
                                if(all.length - 1 > currentIndex){
                                    result[currentKey] = result[currentKey] || {};

                                    return result[currentKey];
                                }else{
                                    result[currentKey] = field.fieldValue;
                                }
                            }, this.model);
                        }else{
                            this.$set( this.model, field.prop, field.fieldValue)
                        }
                    }
                }
            });

            this.$on('el.form.removeField', (field) => {
                if (field.prop) {
                    this.fields.splice(this.fields.indexOf(field), 1);
                }
            }) ;
        },
    };

    export default tfItemConfig;
</script>
