FROM registry.cn-qingdao.aliyuncs.com/hub_fosung/frontend:1.2
MAINTAINER  liupeng <liupeng@hd100.com>

# 复制配置文件
# 测试环境
ADD back-config.conf /data/nginx/back-config.conf
ADD front-config.conf /data/nginx/front-config.conf
# 正式环境
#ADD back-config-pro.conf /data/nginx/back-config.conf
#ADD front-config-pro.conf /data/nginx/front-config.conf

ADD ./dist /data/resources/dist
