export const questions = [{
    type: 'checkbox',
    title: '您对 LemonBox 的第一印象是？（多选）',
    options: ['有专业的营养师团队', '定制的，适合我的需求', '进口产品', '颜值高', '没什么印象', '其他'],
    other: '其他',
    required: true,
},
{
    type: 'radio',
    title: '对于 LemonBox，您觉得哪方面最需要提高？（单选）',
    options: ['问卷问题需要更全面', '价格需要下调', '包装需要做得更精致', '推荐补剂颗数应该减少', '营养补充剂品质还有待优化', '这个品牌我没听过，还需要观察', '其他'],
    other: '其他',
    required: true,
},
{
    type: 'textarea',
    title: '您当时为什么没有选择购买我们的产品？',
    required: true,
},
{
    type: 'checkbox',
    title: '您平时最常使用的 3 个手机 App 是？（多选，限选 3 个）',
    options: ['微信', '微博', '抖音', 'BiliBili', '小红书', '知乎', '豆瓣', '百度贴吧', '蘑菇街', '美图秀秀', '其他'],
    other: '其他',
    required: true,
    range: {
        max: 3
    },
},
{
    type: 'radio',
    title: '您的年龄是？',
    options: ['18 以下', '18 - 25', '26 - 30', '31 - 35', '36 - 40', '41以上'],
    other: '',
    required: true,
},
{
    type: 'textarea',
    title: '您目前所生活的城市是？（选答）',
    required: false,
},
{
    type: 'radio',
    title: '您是否愿意接受我们的电话回访或短信促销信息？如果愿意，欢迎留下您的手机号码~',
    options: ['不愿意', '愿意'],
    other: '愿意',
    required: true,
}
]